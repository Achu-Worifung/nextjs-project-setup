import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import db from "@/lib/db";
import pg from "pg";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

interface HotelBookingRequest {
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  totalPrice: number;
  // Complete hotel details for storage
  hotelDetails: {
    hotelName: string;
    hotelAddress: string;
    hotelCity: string;
    hotelCountry: string;
    hotelRating?: number;
    roomType: string;
    roomDescription?: string;
    maxOccupancy: number;
    nights: number;
    basePrice: number;
    discounts?: number;
    tax: number;
    amenities?: string[];
    images?: string[];
    checkInTime?: string;
    checkOutTime?: string;
  };
}

interface HotelBookingRow {
  bookingid: string;
  hotelbookingid: string;
  checkindate: string;
  checkoutdate: string;
  guests: number;
  hotelcheckinstatus: string;
  bookingdatetime: string;
  hoteldetails: object | null;
  totalpaid: string;
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
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Verify JWT token
    let decoded: DecodedToken;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    } catch (jwtError) {
      console.error("JWT verification failed:", jwtError);
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Check if token is expired
    if (Date.now() >= decoded.exp * 1000) {
      return NextResponse.json({ error: "Token expired" }, { status: 401 });
    }

    // Parse booking data
    const bookingData: HotelBookingRequest = await req.json();

    // Validate required fields
    const requiredFields = [
      "checkInDate",
      "checkOutDate",
      "guests",
      "totalPrice",
      "hotelDetails",
    ];
    const missingFields = requiredFields.filter(
      (field) => !bookingData[field as keyof HotelBookingRequest]
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: `Missing required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    console.log("Creating hotel booking for user:", decoded.userId);
    console.log("Booking data:", bookingData);

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
    try {
      // Connect to the database
      await client.connect();
      await client.query("BEGIN");

      // Generate UUIDs
      const hotelBookingId = crypto.randomUUID();

      // Create hotel booking with all details in JSONB
      const hotelBookingResult = await client.query(
        `
        INSERT INTO Hotel.HotelBookings (
          HotelBookingID, UserID, CheckInDate, CheckOutDate, Guests,
          HotelCheckInStatus, BookingDateTime, HotelDetails
        )
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7)
        RETURNING HotelBookingID, BookingDateTime
      `,
        [
          hotelBookingId,
          decoded.userId,
          bookingData.checkInDate,
          bookingData.checkOutDate,
          bookingData.guests,
          "Pending",
          JSON.stringify({
            ...bookingData.hotelDetails,
            totalPrice: bookingData.totalPrice,
            bookingDetails: {
              checkInDate: bookingData.checkInDate,
              checkOutDate: bookingData.checkOutDate,
              guests: bookingData.guests,
            },
          }),
        ]
      );

      const bookingDateTime = hotelBookingResult.rows[0].bookingdatetime;

      // Create main booking record
      const mainBookingResult = await client.query(
        `
        INSERT INTO ManageBookings.Bookings (UserID, BookingType, BookingStatus, TotalPaid, PaymentID)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING BookingID
      `,
        [
          decoded.userId,
          "Hotel",
          "Paid",
          bookingData.totalPrice,
          "00000000-0000-0000-0000-000000000001", // Placeholder payment ID
        ]
      );

      await client.query("COMMIT");

      return NextResponse.json({
        success: true,
        message: "Hotel booking created successfully",
        booking: {
          bookingId: mainBookingResult.rows[0].bookingid,
          hotelBookingId,
          hotelName: bookingData.hotelDetails.hotelName,
          location: `${bookingData.hotelDetails.hotelCity}, ${bookingData.hotelDetails.hotelCountry}`,
          roomType: bookingData.hotelDetails.roomType,
          checkInDate: bookingData.checkInDate,
          checkOutDate: bookingData.checkOutDate,
          nights: bookingData.hotelDetails.nights,
          guests: bookingData.guests,
          totalPaid: bookingData.totalPrice,
          status: "Pending",
          bookingDateTime,
        },
      });
    } catch (dbError) {
      await client.query("ROLLBACK");
      throw dbError;
    } finally {
      client.end();
    }
  } catch (error) {
    console.error("Hotel booking error:", error);
    return NextResponse.json(
      { error: "Failed to create hotel booking" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Verify JWT token
    let decoded: DecodedToken;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    } catch (jwtError) {
      console.error("JWT verification failed:", jwtError);
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Check if token is expired
    if (Date.now() >= decoded.exp * 1000) {
      return NextResponse.json({ error: "Token expired" }, { status: 401 });
    }

    console.log("Fetching hotel bookings for user:", decoded.userId);

    // Fetch user's hotel bookings with the new simplified schema
    const result = await db.query(
      `
      SELECT 
        mb.BookingID,
        hb.HotelBookingID,
        hb.CheckInDate,
        hb.CheckOutDate,
        hb.Guests,
        hb.HotelCheckInStatus,
        hb.BookingDateTime,
        hb.HotelDetails,
        mb.TotalPaid
      FROM ManageBookings.Bookings mb
      JOIN Hotel.HotelBookings hb ON mb.UserID = hb.UserID
      WHERE mb.UserID = $1 AND mb.BookingType = 'Hotel'
      ORDER BY hb.BookingDateTime DESC
    `,
      [decoded.userId]
    );

    const bookings = result.rows.map((row: HotelBookingRow) => {
      const hotelDetails = (row.hoteldetails as Record<string, unknown>) || {};

      return {
        bookingId: row.bookingid,
        hotelBookingId: row.hotelbookingid,
        hotelName: (hotelDetails.hotelName as string) || "Unknown Hotel",
        location:
          hotelDetails.hotelCity && hotelDetails.hotelCountry
            ? `${hotelDetails.hotelCity}, ${hotelDetails.hotelCountry}`
            : "Unknown Location",
        roomType: (hotelDetails.roomType as string) || "Unknown Room",
        checkInDate: row.checkindate,
        checkOutDate: row.checkoutdate,
        nights: (hotelDetails.nights as number) || 1,
        guests: row.guests,
        totalPaid: (hotelDetails.totalPrice as number) || 0,
        status: row.hotelcheckinstatus,
        bookingDateTime: row.bookingdatetime,
        // Additional details from JSONB
        hotelRating: hotelDetails.hotelRating as number,
        amenities: (hotelDetails.amenities as string[]) || [],
        roomDescription: hotelDetails.roomDescription as string,
      };
    });

    return NextResponse.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Error fetching hotel bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch hotel bookings" },
      { status: 500 }
    );
  }
}
