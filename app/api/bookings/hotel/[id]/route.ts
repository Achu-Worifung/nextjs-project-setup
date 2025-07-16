import { NextRequest, NextResponse } from "next/server";
import { decodeJWT } from "@/lib/auth-utils";
import pg from "pg";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const bookingId = params.id;

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
      },
      connectionTimeoutMillis: 15000,
      query_timeout: 10000,
    });

    await client.connect();

    try {
      // First, check if the booking exists in the main bookings table
      const mainBookingResult = await client.query(
        `SELECT * FROM ManageBookings.Bookings 
         WHERE BookingID = $1 AND UserID = $2`,
        [bookingId, userId]
      );

      if (mainBookingResult.rows.length === 0) {
        return NextResponse.json(
          { error: "Booking not found or access denied" },
          { status: 404 }
        );
      }

      const mainBooking = mainBookingResult.rows[0];

      // Return the basic booking information from the main table
      const booking = {
        bookingId: mainBooking.bookingid,
        userId: mainBooking.userid,
        bookingType: mainBooking.bookingtype,
        totalPaid: parseFloat(mainBooking.totalpaid) || 0,
        status: mainBooking.bookingstatus || "Confirmed",
        bookingDateTime: mainBooking.bookingdatetime || new Date().toISOString(),
        location: mainBooking.location || "Unknown Location",
        provider: mainBooking.provider || "Unknown Provider",
        // Hotel specific defaults
        hotelName: mainBooking.provider || "Unknown Hotel",
        roomType: "Standard Room",
        checkInDate: new Date().toISOString(),
        checkOutDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Default to next day
        nights: 1,
        guests: 1,
      };

      return NextResponse.json({
        success: true,
        booking,
      });
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
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const bookingId = params.id;

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
      },
      connectionTimeoutMillis: 15000,
      query_timeout: 10000,
    });

    await client.connect();

    try {
      await client.query("BEGIN");

      // First, check if the booking exists and belongs to the user in main table
      const checkResult = await client.query(
        `SELECT BookingID, BookingType FROM ManageBookings.Bookings 
         WHERE BookingID = $1 AND UserID = $2`,
        [bookingId, userId]
      );

      if (checkResult.rows.length === 0) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { error: "Booking not found or access denied" },
          { status: 404 }
        );
      }

      // Update the status in the main bookings table
      const updateResult = await client.query(
        `UPDATE ManageBookings.Bookings 
         SET BookingStatus = 'Cancelled' 
         WHERE BookingID = $1 AND UserID = $2`,
        [bookingId, userId]
      );

      if (updateResult.rowCount === 0) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { error: "Failed to cancel booking" },
          { status: 500 }
        );
      }

      await client.query("COMMIT");

      return NextResponse.json({
        success: true,
        message: "Hotel booking cancelled successfully",
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
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
