import { NextRequest, NextResponse } from 'next/server';
import { decodeJWT } from '@/lib/auth-utils';
import pool from '@/lib/db';

interface BookFlightRequest {
  flightNumber: string;
  airline: string;
  departureAirport: string;
  destinationAirport: string;
  departureTime: string;
  arrivalTime: string;
  flightClass: 'Economy' | 'Business' | 'First';
  price: number;
  numberOfSeats: number;
}

interface BookingRow {
  bookingid: string;
  bookingstatus: string;
  totalpaid: string;
  flightbookingid: string;
  numberseats: number;
  seatprice: string;
  bookingdatetime: string;
  checkinstatus: string;
}

export async function POST(request: NextRequest) {
  try {
    // Get authorization header
    const authorization = request.headers.get('authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authorization.substring(7);
    const payload = decodeJWT(token);
    
    if (!payload || Date.now() >= payload.exp * 1000) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const userId = payload.userId;
    const body: BookFlightRequest = await request.json();

    // Validate required fields
    const requiredFields = [
      'flightNumber', 'airline', 'departureAirport', 
      'destinationAirport', 'departureTime', 'arrivalTime', 
      'flightClass', 'price', 'numberOfSeats'
    ];

    for (const field of requiredFields) {
      if (!body[field as keyof BookFlightRequest]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Generate UUIDs for the booking
    const bookingId = crypto.randomUUID();
    const flightBookingId = crypto.randomUUID();
    const paymentId = crypto.randomUUID(); // In a real app, this would come from payment processing
    const inventoryId = crypto.randomUUID(); // In a real app, this would come from flight inventory lookup

    // Calculate total cost
    const totalPaid = body.price * body.numberOfSeats;

    try {
      // Start database transaction
      const client = await pool.connect();
      await client.query('BEGIN');

      try {
        // Insert into ManageBookings.Bookings table
        await client.query(`
          INSERT INTO ManageBookings.Bookings 
          (BookingID, PaymentID, UserID, BookingType, BookingStatus, TotalPaid)
          VALUES ($1, $2, $3, $4, $5, $6)
        `, [bookingId, paymentId, userId, 'Flight', 'Paid', totalPaid]);

        // Insert into Flights.FlightBookings table
        await client.query(`
          INSERT INTO Flights.FlightBookings 
          (FlightBookingID, UserID, InventoryID, NumberSeats, SeatPrice, BookingDateTime, FlightCheckInStatus)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [flightBookingId, userId, inventoryId, body.numberOfSeats, body.price, new Date(), 'Pending']);

        // Commit transaction
        await client.query('COMMIT');
        client.release();

        // Return success response
        return NextResponse.json({
          success: true,
          message: 'Flight booked successfully',
          booking: {
            bookingId,
            flightBookingId,
            flightNumber: body.flightNumber,
            airline: body.airline,
            route: `${body.departureAirport} → ${body.destinationAirport}`,
            departureTime: body.departureTime,
            flightClass: body.flightClass,
            numberOfSeats: body.numberOfSeats,
            totalPaid,
            status: 'confirmed',
          },
        });

      } catch (dbError) {
        // Rollback transaction on error
        await client.query('ROLLBACK');
        client.release();
        throw dbError;
      }

    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save booking to database' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get authorization header
    const authorization = request.headers.get('authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authorization.substring(7);
    const payload = decodeJWT(token);
    
    if (!payload || Date.now() >= payload.exp * 1000) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const userId = payload.userId;

    try {
      // Query user's flight bookings from database
      const result = await pool.query(`
        SELECT 
          b.BookingID as bookingId,
          b.BookingStatus as bookingStatus,
          b.TotalPaid as totalPaid,
          fb.FlightBookingID as flightBookingId,
          fb.NumberSeats as numberOfSeats,
          fb.SeatPrice as seatPrice,
          fb.BookingDateTime as bookingDateTime,
          fb.FlightCheckInStatus as checkInStatus
        FROM ManageBookings.Bookings b
        JOIN Flights.FlightBookings fb ON b.UserID = fb.UserID  
        WHERE b.UserID = $1 AND b.BookingType = 'Flight'
        ORDER BY fb.BookingDateTime DESC
      `, [userId]);

      // Transform database results to match the expected format
      const bookings = result.rows.map((row: BookingRow) => ({
        bookingId: row.bookingid,
        flightBookingId: row.flightbookingid,
        flightNumber: 'Unknown', // Would need to join with flight inventory/schedule tables
        airline: 'Unknown', // Would need to join with airline tables
        route: 'Unknown → Unknown', // Would need airport data
        departureTime: 'Unknown',
        arrivalTime: 'Unknown',
        flightClass: 'Economy', // Would need this from inventory
        numberOfSeats: row.numberseats,
        totalPaid: parseFloat(row.totalpaid),
        status: row.bookingstatus?.toLowerCase() || 'unknown',
        bookingDateTime: row.bookingdatetime,
        checkInStatus: row.checkinstatus?.toLowerCase().replace(' ', '_') || 'pending',
      }));

      return NextResponse.json({
        success: true,
        bookings,
      });

    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to fetch bookings from database' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
