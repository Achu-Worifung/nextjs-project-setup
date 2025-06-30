// Test script to verify flight booking with flight details
const testFlightBooking = {
  token: "test-token",
  flightNumber: "AA123",
  airline: "American Airlines",
  departureAirport: "JFK",
  destinationAirport: "LAX",
  departureTime: "2025-07-01T08:00:00Z",
  arrivalTime: "2025-07-01T11:30:00Z",
  flightClass: "Economy",
  price: 299.99,
  numberOfSeats: 1,
  flightDetails: {
    duration: "5h 30m",
    aircraft: "Boeing 737-800",
    gate: "A12",
    terminal: "1",
    numberOfStops: 0,
    stops: [],
    status: "On Time",
    meal: true,
    availableSeats: {
      Economy: 45,
      Business: 12,
      First: 4
    },
    prices: {
      Economy: 299.99,
      Business: 899.99,
      First: 1599.99
    }
  }
};

console.log("Test flight booking data:");
console.log(JSON.stringify(testFlightBooking, null, 2));

// The flightDetails will be stored as JSONB in the database:
console.log("\nFlight details JSONB structure:");
const jsonbData = {
  flightNumber: testFlightBooking.flightNumber,
  airline: testFlightBooking.airline,
  departureAirport: testFlightBooking.departureAirport,
  destinationAirport: testFlightBooking.destinationAirport,
  departureTime: testFlightBooking.departureTime,
  arrivalTime: testFlightBooking.arrivalTime,
  flightClass: testFlightBooking.flightClass,
  ...testFlightBooking.flightDetails
};

console.log(JSON.stringify(jsonbData, null, 2));
