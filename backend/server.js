const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  database: 'postgres',
  user: 'classProject',
  password: 'Youtuber47',
  host: 'classproject.postgres.database.azure.com',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Database connection error:', err.stack);
    return;
  }
  console.log('Connected to Azure PostgreSQL database');
  release();
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Travel Booking API! Available endpoints: /flights, /car-rentals, /hotels' });
});

// Flights endpoint
app.get('/flights', async (req, res) => {
  const { departure_date, origin_city, destination_city } = req.query;
  try {
    if (!departure_date || !origin_city || !destination_city) {
      return res.status(400).json({ error: 'Missing required query parameters: departure_date, origin_city, destination_city' });
    }
    const result = await pool.query(
      `
      SELECT 
        a.AirlineName,
        fr.FlightNumber,
        fs.DepatureDateTime AS departureTime,
        fs.ArrivalDateTime AS arrivalTime,
        COALESCE(fr.numberOfStops, 0) AS numberOfStops,
        fi.SeatClass,
        fi.TotalSeats,
        fi.AvailableSeats,
        fi.SeatPrice
      FROM Flights.FlightInventory fi
      JOIN Flights.FlightSchedules fs ON fi.ScheduleID = fs.ScheduleID
      JOIN Flights.FlightRoutes fr ON fs.RouteID = fr.RouteID
      JOIN Flights.Airlines a ON fr.AirlineID = a.AirlineID
      JOIN Flights.Airports oa ON fr.OriginAirportID = oa.AirportID
      JOIN Flights.Airports da ON fr.DestinationAirportID = da.AirportID
      WHERE (oa.AirportLocation).city = $1
        AND (da.AirportLocation).city = $2
        AND DATE(fs.DepatureDateTime) = $3;
      `,
      [origin_city, destination_city, departure_date]
    );

    const flights = result.rows.reduce((acc, row) => {
      const flight = acc.find(f => f.flightNumber === row.flightnumber && f.departureTime === row.departuretime.toISOString());
      if (flight) {
        flight.prices[row.seatclass] = row.seatprice;
      } else {
        acc.push({
          airline: row.airlinename,
          flightNumber: row.flightnumber,
          departureTime: row.departuretime.toISOString(),
          arrivalTime: row.arrivaltime.toISOString(),
          duration: `${Math.floor((row.arrivaltime - row.departuretime) / 1000 / 3600)}h ${Math.round(((row.arrivaltime - row.departuretime) / 1000 / 60) % 60)}m`,
          numberOfStops: row.numberofstops,
          prices: { [row.seatclass]: row.seatprice },
        });
      }
      return acc;
    }, []);

    res.json(flights);
  } catch (error) {
    console.error('Error fetching flights:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Car rentals endpoint
app.get('/car-rentals', async (req, res) => {
  const { city, start_date, end_date } = req.query;
  try {
    if (!city || !start_date || !end_date) {
      return res.status(400).json({ error: 'Missing required query parameters: city, start_date, end_date' });
    }
    const result = await pool.query(
      `
      SELECT 
        ci.InventoryID,
        rl.CompanyCity,
        rl.CompanyCountry,
        cm.CarType,
        ci.DatesAvailable,
        ci.DatesUnavailable,
        ci.DailyPrice,
        ci.ChildPrice
      FROM Cars.CarInventory ci
      JOIN Cars.RentalLocations rl ON ci.LocationID = rl.LocationID
      JOIN Cars.CarModels cm ON ci.ModelID = cm.ModelID
      WHERE rl.CompanyCity = $1
        AND ci.DatesAvailable <= $2
        AND ci.DatesUnavailable >= $3;
      `,
      [city, start_date, end_date]
    );

    const carRentals = result.rows.map(row => ({
      inventoryId: row.inventoryid,
      companyCity: row.companycity,
      companyCountry: row.companycountry,
      carType: row.cartype,
      datesAvailable: row.datesavailable,
      datesUnavailable: row.datesunavailable,
      dailyPrice: row.dailyprice,
      childPrice: row.childprice,
    }));

    res.json(carRentals);
  } catch (error) {
    console.error('Error fetching car rentals:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Hotels endpoint
app.get('/hotels', async (req, res) => {
  const { city, check_in, check_out } = req.query;
  try {
    if (!city || !check_in || !check_out) {
      return res.status(400).json({ error: 'Missing required query parameters: city, check_in, check_out' });
    }
    const result = await pool.query(
      `
      SELECT 
        ri.InventoryID,
        h.HotelName,
        h.HotelCity,
        h.HotelCountry,
        ri.DatesAvailable,
        ri.DatesUnavailable,
        ri.BasePrice,
        ri.ChildPricePerNight
      FROM Hotel.RoomInventory ri
      JOIN Hotel.Hotels h ON ri.PropertyID = h.PropertyID
      WHERE h.HotelCity = $1
        AND ri.DatesAvailable <= $2
        AND ri.DatesUnavailable >= $3;
      `,
      [city, check_in, check_out]
    );

    const hotels = result.rows.map(row => ({
      inventoryId: row.inventoryid,
      hotelName: row.hotelname,
      hotelCity: row.hotelcity,
      hotelCountry: row.hotelcountry,
      datesAvailable: row.datesavailable,
      datesUnavailable: row.datesunavailable,
      basePrice: row.baseprice,
      childPricePerNight: row.childpricepernight,
    }));

    res.json(hotels);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

try {
  app.listen(port, '127.0.0.1', () => {
    console.log(`Server running on http://localhost:${port}`);
  });
} catch (error) {
  console.error('Server startup error:', error);
}