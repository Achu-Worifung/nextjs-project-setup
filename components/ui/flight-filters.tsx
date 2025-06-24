'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Filter } from 'lucide-react';

interface FlightFiltersProps {
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  selectedAirlines: string[];
  selectedStops: string[];
  selectedClasses: string[];
  airlines: string[];
  classes: string[];
  onAirlineChange: (airline: string, checked: boolean) => void;
  onStopsChange: (stops: string, checked: boolean) => void;
  onClassChange: (flightClass: string, checked: boolean) => void;
}

const FlightFilters = ({
  priceRange,
  setPriceRange,
  selectedAirlines,
  selectedStops,
  selectedClasses,
  airlines,
  classes,
  onAirlineChange,
  onStopsChange,
  onClassChange,
}: FlightFiltersProps) => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Range */}
        <div>
          <h3 className="font-medium mb-3">Price Range</h3>
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={1000}
            min={0}
            step={10}
            className="mb-2"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>

        {/* Airlines */}
        <div>
          <h3 className="font-medium mb-3">Airlines</h3>
          <div className="space-y-2">
            {airlines.map((airline) => (
              <div key={airline} className="flex items-center space-x-2">
                <Checkbox
                  id={airline}
                  checked={selectedAirlines.includes(airline)}
                  onCheckedChange={(checked: boolean) => onAirlineChange(airline, checked)}
                />
                <label htmlFor={airline} className="text-sm cursor-pointer">
                  {airline}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Stops */}
        <div>
          <h3 className="font-medium mb-3">Stops</h3>
          <div className="space-y-2">
            {['0', '1', '2'].map((stops) => (
              <div key={stops} className="flex items-center space-x-2">
                <Checkbox
                  id={`stops-${stops}`}
                  checked={selectedStops.includes(stops)}
                  onCheckedChange={(checked: boolean) => onStopsChange(stops, checked)}
                />
                <label htmlFor={`stops-${stops}`} className="text-sm cursor-pointer">
                  {stops === '0' ? 'Non-stop' : `${stops} stop${stops === '1' ? '' : 's'}`}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Class */}
        <div>
          <h3 className="font-medium mb-3">Class</h3>
          <div className="space-y-2">
            {classes.map((flightClass) => (
              <div key={flightClass} className="flex items-center space-x-2">
                <Checkbox
                  id={flightClass}
                  checked={selectedClasses.includes(flightClass)}
                  onCheckedChange={(checked: boolean) => onClassChange(flightClass, checked)}
                />
                <label htmlFor={flightClass} className="text-sm cursor-pointer">
                  {flightClass}
                </label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlightFilters;
