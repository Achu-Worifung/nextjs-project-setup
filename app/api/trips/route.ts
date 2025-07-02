import pool from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

interface TripRow {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: string;
  status: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  flightIncluded: boolean;
  flightDeparture: string | null;
  flightArrival: string | null;
  flightBookingId: string | null;
  hotelIncluded: boolean;
  hotelName: string | null;
  hotelCheckIn: string | null;
  hotelCheckOut: string | null;
  hotelRooms: number | null;
  hotelBookingId: string | null;
  carIncluded: boolean;
  carType: string | null;
  carPickupLocation: string | null;
  carDropoffLocation: string | null;
  carBookingId: string | null;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
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
        WHERE UserID = $1
        ORDER BY CreatedAt DESC
      `;
      
      const result = await client.query(query, [userId]);
      
      // Transform the data to match the frontend interface
      const trips = result.rows.map((row: TripRow) => ({
        id: row.id,
        name: row.name,
        destination: row.destination,
        startDate: row.startDate,
        endDate: row.endDate,
        travelers: row.travelers,
        budget: parseFloat(row.budget),
        status: row.status,
        description: row.description,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        flight: {
          included: row.flightIncluded,
          departure: row.flightDeparture,
          arrival: row.flightArrival,
          bookingId: row.flightBookingId
        },
        hotel: {
          included: row.hotelIncluded,
          name: row.hotelName,
          checkIn: row.hotelCheckIn,
          checkOut: row.hotelCheckOut,
          rooms: row.hotelRooms,
          bookingId: row.hotelBookingId
        },
        car: {
          included: row.carIncluded,
          type: row.carType,
          pickupLocation: row.carPickupLocation,
          dropoffLocation: row.carDropoffLocation,
          bookingId: row.carBookingId
        }
      }));

      return NextResponse.json({ trips });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching trips:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trips' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      name,
      destination,
      startDate,
      endDate,
      travelers,
      budget,
      description,
      flight,
      hotel,
      car
    } = body;

    // Validate required fields
    if (!userId || !name || !destination || !startDate || !endDate || !travelers || !budget) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    
    try {
      const query = `
        INSERT INTO Trips.Trips (
          UserID, TripName, Destination, StartDate, EndDate, 
          Travelers, Budget, Description,
          FlightIncluded, FlightDeparture, FlightArrival,
          HotelIncluded, HotelName, HotelRooms,
          CarIncluded, CarType, CarPickupLocation, CarDropoffLocation
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
        ) RETURNING 
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
          UpdatedAt as "updatedAt"
      `;
      
      const values = [
        userId,
        name,
        destination,
        startDate,
        endDate,
        travelers,
        budget,
        description,
        flight?.included || false,
        flight?.departure || null,
        flight?.arrival || null,
        hotel?.included || false,
        hotel?.name || null,
        hotel?.rooms || null,
        car?.included || false,
        car?.type || null,
        car?.pickupLocation || null,
        car?.dropoffLocation || null
      ];
      
      const result = await client.query(query, values);
      const newTrip = result.rows[0];

      // Transform to match frontend interface
      const trip = {
        id: newTrip.id,
        name: newTrip.name,
        destination: newTrip.destination,
        startDate: newTrip.startDate,
        endDate: newTrip.endDate,
        travelers: newTrip.travelers,
        budget: parseFloat(newTrip.budget),
        status: newTrip.status,
        description: newTrip.description,
        createdAt: newTrip.createdAt,
        updatedAt: newTrip.updatedAt,
        flight: {
          included: flight?.included || false,
          departure: flight?.departure || null,
          arrival: flight?.arrival || null,
          bookingId: null
        },
        hotel: {
          included: hotel?.included || false,
          name: hotel?.name || null,
          checkIn: null,
          checkOut: null,
          rooms: hotel?.rooms || null,
          bookingId: null
        },
        car: {
          included: car?.included || false,
          type: car?.type || null,
          pickupLocation: car?.pickupLocation || null,
          dropoffLocation: car?.dropoffLocation || null,
          bookingId: null
        }
      };

      return NextResponse.json({ trip }, { status: 201 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error creating trip:', error);
    return NextResponse.json(
      { error: 'Failed to create trip' },
      { status: 500 }
    );
  }
}
