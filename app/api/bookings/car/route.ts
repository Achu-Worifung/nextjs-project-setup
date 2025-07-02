import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import db from "@/lib/db";
import pg from "pg";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

interface CarBookingRequest {
  id: number,
  name: string,
  make: string,
  model: string,
  year: number,
  imageUrl: string,
  seats: number,
  type: string,
  pricePerDay: number,
  features: string,
  transmission: string,
  fuelType: string,
  rating: number,
  pickupLocation: string,
  dropoffLocation: string,
  pickupDate: string,
  dropoffDate: string,
  totalPrice: number,
  insuranceOption: string

}

interface CarBookingRow {
  carbookingid: string;
  cardetails: {
    id: number;
    name: string;
    make: string;
    model: string;
    year: number;
    imageUrl: string;
    seats: number;
    type: string;
    pricePerDay: number;
    features: string;
    transmission: string;
    fuelType: string;
    rating: number;
    pickupLocation: string;
    dropoffLocation: string;
    pickupDate: string;
    dropoffDate: string;
  };
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
    const bookingData: CarBookingRequest = await req.json();
    console.log("Received booking data:", bookingData);
    // return NextResponse.json({ message: 'Booking data received' }, { status: 200 });
    // Validate required fields
    const requiredFields = [
      "id",
      "name",
      "year",
      "pickupLocation",
      "dropoffLocation",
      "pickupDate",
      "totalPrice",
    ];
    const missingFields = requiredFields.filter(
      (field) => !bookingData[field as keyof CarBookingRequest]
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: `Missing required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    console.log("Creating car booking for user:", decoded.userId);
    console.log("Booking data:", bookingData);

    // Start transaction
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

    try {
      await client.query("BEGIN");

      // Find or create car inventory record (simplified approach)
      // In a real system, you would query for actual available inventory
      const queryResult = await client.query(
        `INSERT INTO cars.carbookings(userid, carbookingdatetime, cardetails)
        VALUES ($1, NOW(), $2) RETURNING carbookingid`,
        [decoded.userId, JSON.stringify({ bookingData })]
      );

      const bookingId = queryResult.rows[0].carbookingid;

      await client.query({
        text: `
          INSERT INTO ManageBookings.Bookings
          (BookingID, PaymentID, UserID, BookingType, TotalPaid, Location, Provider, date)
          VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        `,
        values: [
          bookingId,
          "00000000-0000-0000-0000-000000000001", // Placeholder payment ID
          decoded.userId,
          "Car",
          bookingData.totalPrice,
          bookingData.make,
          bookingData.model,
        ],
      })
      
      await client.query("COMMIT");

      return NextResponse.json({
        success: true,
        message: "Car booking created successfully",
        booking: {
          bookingId: bookingId,
        },
      });
    } catch (dbError) {
      await client.query("ROLLBACK");
      throw dbError;
    } finally {
      client.end();
    }
  } catch (error) {
    console.error("Car booking error:", error);
    return NextResponse.json(
      { error: "Failed to create car booking" },
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

    console.log("Fetching car bookings for user:", decoded.userId);

    // Fetch user's car bookings
    const result = await db.query(
      `
      SELECT 
        *
      FROM cars.carbookings
      WHERE userid = $1  
    `,
      [decoded.userId]
    );

    const bookings = result.rows.map((row: CarBookingRow) => ({
      bookingid: row.carbookingid,
      car: row.cardetails,
    }));

    return NextResponse.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Error fetching car bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch car bookings" },
      { status: 500 }
    );
  }
}
