import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import db from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

interface HotelBookingRequest {
  propertyId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  guests: number;
  basePrice: number;
  discounts?: number;
  tax: number;
  totalPrice: number;
}

interface HotelBookingRow {
  bookingid: string;
  hotelbookingid: string;
  hotelname: string;
  hotelcity: string;
  hotelcountry: string;
  roomtype: string;
  checkindate: string;
  checkoutdate: string;
  nights: number;
  guests: number;
  totalprice: string;
  hotelcheckinstatus: string;
  bookingdatetime: string;
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
    const bookingData: HotelBookingRequest = await req.json();

    // Validate required fields
    const requiredFields = ['propertyId', 'roomId', 'checkInDate', 'checkOutDate', 'nights', 'guests', 'basePrice', 'tax', 'totalPrice'];
    const missingFields = requiredFields.filter(field => !bookingData[field as keyof HotelBookingRequest]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }

    console.log('Creating hotel booking for user:', decoded.userId);
    console.log('Booking data:', bookingData);

    // Start transaction
    const client = await db.connect();
    
    try {
      await client.query('BEGIN');

      // Find or create hotel inventory record (simplified approach)
      // In a real system, you would query for actual available inventory
      const inventoryResult = await client.query(`
        SELECT ri.InventoryID 
        FROM Hotel.RoomInventory ri
        WHERE ri.PropertyID = $1 AND ri.RoomID = $2
        LIMIT 1
      `, [bookingData.propertyId, bookingData.roomId]);

      let inventoryId;
      if (inventoryResult.rows.length > 0) {
        inventoryId = inventoryResult.rows[0].inventoryid;
      } else {
        // Create a placeholder inventory record if none exists
        const newInventoryResult = await client.query(`
          INSERT INTO Hotel.RoomInventory (PropertyID, RoomID, DatesAvailable, DatesUnavailable, BasePrice)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING InventoryID
        `, [
          bookingData.propertyId,
          bookingData.roomId,
          bookingData.checkInDate,
          bookingData.checkOutDate,
          bookingData.basePrice
        ]);
        inventoryId = newInventoryResult.rows[0].inventoryid;
      }

      // Create hotel booking
      const hotelBookingResult = await client.query(`
        INSERT INTO Hotel.HotelBookings (
          UserID, InventoryID, CheckInDate, CheckOutDate, Nights, Guests,
          Discounts, BasePrice, Tax, TotalPrice, HotelCheckInStatus, BookingDateTime
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
        RETURNING HotelBookingID, BookingDateTime
      `, [
        decoded.userId,
        inventoryId,
        bookingData.checkInDate,
        bookingData.checkOutDate,
        bookingData.nights,
        bookingData.guests,
        bookingData.discounts || 0,
        bookingData.basePrice,
        bookingData.tax,
        bookingData.totalPrice,
        'Pending'
      ]);

      const hotelBookingId = hotelBookingResult.rows[0].hotelbookingid;

      // Create main booking record
      const mainBookingResult = await client.query(`
        INSERT INTO ManageBookings.Bookings (UserID, BookingType, BookingStatus, TotalPaid, PaymentID)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING BookingID
      `, [
        decoded.userId,
        'Hotel',
        'Paid',
        bookingData.totalPrice,
        '00000000-0000-0000-0000-000000000001' // Placeholder payment ID
      ]);

      const bookingId = mainBookingResult.rows[0].bookingid;

      await client.query('COMMIT');

      // Fetch complete booking details for response
      const bookingDetails = await client.query(`
        SELECT 
          mb.BookingID,
          hb.HotelBookingID,
          h.HotelName,
          h.HotelCity,
          h.HotelCountry,
          rt.RoomType,
          hb.CheckInDate,
          hb.CheckOutDate,
          hb.Nights,
          hb.Guests,
          hb.TotalPrice,
          hb.HotelCheckInStatus,
          hb.BookingDateTime
        FROM ManageBookings.Bookings mb
        JOIN Hotel.HotelBookings hb ON mb.UserID = hb.UserID
        JOIN Hotel.RoomInventory ri ON hb.InventoryID = ri.InventoryID
        JOIN Hotel.Hotels h ON ri.PropertyID = h.PropertyID
        JOIN Hotel.RoomTypes rt ON ri.RoomID = rt.RoomID
        WHERE mb.BookingID = $1 AND hb.HotelBookingID = $2
      `, [bookingId, hotelBookingId]);

      const booking = bookingDetails.rows[0];

      return NextResponse.json({
        success: true,
        message: 'Hotel booking created successfully',
        booking: {
          bookingId: booking.bookingid,
          hotelBookingId: booking.hotelbookingid,
          hotelName: booking.hotelname,
          location: `${booking.hotelcity}, ${booking.hotelcountry}`,
          roomType: booking.roomtype,
          checkInDate: booking.checkindate,
          checkOutDate: booking.checkoutdate,
          nights: booking.nights,
          guests: booking.guests,
          totalPaid: parseFloat(booking.totalprice),
          status: booking.hotelcheckinstatus,
          bookingDateTime: booking.bookingdatetime
        }
      });

    } catch (dbError) {
      await client.query('ROLLBACK');
      throw dbError;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Hotel booking error:', error);
    return NextResponse.json(
      { error: 'Failed to create hotel booking' },
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

    console.log('Fetching hotel bookings for user:', decoded.userId);

    // Fetch user's hotel bookings
    const result = await db.query(`
      SELECT 
        mb.BookingID,
        hb.HotelBookingID,
        h.HotelName,
        h.HotelCity,
        h.HotelCountry,
        rt.RoomType,
        hb.CheckInDate,
        hb.CheckOutDate,
        hb.Nights,
        hb.Guests,
        hb.TotalPrice,
        hb.HotelCheckInStatus,
        hb.BookingDateTime
      FROM ManageBookings.Bookings mb
      JOIN Hotel.HotelBookings hb ON mb.UserID = hb.UserID
      JOIN Hotel.RoomInventory ri ON hb.InventoryID = ri.InventoryID
      JOIN Hotel.Hotels h ON ri.PropertyID = h.PropertyID
      JOIN Hotel.RoomTypes rt ON ri.RoomID = rt.RoomID
      WHERE mb.UserID = $1 AND mb.BookingType = 'Hotel'
      ORDER BY hb.BookingDateTime DESC
    `, [decoded.userId]);

    const bookings = result.rows.map((row: HotelBookingRow) => ({
      bookingId: row.bookingid,
      hotelBookingId: row.hotelbookingid,
      hotelName: row.hotelname,
      location: `${row.hotelcity}, ${row.hotelcountry}`,
      roomType: row.roomtype,
      checkInDate: row.checkindate,
      checkOutDate: row.checkoutdate,
      nights: row.nights,
      guests: row.guests,
      totalPaid: parseFloat(row.totalprice),
      status: row.hotelcheckinstatus,
      bookingDateTime: row.bookingdatetime
    }));

    return NextResponse.json({
      success: true,
      bookings
    });

  } catch (error) {
    console.error('Error fetching hotel bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hotel bookings' },
      { status: 500 }
    );
  }
}
