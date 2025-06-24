// Flight type definition
export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departure: { 
    time: string; 
    airport: string; 
    city: string; 
  };
  arrival: { 
    time: string; 
    airport: string; 
    city: string; 
  };
  duration: string;
  price: number;
  stops: number;
  aircraft: string;
  amenities: string[];
  rating: number;
  class: string;
}

// Search parameters interface
export interface FlightSearchParams {
  flightType: string;
  from: string;
  to: string;
  departDate: string;
  returnDate: string;
  travelers: string;
}

// Temporary flight data for demo purposes
export const tempFlightData: Flight[] = [
  {
    id: '1',
    airline: 'SkyWings Airlines',
    flightNumber: 'SW123',
    departure: { time: '08:30', airport: 'JFK', city: 'New York' },
    arrival: { time: '14:45', airport: 'LAX', city: 'Los Angeles' },
    duration: '6h 15m',
    price: 299,
    stops: 0,
    aircraft: 'Boeing 737',
    amenities: ['wifi', 'meals', 'entertainment'],
    rating: 4.5,
    class: 'Economy'
  },
  {
    id: '2',
    airline: 'CloudJet',
    flightNumber: 'CJ456',
    departure: { time: '12:15', airport: 'JFK', city: 'New York' },
    arrival: { time: '18:30', airport: 'LAX', city: 'Los Angeles' },
    duration: '6h 15m',
    price: 385,
    stops: 0,
    aircraft: 'Airbus A320',
    amenities: ['wifi', 'meals', 'priority boarding'],
    rating: 4.8,
    class: 'Premium Economy'
  },
  {
    id: '3',
    airline: 'AeroConnect',
    flightNumber: 'AC789',
    departure: { time: '16:45', airport: 'JFK', city: 'New York' },
    arrival: { time: '23:00', airport: 'LAX', city: 'Los Angeles' },
    duration: '6h 15m',
    price: 245,
    stops: 1,
    aircraft: 'Boeing 737',
    amenities: ['wifi', 'snacks'],
    rating: 4.2,
    class: 'Economy'
  },
  {
    id: '4',
    airline: 'Premium Air',
    flightNumber: 'PA101',
    departure: { time: '09:00', airport: 'JFK', city: 'New York' },
    arrival: { time: '15:15', airport: 'LAX', city: 'Los Angeles' },
    duration: '6h 15m',
    price: 750,
    stops: 0,
    aircraft: 'Boeing 787',
    amenities: ['wifi', 'meals', 'lounge access', 'priority boarding'],
    rating: 4.9,
    class: 'Business'
  },
  {
    id: '5',
    airline: 'Budget Wings',
    flightNumber: 'BW234',
    departure: { time: '06:00', airport: 'JFK', city: 'New York' },
    arrival: { time: '14:30', airport: 'LAX', city: 'Los Angeles' },
    duration: '8h 30m',
    price: 189,
    stops: 2,
    aircraft: 'Boeing 737',
    amenities: ['wifi'],
    rating: 3.8,
    class: 'Economy'
  }
];
