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

export async function POST(req: Request) {
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

  const body = await req.json();
  const { tripId, flight, hotel, car } = body;

  // Validate required data
  if (!tripId) {
    return NextResponse.json(
      { error: 'Trip ID is required' },
      { status: 400 }
    );
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
    const results: {
      flight: { id: string } | null;
      hotel: { id: string } | null;
      car: { id: string } | null;
    } = {
      flight: null,
      hotel: null,
      car: null
    };

    // Insert flight booking if selected
    if (flight) {
      const flightDetails = {
        flightNumber: flight.flightNumber,
        airline: flight.airline,
        departureAirport: flight.departureAirport,
        destinationAirport: flight.destinationAirport,
        departureTime: flight.departureTime,
        arrivalTime: flight.arrivalTime,
        duration: flight.duration,
        numberOfStops: flight.numberOfStops
      };

      const flightQuery = `
        INSERT INTO flights.flightbookings (
          userid,
          inventoryid,
          numberseats, 
          seatprice,
          bookingdatetime,
          flightcheckinstatus,
          flightdetails,
          trip_id
        ) VALUES ($1, gen_random_uuid(), $2, $3, NOW(), 'Pending', $4, $5)
        RETURNING flightbookingid
      `;
      
      const flightResult = await client.query(flightQuery, [
        userId,
        1, // Default number of seats
        flight.prices.Economy,
        JSON.stringify(flightDetails),
        tripId
      ]);
      
      const flightBookingId = flightResult.rows[0].flightbookingid;
      results.flight = { id: flightBookingId };

      // Update trip with flight booking details
      const updateFlightInTripQuery = `
        UPDATE trips.trips 
        SET 
          flightincluded = true,
          flightdeparture = $1,
          flightarrival = $2,
          flightbookingid = $3,
          updatedat = NOW()
        WHERE tripid = $4 AND userid = $5
      `;
      
      await client.query(updateFlightInTripQuery, [
        flight.departureAirport, // Keep it as airport code (3-letter code fits in VARCHAR(10))
        flight.destinationAirport, // Keep it as airport code (3-letter code fits in VARCHAR(10))
        flightBookingId,
        tripId,
        userId
      ]);

      // Also insert into managebookings.bookings table
      const flightBookingQuery = `
        INSERT INTO managebookings.bookings (
          paymentid,
          userid,
          bookingtype,
          totalpaid,
          provider,
          location,
          date
        ) VALUES (gen_random_uuid(), $1, 'Flight', $2, $3, $4, NOW())
      `;
      
      await client.query(flightBookingQuery, [
        userId,
        flight.prices.Economy,
        flight.airline,
        `${flight.departureAirport} → ${flight.destinationAirport}`
      ]);
    }

    // Insert hotel booking if selected
    if (hotel) {
      const hotelDetails = {
        name: hotel.name,
        address: hotel.address,
        roomType: hotel.rooms[0].type,
        pricePerNight: hotel.rooms[0].pricePerNight,
        rating: hotel.reviewSummary.averageRating,
        totalReviews: hotel.reviewSummary.totalReviews
      };

      // Get actual trip dates first
      const tripQuery = `
        SELECT startdate, enddate 
        FROM trips.trips 
        WHERE tripid = $1 AND userid = $2
      `;
      
      const tripResult = await client.query(tripQuery, [tripId, userId]);
      const tripData = tripResult.rows[0];
      
      const checkInDate = new Date(tripData.startdate);
      const checkOutDate = new Date(tripData.enddate);

      const hotelQuery = `
        INSERT INTO hotel.hotelbookings (
          userid,
          checkindate,
          checkoutdate,
          guests,
          hotelcheckinstatus,
          bookingdatetime,
          hoteldetails,
          trip_id
        ) VALUES ($1, $2, $3, $4, 'Pending', NOW(), $5, $6)
        RETURNING hotelbookingid
      `;
      
      const hotelResult = await client.query(hotelQuery, [
        userId,
        checkInDate.toISOString().split('T')[0],
        checkOutDate.toISOString().split('T')[0],
        2, // Default number of guests
        JSON.stringify(hotelDetails),
        tripId
      ]);
      
      const hotelBookingId = hotelResult.rows[0].hotelbookingid;
      results.hotel = { id: hotelBookingId };

      // Update trip with hotel booking details
      const updateHotelInTripQuery = `
        UPDATE trips.trips 
        SET 
          hotelincluded = true,
          hotelname = $1,
          hotelcheckin = $2,
          hotelcheckout = $3,
          hotelrooms = $4,
          hotelbookingid = $5,
          updatedat = NOW()
        WHERE tripid = $6 AND userid = $7
      `;
      
      await client.query(updateHotelInTripQuery, [
        hotel.name,
        checkInDate.toISOString().split('T')[0],
        checkOutDate.toISOString().split('T')[0],
        2, // Default number of rooms
        hotelBookingId,
        tripId,
        userId
      ]);

      // Also insert into managebookings.bookings table
      const hotelBookingQuery = `
        INSERT INTO managebookings.bookings (
          paymentid,
          userid,
          bookingtype,
          totalpaid,
          provider,
          location,
          date
        ) VALUES (gen_random_uuid(), $1, 'Hotel', $2, $3, $4, NOW())
      `;
      
      const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
      const totalHotelCost = hotel.rooms[0].pricePerNight * nights;
      
      await client.query(hotelBookingQuery, [
        userId,
        totalHotelCost,
        hotel.name,
        hotel.address
      ]);
    }

    // Insert car booking if selected
    if (car) {
      const carDetails = {
        name: car.name,
        type: car.type,
        company: car.company,
        pricePerDay: car.price,
        seats: car.seats,
        features: car.features
      };

      // Get actual trip dates for rental duration calculation
      const tripQuery = `
        SELECT startdate, enddate 
        FROM trips.trips 
        WHERE tripid = $1 AND userid = $2
      `;
      
      const tripResult = await client.query(tripQuery, [tripId, userId]);
      const tripData = tripResult.rows[0];
      
      const startDate = new Date(tripData.startdate);
      const endDate = new Date(tripData.enddate);
      const rentalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) || 1;

      const carQuery = `
        INSERT INTO cars.carbookings (
          userid,
          carbookingdatetime,
          cardetails,
          trip_id
        ) VALUES ($1, NOW(), $2, $3)
        RETURNING carbookingid
      `;
      
      const carResult = await client.query(carQuery, [
        userId,
        JSON.stringify(carDetails),
        tripId
      ]);
      
      const carBookingId = carResult.rows[0].carbookingid;
      results.car = { id: carBookingId };

      // Update trip with car booking details
      const updateCarInTripQuery = `
        UPDATE trips.trips 
        SET 
          carincluded = true,
          cartype = $1,
          carpickuplocation = $2,
          cardropofflocation = $3,
          carbookingid = $4,
          updatedat = NOW()
        WHERE tripid = $5 AND userid = $6
      `;
      
      await client.query(updateCarInTripQuery, [
        `${car.company} ${car.name}`,
        car.pickupLocation || 'TBD', // Use provided pickup location or default to TBD
        car.dropoffLocation || 'TBD', // Use provided dropoff location or default to TBD
        carBookingId,
        tripId,
        userId
      ]);

      // Also insert into managebookings.bookings table
      const carBookingQuery = `
        INSERT INTO managebookings.bookings (
          paymentid,
          userid,
          bookingtype,
          totalpaid,
          provider,
          location,
          date
        ) VALUES (gen_random_uuid(), $1, 'Car', $2, $3, $4, NOW())
      `;
      
      // Calculate total car rental cost using actual trip duration
      const totalCarCost = car.price * rentalDays;
      
      await client.query(carBookingQuery, [
        userId,
        totalCarCost,
        car.company,
        `Car Rental - ${car.name}`
      ]);
    }

    // Update trip status from 'Planning' to 'Booked' if any bookings were made
    if (results.flight || results.hotel || results.car) {
      const updateTripQuery = `
        UPDATE trips.trips 
        SET status = 'Booked', updatedat = NOW()
        WHERE tripid = $1 AND userid = $2
      `;
      
      await client.query(updateTripQuery, [tripId, userId]);
    }

    await client.query('COMMIT');
    
    return NextResponse.json({
      success: true,
      message: 'Booking saved successfully',
      data: results
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error saving booking:', error);
    return NextResponse.json(
      { error: 'Failed to save booking', details: error },
      { status: 500 }
    );
  } finally {
    client.end();
  }
}
