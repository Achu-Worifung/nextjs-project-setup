import pool from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { userId } = body;

    if (!id || !userId) {
      return NextResponse.json(
        { error: 'Trip ID and User ID are required' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // First, verify that the trip belongs to the user
      const checkQuery = `
        SELECT TripID, UserID 
        FROM Trips.Trips 
        WHERE TripID = $1 AND UserID = $2
      `;
      
      const checkResult = await client.query(checkQuery, [id, userId]);
      
      if (checkResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { error: 'Trip not found or access denied' },
          { status: 404 }
        );
      }

      // Delete the trip
      const deleteQuery = `
        DELETE FROM Trips.Trips 
        WHERE TripID = $1 AND UserID = $2
      `;
      
      const deleteResult = await client.query(deleteQuery, [id, userId]);
      
      if (deleteResult.rowCount === 0) {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { error: 'Failed to delete trip' },
          { status: 500 }
        );
      }

      await client.query('COMMIT');
      
      return NextResponse.json({ 
        success: true,
        message: 'Trip deleted successfully' 
      });
      
    } catch (dbError) {
      await client.query('ROLLBACK');
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Database error occurred' },
        { status: 500 }
      );
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error deleting trip:', error);
    return NextResponse.json(
      { error: 'Failed to delete trip' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const { id } = params;

    if (!id || !userId) {
      return NextResponse.json(
        { error: 'Trip ID and User ID are required' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    
    try {
      const query = `
        SELECT 
          TripID as id,
          TripName as name,
          Destination as destination,
          StartDate as "startDate",
          EndDate as "endDate",
          Travelers as travelers,
          Budget as budget,
          Status as status,
          Description as description,
          CreatedAt as "createdAt",
          UpdatedAt as "updatedAt",
          FlightIncluded as "flightIncluded",
          FlightDeparture as "flightDeparture",
          FlightArrival as "flightArrival",
          FlightBookingID as "flightBookingId",
          HotelIncluded as "hotelIncluded",
          HotelName as "hotelName",
          HotelCheckIn as "hotelCheckIn",
          HotelCheckOut as "hotelCheckOut",
          HotelRooms as "hotelRooms",
          HotelBookingID as "hotelBookingId",
          CarIncluded as "carIncluded",
          CarType as "carType",
          CarPickupLocation as "carPickupLocation",
          CarDropoffLocation as "carDropoffLocation",
          CarBookingID as "carBookingId"
        FROM Trips.Trips 
        WHERE TripID = $1 AND UserID = $2
      `;
      
      const result = await client.query(query, [id, userId]);
      
      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: 'Trip not found' },
          { status: 404 }
        );
      }

      const tripRow = result.rows[0];
      
      // Transform the data to match the frontend interface
      const trip = {
        id: tripRow.id,
        name: tripRow.name,
        destination: tripRow.destination,
        startDate: tripRow.startDate,
        endDate: tripRow.endDate,
        travelers: tripRow.travelers,
        budget: parseFloat(tripRow.budget),
        status: tripRow.status,
        description: tripRow.description,
        createdAt: tripRow.createdAt,
        updatedAt: tripRow.updatedAt,
        flight: {
          included: tripRow.flightIncluded,
          departure: tripRow.flightDeparture,
          arrival: tripRow.flightArrival,
          bookingId: tripRow.flightBookingId
        },
        hotel: {
          included: tripRow.hotelIncluded,
          name: tripRow.hotelName,
          checkIn: tripRow.hotelCheckIn,
          checkOut: tripRow.hotelCheckOut,
          rooms: tripRow.hotelRooms,
          bookingId: tripRow.hotelBookingId
        },
        car: {
          included: tripRow.carIncluded,
          type: tripRow.carType,
          pickupLocation: tripRow.carPickupLocation,
          dropoffLocation: tripRow.carDropoffLocation,
          bookingId: tripRow.carBookingId
        }
      };

      return NextResponse.json({ trip });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching trip:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trip' },
      { status: 500 }
    );
  }
}
