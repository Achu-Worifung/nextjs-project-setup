import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pg from "pg";

const secret = process.env.JWT_SECRET;

interface DecodedToken {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  exp: number;
}

interface Bookings {
  bookingId: string;
  paymentId: string;
  userId: string;
  bookingType: string;
  totalPaid: number;
  location?: string;
  provider?: string;
}
export async function GET(req: Request) {
  // Get token from Authorization header
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Authorization token required" },
      { status: 401 }
    );
  }

  const token = authHeader.substring(7);
  let decoded: DecodedToken;
  try {
    decoded = jwt.verify(token, secret);
  } catch (jwtError) {
    return NextResponse.json(
      { error: "Invalid token", jwtError },
      { status: 401 }
    );
  }

  // Check if token is expired
  if (Date.now() >= decoded.exp * 1000) {
    return NextResponse.json({ error: "Token expired" }, { status: 401 });
  }

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
    await client.connect();
    await client.query('BEGIN');

    const userId = decoded.userId;

    const bookingResult: { rows: Bookings[] } = await client.query(
        `SELECT * FROM ManageBookings.Bookings WHERE UserID = $1`,
        [userId]
    );

    await client.query('COMMIT');
    return NextResponse.json(bookingResult.rows);
  } catch (error) {
    await client.query('ROLLBACK');
    return NextResponse.json({ error: "Failed to retrieve bookings", details: error }, { status: 500 });
  } finally {
    client.end();
  }
}
