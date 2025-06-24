'use client';

import FlightCard from './flight-card';
import NoFlightsFound from './no-flights-found';

interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departure: { time: string; airport: string; city: string };
  arrival: { time: string; airport: string; city: string };
  duration: string;
  price: number;
  stops: number;
  aircraft: string;
  amenities: string[];
  rating: number;
  class: string;
}

interface FlightsListProps {
  flights: Flight[];
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  onSelectFlight?: (flightId: string) => void;
  onClearFilters: () => void;
}

const FlightsList = ({ 
  flights, 
  sortBy, 
  onSortChange, 
  onSelectFlight, 
  onClearFilters 
}: FlightsListProps) => {
  return (
    <div className="lg:col-span-3">
      {/* Sort Options */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="price">Price (Low to High)</option>
            <option value="duration">Duration</option>
            <option value="rating">Rating (High to Low)</option>
            <option value="departure">Departure Time</option>
          </select>
        </div>
        <div className="text-sm text-gray-600">
          {flights.length} flight{flights.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* Flight Cards */}
      {flights.length > 0 ? (
        <div className="space-y-4">
          {flights.map((flight) => (
            <FlightCard 
              key={flight.id} 
              flight={flight} 
              onSelect={onSelectFlight}
            />
          ))}
        </div>
      ) : (
        <NoFlightsFound onClearFilters={onClearFilters} />
      )}
    </div>
  );
};

export default FlightsList;
