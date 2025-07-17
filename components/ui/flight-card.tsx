'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flight } from '@/lib/flight-data';
import { 
  Plane, 
  Clock, 
  ArrowRight,
  Star,
  Wifi,
  Coffee,
  Luggage
} from 'lucide-react';

interface FlightCardProps {
  flight: Flight;
  onSelect?: (flightId: string) => void;
}

const FlightCard = ({ flight, onSelect }: FlightCardProps) => {
  const handleSelectFlight = () => {
    if (onSelect) {
      onSelect(flight.id);
    }
  };

  return (
    <Card className="hover:shadow-lg dark:hover:shadow-brand-dark-xl transition-shadow duration-200 shadow-md dark:shadow-brand-dark-lg dark:bg-[rgb(25,30,36)]">
      <CardContent className="p-6 dark:bg-[rgb(25,30,36)]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {/* Flight Info */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Plane className="w-5 h-5 text-brand-pink-600 dark:text-brand-pink-400" />
                <span className="font-semibold dark:text-white">{flight.airline}</span>
                <span className="text-sm text-brand-gray-500 dark:text-brand-gray-400">{flight.flightNumber}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium dark:text-white">{flight.rating}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <div className="text-center">
                <div className="text-xl font-bold dark:text-white">{flight.departure.time}</div>
                <div className="text-sm text-brand-gray-600 dark:text-brand-gray-300">{flight.departure.airport}</div>
                <div className="text-xs text-brand-gray-500 dark:text-brand-gray-400">{flight.departure.city}</div>
              </div>
              
              <div className="flex-1 mx-4">
                <div className="flex items-center justify-center relative">
                  <div className="w-full h-px bg-gray-300 dark:bg-brand-gray-600"></div>
                  <div className="absolute bg-white dark:bg-[rgb(25,30,36)] px-2">
                    <ArrowRight className="w-4 h-4 text-gray-400 dark:text-brand-gray-500" />
                  </div>
                </div>
                <div className="text-center mt-1">
                  <div className="text-sm font-medium dark:text-white">{flight.duration}</div>
                  <div className="text-xs text-brand-gray-500 dark:text-brand-gray-400">
                    {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-xl font-bold dark:text-white">{flight.arrival.time}</div>
                <div className="text-sm text-brand-gray-600 dark:text-brand-gray-300">{flight.arrival.airport}</div>
                <div className="text-xs text-brand-gray-500 dark:text-brand-gray-400">{flight.arrival.city}</div>
              </div>
            </div>

            {/* Amenities */}
            <div className="flex items-center gap-2">
              {flight.amenities.includes('wifi') && (
                <div className="flex items-center gap-1 text-brand-pink-600" title="Wi-Fi Available">
                  <Wifi className="w-4 h-4" />
                </div>
              )}
              {flight.amenities.includes('meals') && (
                <div className="flex items-center gap-1 text-green-600" title="Meals Included">
                  <Coffee className="w-4 h-4" />
                </div>
              )}
              {flight.amenities.includes('entertainment') && (
                <div className="flex items-center gap-1 text-purple-600" title="Entertainment System">
                  <Clock className="w-4 h-4" />
                </div>
              )}
              {flight.amenities.includes('lounge access') && (
                <div className="flex items-center gap-1 text-orange-600" title="Lounge Access">
                  <Luggage className="w-4 h-4" />
                </div>
              )}
            </div>
          </div>

          {/* Aircraft and Class */}
          <div className="text-center">
            <Badge variant="outline" className="mb-2 dark:border-brand-gray-600 dark:text-brand-gray-300">
              {flight.class}
            </Badge>
            <div className="text-sm text-brand-gray-600 dark:text-brand-gray-300">{flight.aircraft}</div>
          </div>

          {/* Price and Book Button */}
          <div className="text-center">
            <div className="text-2xl font-bold text-brand-pink-600 dark:text-brand-pink-400 mb-2">
              ${flight.price}
            </div>
            <div className="text-sm text-brand-gray-600 dark:text-brand-gray-300 mb-3">per person</div>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
              onClick={handleSelectFlight}
            >
              Select Flight
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlightCard;


