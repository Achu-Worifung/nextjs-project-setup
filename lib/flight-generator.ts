import { Flight , StopDetail} from "@/lib/types";


export function generateFakeFlights(departureDate: string, count: number = 5): Flight[] {
  const airlines = ['Delta', 'United', 'American Airlines', 'Southwest', 'JetBlue', 'Alaska Airlines', 'Spirit'];
  const airportCodes = ['LAX', 'JFK', 'ORD', 'ATL', 'DFW', 'DEN', 'SFO', 'SEA', 'MIA', 'BOS'];
  const aircraftTypes = ['Boeing 737', 'Airbus A320', 'Boeing 777', 'Airbus A350', 'Embraer E190', 'Boeing 787'];
  const statuses: ('On Time' | 'Delayed' | 'Cancelled')[] = ['On Time', 'Delayed', 'Cancelled'];
  const terminals = ['A', 'B', 'C', 'D', 'E'];

  const flights: Flight[] = [];

  for (let i = 0; i < count; i++) {
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const flightNumber = `${airline.slice(0, 2).toUpperCase()}${Math.floor(100 + Math.random() * 9000)}`;

    const departureAirport = airportCodes[Math.floor(Math.random() * airportCodes.length)];
    let destinationAirport: string;
    do {
      destinationAirport = airportCodes[Math.floor(Math.random() * airportCodes.length)];
    } while (destinationAirport === departureAirport);

    const numberOfStops = Math.floor(Math.random() * 3); // 0 to 2 stops
    const stopAirports = new Set<string>();
    const stops: StopDetail[] = [];

    const departureTime = new Date(`${departureDate}T${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`);
    let currentTime = new Date(departureTime);

    // Create stops if needed
    for (let s = 0; s < numberOfStops; s++) {
      let stopAirport: string;
      do {
        stopAirport = airportCodes[Math.floor(Math.random() * airportCodes.length)];
      } while (
        stopAirport === departureAirport ||
        stopAirport === destinationAirport ||
        stopAirports.has(stopAirport)
      );
      stopAirports.add(stopAirport);

      const flightDurationToStop = 60 + Math.floor(Math.random() * 120); // 1–3h to stop
      currentTime = new Date(currentTime.getTime() + flightDurationToStop * 60000); // fly to stop
      const arrivalTimeAtStop = new Date(currentTime);

      const layoverMinutes = 30 + Math.floor(Math.random() * 120); // 30–150 mins layover
      currentTime = new Date(currentTime.getTime() + layoverMinutes * 60000); // layover
      const departureTimeFromStop = new Date(currentTime);

      const layoverDurationStr = `${Math.floor(layoverMinutes / 60)}h ${layoverMinutes % 60}m`;

      stops.push({
        airport: stopAirport,
        arrivalTime: arrivalTimeAtStop.toISOString().slice(0, 19),
        departureTime: departureTimeFromStop.toISOString().slice(0, 19),
        layoverDuration: layoverDurationStr
      });
    }

    const flightDurationToDest = 60 + Math.floor(Math.random() * 180); // 1–4h final leg
    currentTime = new Date(currentTime.getTime() + flightDurationToDest * 60000);
    const arrivalTime = new Date(currentTime);

    const totalDurationMinutes = (arrivalTime.getTime() - departureTime.getTime()) / 60000;
    const durationStr = `${Math.floor(totalDurationMinutes / 60)}h ${Math.floor(totalDurationMinutes % 60)}m`;

    const prices = {
      Economy: Math.floor(50 + Math.random() * 400),
      Business: Math.floor(400 + Math.random() * 600),
      First: Math.floor(1000 + Math.random() * 1500)
    };

    const availableSeats = {
      Economy: Math.floor(Math.random() * 100),
      Business: Math.floor(Math.random() * 30),
      First: Math.floor(Math.random() * 10)
    };

    flights.push({
      airline,
      flightNumber,
      departureAirport,
      destinationAirport,
      departureTime: departureTime.toISOString().slice(0, 19),
      arrivalTime: arrivalTime.toISOString().slice(0, 19),
      duration: durationStr,
      numberOfStops,
      stops,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      aircraft: aircraftTypes[Math.floor(Math.random() * aircraftTypes.length)],
      gate: `${String.fromCharCode(65 + Math.floor(Math.random() * 6))}${Math.floor(Math.random() * 30) + 1}`,
      terminal: terminals[Math.floor(Math.random() * terminals.length)],
      meal: Math.random() > 0.3,
      availableSeats,
      prices,
      bookingUrl: `#` // Placeholder URL since we're using the drawer instead
    });
  }

  return flights;
}


