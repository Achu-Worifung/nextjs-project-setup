import { NextRequest, NextResponse } from "next/server";
import { decodeJWT } from "@/lib/auth-utils";
// import pool from "@/lib/db";
import pg from "pg";

interface BookFlightRequest {
  token: string;
  flightNumber: string;
  airline: string;
  departureAirport: string;
  destinationAirport: string;
  departureTime: string;
  arrivalTime: string;
  flightClass: "Economy" | "Business" | "First";
  price: number;
  numberOfSeats: number;
  // Add complete flight details for storage
  flightDetails?: {
    duration: string;
    aircraft: string;
    gate: string;
    terminal: string;
    numberOfStops: number;
    stops: Array<{
      airport: string;
      arrivalTime: string;
      departureTime: string;
      layoverDuration: string;
    }>;
    status: string;
    meal: boolean;
    availableSeats: {
      Economy: number;
      Business: number;
      First: number;
    };
    prices: {
      Economy: number;
      Business: number;
      First: number;
    };
  };
}

interface BookingRow {
  flightbookingid: string;
  numberofseats: number;
  seatprice: string;
  bookingdatetime: string;
  checkinstatus: string;
  flightdetails: object | null; // JSONB data
}

export async function POST(request: NextRequest) {
  try {
    // Get authorization header
    const authorization = request.headers.get("authorization");
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid authorization header" },
        { status: 401 }
      );
    }

    const body: BookFlightRequest = await request.json();
    const token = body.token;
    const payload = decodeJWT(token);
    console.log("Payload:", payload);

    if (!payload || Date.now() >= payload.exp * 1000) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }
    console.log("Decoded payload:", payload);
    const userId = payload.userId;

    console.log("Booking flight for user:", userId, "with data:", body);
    // return;

    // Validate required fields
    const requiredFields = [
      "flightNumber",
      "airline",
      "departureAirport",
      "destinationAirport",
      "departureTime",
      "arrivalTime",
      "flightClass",
      "price",
      "numberOfSeats",
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
      // Connect to the database
      const client = new pg.Client({
        user: process.env.PGUSER,
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        port: Number(process.env.PGPORT) || 5432,
        ssl: {
          rejectUnauthorized: false,
          require: true,
        },
        connectionTimeoutMillis: 15000,
        query_timeout: 10000,
      });
      await client.connect();
      await client.query("BEGIN");

      try {
        // Insert into ManageBookings.Bookings table
        await client.query(
          `
          INSERT INTO ManageBookings.Bookings 
          (BookingID, PaymentID, UserID, BookingType, TotalPaid, Location, Provider, date)
          VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        `,
          [bookingId, paymentId, userId, "Flight", totalPaid, `${body.departureAirport} → ${body.destinationAirport}`, body.airline]
        );

        // Insert into Flights.FlightBookings table with flight details
        await client.query(
          `
          INSERT INTO Flights.FlightBookings 
          (FlightBookingID, UserID, InventoryID, NumberSeats, SeatPrice, BookingDateTime, FlightCheckInStatus, FlightDetails)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `,
          [
            flightBookingId,
            userId,
            inventoryId,
            body.numberOfSeats,
            body.price,
            new Date(),
            "Pending",
            JSON.stringify({
              flightNumber: body.flightNumber,
              airline: body.airline,
              departureAirport: body.departureAirport,
              destinationAirport: body.destinationAirport,
              departureTime: body.departureTime,
              arrivalTime: body.arrivalTime,
              flightClass: body.flightClass,
              ...body.flightDetails,
            }),
          ]
        );

        // Commit transaction
        await client.query("COMMIT");
        client.end();

        // Return success response
        return NextResponse.json({
          success: true,
          message: "Flight booked successfully",
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
            status: "confirmed",
          },
        });
      } catch (dbError) {
        // Rollback transaction on error
        await client.query("ROLLBACK");
        client.end();
        throw dbError;
      }
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Failed to save booking to database" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get authorization header
    const authorization = request.headers.get("authorization");
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid authorization header" },
        { status: 401 }
      );
    }

    const token = authorization.substring(7);
    const payload = decodeJWT(token);

    if (!payload || Date.now() >= payload.exp * 1000) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const userId = payload.userId;
    const client = new pg.Client({
      user: process.env.PGUSER,
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      port: Number(process.env.PGPORT) || 5432,
      ssl: {
        rejectUnauthorized: false,
        require: true,
      },
      connectionTimeoutMillis: 15000,
      query_timeout: 10000,
    });
    // Connect to the database
    await client.connect();

    try {
      // Query user's flight bookings directly from FlightBookings table
      const result = await client.query(
        `
        SELECT 
          fb.FlightBookingID as flightBookingId,
          fb.NumberSeats as numberOfSeats,
          fb.SeatPrice as seatPrice,
          fb.BookingDateTime as bookingDateTime,
          fb.FlightCheckInStatus as checkInStatus,
          fb.FlightDetails as flightDetails
        FROM Flights.FlightBookings fb
        WHERE fb.UserID = $1
        ORDER BY fb.BookingDateTime DESC
      `,
        [userId]
      );

      // Transform database results to match the expected format
      const bookings = result.rows.map((row: BookingRow) => {
        const flightDetails =
          (row.flightdetails as Record<string, unknown>) || {};

        // Calculate total paid from seat price and number of seats
        const totalPaid = parseFloat(row.seatprice) * row.numberofseats;

        console.log("seatprice:", row.seatprice, "numberofseats:", row.numberofseats, "totalPaid:", totalPaid);

        return {
          bookingId: row.flightbookingid, // Use flight booking ID as the main booking ID
          flightBookingId: row.flightbookingid,
          flightNumber: (flightDetails.flightNumber as string) || "Unknown",
          airline: (flightDetails.airline as string) || "Unknown",
          route:
            flightDetails.departureAirport && flightDetails.destinationAirport
              ? `${flightDetails.departureAirport} → ${flightDetails.destinationAirport}`
              : "Unknown → Unknown",
          departureTime: (flightDetails.departureTime as string) || "Unknown",
          arrivalTime: (flightDetails.arrivalTime as string) || "Unknown",
          flightClass: (flightDetails.flightClass as string) || "Economy",
          numberOfSeats: row.numberofseats,
          totalPaid: totalPaid,
          status: "confirmed", // All bookings in the system are confirmed
          bookingDateTime: row.bookingdatetime,
          checkInStatus:
            row.checkinstatus?.toLowerCase().replace(" ", "_") || "pending",
          // Include additional flight details if available
          duration: flightDetails.duration as string,
          aircraft: flightDetails.aircraft as string,
          gate: flightDetails.gate as string,
          terminal: flightDetails.terminal as string,
          stops: (flightDetails.stops as Array<unknown>) || [],
          meal: Boolean(flightDetails.meal),
        };
      });

      return NextResponse.json({
        success: true,
        bookings,
      });
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Failed to fetch bookings from database" },
        { status: 500 }
      );
    } finally {
      // Always close the database connection
      client.end();
    }
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
