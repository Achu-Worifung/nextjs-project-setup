import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import db from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

interface CarBookingRequest {
  companyId: string;
  modelId: string;
  pickupDate: string;
  dropoffDate: string;
  days: number;
  pickupLocationId: string;
  dropoffLocationId: string;
  price: number;
  numberPassengers: number;
}

interface CarBookingRow {
  bookingid: string;
  carbookingid: string;
  companyname: string;
  make: string;
  model: string;
  year: number;
  pickuplocationname: string;
  dropofflocationname: string;
  pickupdate: string;
  dropoffdate: string;
  days: number;
  price: string;
  numberpassengers: number;
  carcheckinstatus: string;
  carbookingdatetime: string;
}

interface DecodedToken {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  exp: number;
}

export async function POST(req: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authorization token required' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    
    // Verify JWT token
    let decoded: DecodedToken;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    // Check if token is expired
    if (Date.now() >= decoded.exp * 1000) {
      return NextResponse.json({ error: 'Token expired' }, { status: 401 });
    }

    // Parse booking data
    const bookingData: CarBookingRequest = await req.json();

    // Validate required fields
    const requiredFields = ['companyId', 'modelId', 'pickupDate', 'dropoffDate', 'days', 'pickupLocationId', 'dropoffLocationId', 'price', 'numberPassengers'];
    const missingFields = requiredFields.filter(field => !bookingData[field as keyof CarBookingRequest]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }

    console.log('Creating car booking for user:', decoded.userId);
    console.log('Booking data:', bookingData);

    // Start transaction
    const client = await db.connect();
    
    try {
      await client.query('BEGIN');

      // Find or create car inventory record (simplified approach)
      // In a real system, you would query for actual available inventory
      const inventoryResult = await client.query(`
        SELECT ci.InventoryID 
        FROM Cars.CarInventory ci
        WHERE ci.CompanyID = $1 AND ci.ModelID = $2
        LIMIT 1
      `, [bookingData.companyId, bookingData.modelId]);

      let inventoryId;
      if (inventoryResult.rows.length > 0) {
        inventoryId = inventoryResult.rows[0].inventoryid;
      } else {
        // Create a placeholder inventory record if none exists
        const newInventoryResult = await client.query(`
          INSERT INTO Cars.CarInventory (CompanyID, ModelID, DatesAvailable, DatesUnavailable, DailyPrice)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING InventoryID
        `, [
          bookingData.companyId,
          bookingData.modelId,
          bookingData.pickupDate,
          bookingData.dropoffDate,
          bookingData.price / bookingData.days // Daily price
        ]);
        inventoryId = newInventoryResult.rows[0].inventoryid;
      }

      // Create car booking
      const carBookingResult = await client.query(`
        INSERT INTO Cars.CarBookings (
          UserID, InventoryID, PickupDate, DropoffDate, Days, 
          PickupLocation, DropoffLocation, Price, NumberPassengers, 
          CarCheckInStatus, CarBookingDateTime
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
        RETURNING CarBookingID
      `, [
        decoded.userId,
        inventoryId,
        bookingData.pickupDate,
        bookingData.dropoffDate,
        bookingData.days,
        bookingData.pickupLocationId,
        bookingData.dropoffLocationId,
        bookingData.price,
        bookingData.numberPassengers,
        'Pending'
      ]);

      const carBookingId = carBookingResult.rows[0].carbookingid;

      // Create main booking record
      const mainBookingResult = await client.query(`
        INSERT INTO ManageBookings.Bookings (UserID, BookingType, BookingStatus, TotalPaid, PaymentID)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING BookingID
      `, [
        decoded.userId,
        'Car',
        'Paid',
        bookingData.price,
        '00000000-0000-0000-0000-000000000001' // Placeholder payment ID
      ]);

      const bookingId = mainBookingResult.rows[0].bookingid;

      await client.query('COMMIT');

      // Fetch complete booking details for response
      const bookingDetails = await client.query(`
        SELECT 
          mb.BookingID,
          cb.CarBookingID,
          rc.CompanyName,
          cm.Make,
          cm.Model,
          cm.Year,
          pl.LocationName as PickupLocationName,
          dl.LocationName as DropoffLocationName,
          cb.PickupDate,
          cb.DropoffDate,
          cb.Days,
          cb.Price,
          cb.NumberPassengers,
          cb.CarCheckInStatus,
          cb.CarBookingDateTime
        FROM ManageBookings.Bookings mb
        JOIN Cars.CarBookings cb ON mb.UserID = cb.UserID
        JOIN Cars.CarInventory ci ON cb.InventoryID = ci.InventoryID
        JOIN Cars.RentalCompanies rc ON ci.CompanyID = rc.CompanyID
        JOIN Cars.CarModels cm ON ci.ModelID = cm.ModelID
        JOIN Cars.RentalLocations pl ON cb.PickupLocation = pl.LocationID
        JOIN Cars.RentalLocations dl ON cb.DropoffLocation = dl.LocationID
        WHERE mb.BookingID = $1 AND cb.CarBookingID = $2
      `, [bookingId, carBookingId]);

      const booking = bookingDetails.rows[0];

      return NextResponse.json({
        success: true,
        message: 'Car booking created successfully',
        booking: {
          bookingId: booking.bookingid,
          carBookingId: booking.carbookingid,
          companyName: booking.companyname,
          vehicle: `${booking.make} ${booking.model} (${booking.year})`,
          pickupLocation: booking.pickuplocationname,
          dropoffLocation: booking.dropofflocationname,
          pickupDate: booking.pickupdate,
          dropoffDate: booking.dropoffdate,
          days: booking.days,
          numberPassengers: booking.numberpassengers,
          totalPaid: parseFloat(booking.price),
          status: booking.carcheckinstatus,
          bookingDateTime: booking.carbookingdatetime
        }
      });

    } catch (dbError) {
      await client.query('ROLLBACK');
      throw dbError;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Car booking error:', error);
    return NextResponse.json(
      { error: 'Failed to create car booking' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authorization token required' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    
    // Verify JWT token
    let decoded: DecodedToken;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    // Check if token is expired
    if (Date.now() >= decoded.exp * 1000) {
      return NextResponse.json({ error: 'Token expired' }, { status: 401 });
    }

    console.log('Fetching car bookings for user:', decoded.userId);

    // Fetch user's car bookings
    const result = await db.query(`
      SELECT 
        mb.BookingID,
        cb.CarBookingID,
        rc.CompanyName,
        cm.Make,
        cm.Model,
        cm.Year,
        pl.LocationName as PickupLocationName,
        dl.LocationName as DropoffLocationName,
        cb.PickupDate,
        cb.DropoffDate,
        cb.Days,
        cb.Price,
        cb.NumberPassengers,
        cb.CarCheckInStatus,
        cb.CarBookingDateTime
      FROM ManageBookings.Bookings mb
      JOIN Cars.CarBookings cb ON mb.UserID = cb.UserID
      JOIN Cars.CarInventory ci ON cb.InventoryID = ci.InventoryID
      JOIN Cars.RentalCompanies rc ON ci.CompanyID = rc.CompanyID
      JOIN Cars.CarModels cm ON ci.ModelID = cm.ModelID
      JOIN Cars.RentalLocations pl ON cb.PickupLocation = pl.LocationID
      JOIN Cars.RentalLocations dl ON cb.DropoffLocation = dl.LocationID
      WHERE mb.UserID = $1 AND mb.BookingType = 'Car'
      ORDER BY cb.CarBookingDateTime DESC
    `, [decoded.userId]);

    const bookings = result.rows.map((row: CarBookingRow) => ({
      bookingId: row.bookingid,
      carBookingId: row.carbookingid,
      companyName: row.companyname,
      vehicle: `${row.make} ${row.model} (${row.year})`,
      pickupLocation: row.pickuplocationname,
      dropoffLocation: row.dropofflocationname,
      pickupDate: row.pickupdate,
      dropoffDate: row.dropoffdate,
      days: row.days,
      numberPassengers: row.numberpassengers,
      totalPaid: parseFloat(row.price),
      status: row.carcheckinstatus,
      bookingDateTime: row.carbookingdatetime
    }));

    return NextResponse.json({
      success: true,
      bookings
    });

  } catch (error) {
    console.error('Error fetching car bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch car bookings' },
      { status: 500 }
    );
  }
}
