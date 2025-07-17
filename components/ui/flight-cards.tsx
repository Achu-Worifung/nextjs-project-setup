import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flight, FlightClass } from "@/lib/types";
import { ArrowRight, Coffee, Luggage, Clock } from "lucide-react";

interface FlightCardProps {
  flight: Flight;
  selectedClass?: string; // Can be lowercase like 'economy', 'business', 'first'
}

export function FlightCards({ flight, selectedClass = 'economy' }: FlightCardProps) {
  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDate = (timeString: string) => {
    return new Date(timeString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getFlightClassKey = (classString: string): FlightClass => {
    const normalized = classString.toLowerCase();
    switch (normalized) {
      case 'economy':
        return 'Economy';
      case 'business':
        return 'Business';
      case 'first':
        return 'First';
      default:
        return 'Economy';
    }
  };

  const selectedClassKey = getFlightClassKey(selectedClass);
  const price = flight.prices[selectedClassKey];
  const availableSeats = flight.availableSeats[selectedClassKey];

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 hover:border-l-blue-600">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {/* Flight Info */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-brand-pink-600 font-bold text-sm">
                    {flight.airline.substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">
                    {flight.airline} {flight.flightNumber}
                  </span>
                  <span className="text-xs text-brand-gray-500">
                    {flight.aircraft}
                  </span>
                </div>
              </div>
              <div className="text-xs text-brand-gray-500">
                {availableSeats} seats left
              </div>
            </div>

            <div className="flex items-center justify-between">
              {/* Departure */}
              <div className="text-center">
                <div className="text-xl font-bold">
                  {formatTime(flight.departureTime)}
                </div>
                <div className="text-sm text-brand-gray-600 font-medium">
                  {flight.departureAirport}
                </div>
                <div className="text-xs text-brand-gray-500">
                  {formatDate(flight.departureTime)}
                </div>
                {flight.terminal && (
                  <div className="text-xs text-brand-gray-500">
                    Terminal {flight.terminal}
                  </div>
                )}
                {flight.gate && (
                  <div className="text-xs text-brand-gray-500">
                    Gate {flight.gate}
                  </div>
                )}
              </div>

              {/* Flight Path */}
              <div className="flex-1 mx-4">
                <div className="flex items-center justify-center relative">
                  <div className="w-full h-px bg-gray-300"></div>
                  <div className="absolute bg-white px-2">
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <div className="text-center mt-2">
                  <div className="text-sm font-medium flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3" />
                    {flight.duration}
                  </div>
                  <div className="text-xs text-brand-gray-500">
                    {flight.numberOfStops === 0
                      ? "Non-stop"
                      : `${flight.numberOfStops} stop${flight.numberOfStops > 1 ? "s" : ""}`}
                  </div>
                  {flight.stops.length > 0 && (
                    <div className="text-xs text-gray-400 mt-1">
                      via {flight.stops.map(stop => stop.airport).join(", ")}
                    </div>
                  )}
                </div>
              </div>

              {/* Arrival */}
              <div className="text-center">
                <div className="text-xl font-bold">
                  {formatTime(flight.arrivalTime)}
                </div>
                <div className="text-sm text-brand-gray-600 font-medium">
                  {flight.destinationAirport}
                </div>
                <div className="text-xs text-brand-gray-500">
                  {formatDate(flight.arrivalTime)}
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="flex items-center gap-3 mt-3">
              {flight.meal && (
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <Coffee className="w-4 h-4" />
                  <span>Meal included</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-xs text-brand-pink-600">
                <Luggage className="w-4 h-4" />
                <span>Baggage included</span>
              </div>
            </div>
          </div>

          {/* Class Badge */}
          <div className="text-center">
            <Badge variant="outline" className="mb-2 capitalize">
              {selectedClass}
            </Badge>
            <div className="text-xs text-brand-gray-500 bg-brand-gray-50 px-2 py-1 rounded">
              {flight.aircraft}
            </div>
          </div>

          {/* Price and Book Button */}
          <div className="text-center">
            <div className="text-2xl font-bold text-brand-pink-600 mb-1">
              ${price.toLocaleString()}
            </div>
            <div className="text-sm text-brand-gray-600 mb-3">per person</div>
            <div className="text-sm text-brand-pink-600 font-medium cursor-pointer hover:text-blue-700">
              Click to view details →
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


