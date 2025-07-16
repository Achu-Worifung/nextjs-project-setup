
import { NextRequest, NextResponse } from "next/server";
import { decodeJWT } from "@/lib/auth-utils";
import pg from "pg";




export async function GET(request: NextRequest, context: any) {
  const { params } = context;
  try {
    const bookingId = params.id;

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
      },
      connectionTimeoutMillis: 15000,
      query_timeout: 10000,
    });

    await client.connect();

    try {
      const result = await client.query(
        `SELECT * FROM ManageBookings.Bookings 
         WHERE BookingID = $1 AND UserID = $2`,
        [bookingId, userId]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: "Booking not found or access denied" },
          { status: 404 }
        );
      }

      const row = result.rows[0];

      const booking = {
        bookingId: row.bookingid,
        userId: row.userid,
        bookingType: row.bookingtype,
        totalPaid: parseFloat(row.totalpaid) || 0,
        status: row.bookingstatus || "Confirmed",
        bookingDateTime: row.bookingdatetime || new Date().toISOString(),
        location: row.location || "Unknown Location",
        provider: row.provider || "Unknown Provider",
        companyName: row.provider || "Unknown Company",
        vehicle: "Car Rental",
        pickupLocation: row.location || "Unknown",
        dropoffLocation: row.location || "Unknown",
        pickupDate: new Date().toISOString(),
        dropoffDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        days: 1,
        numberPassengers: 1,
      };

      return NextResponse.json({ success: true, booking });
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Failed to fetch booking details from database" },
        { status: 500 }
      );
    } finally {
      await client.end();
    }
  } catch (error) {
    console.error("Error fetching booking details:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: any) {
  const { params } = context;
  try {
    const bookingId = params.id;

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
      },
      connectionTimeoutMillis: 15000,
      query_timeout: 10000,
    });

    await client.connect();

    try {
      await client.query("BEGIN");

      const result = await client.query(
        `SELECT BookingID FROM ManageBookings.Bookings 
         WHERE BookingID = $1 AND UserID = $2`,
        [bookingId, userId]
      );

      if (result.rows.length === 0) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { error: "Booking not found or access denied" },
          { status: 404 }
        );
      }

      const update = await client.query(
        `UPDATE ManageBookings.Bookings 
         SET BookingStatus = 'Cancelled' 
         WHERE BookingID = $1 AND UserID = $2`,
        [bookingId, userId]
      );

      if (update.rowCount === 0) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { error: "Failed to cancel booking" },
          { status: 500 }
        );
      }

      await client.query("COMMIT");

      return NextResponse.json({
        success: true,
        message: "Car booking cancelled successfully",
      });
    } catch (dbError) {
      await client.query("ROLLBACK");
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Failed to cancel booking" },
        { status: 500 }
      );
    } finally {
      await client.end();
    }
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
