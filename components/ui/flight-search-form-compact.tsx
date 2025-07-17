'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { 
  Search,
  CalendarDays,
  ArrowLeftRight,
  PlaneTakeoff,
  PlaneLanding,
  Users
} from 'lucide-react';

interface FlightSearchFormCompactProps {
  flightType: string;
  setFlightType: (type: string) => void;
  from: string;
  setFrom: (from: string) => void;
  to: string;
  setTo: (to: string) => void;
  departDate: Date | undefined;
  setDepartDate: (date: Date | undefined) => void;
  returnDate: Date | undefined;
  setReturnDate: (date: Date | undefined) => void;
  travelers: string;
  setTravelers: (travelers: string) => void;
  onSearch: () => void;
  onSwapLocations: () => void;
}

const FlightSearchFormCompact = ({
  flightType,
  setFlightType,
  from,
  setFrom,
  to,
  setTo,
  departDate,
  setDepartDate,
  returnDate,
  setReturnDate,
  travelers,
  setTravelers,
  onSearch,
  onSwapLocations,
}: FlightSearchFormCompactProps) => {
  return (
    <div className="p-4 bg-brand-gray-50 rounded-lg">
      <div className="flex flex-wrap gap-3 items-end">
        {/* Flight Type */}
        <div className="flex-shrink-0">
          <Label className="text-sm font-medium text-brand-gray-700 mb-2 block">Flight Type</Label>
          <div className="flex gap-2">
            <RadioGroup value={flightType} onValueChange={setFlightType} className="flex gap-4">
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="one-way" id="edit-one-way" />
                <Label htmlFor="edit-one-way" className="text-xs whitespace-nowrap">One Way</Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="round-trip" id="edit-round-trip" />
                <Label htmlFor="edit-round-trip" className="text-xs whitespace-nowrap">Round Trip</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        {/* From */}
        <div className="flex-shrink-0 min-w-[140px]">
          <Label className="flex items-center gap-1 text-sm font-medium text-brand-gray-700 mb-2">
            <PlaneTakeoff className="h-3 w-3 text-brand-pink-500" />
            From
          </Label>
          <input
            type="text"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full px-3 py-2 border border-brand-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink-500 focus:border-transparent text-sm h-10"
            placeholder="Departure city"
          />
        </div>

        {/* Swap Button */}
        <div className="flex-shrink-0">
          <div className="mb-2 h-5"></div> {/* Spacer for alignment */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onSwapLocations}
            className="p-2 rounded-full h-10 w-10"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </Button>
        </div>

        {/* To */}
        <div className="flex-shrink-0 min-w-[140px]">
          <Label className="flex items-center gap-1 text-sm font-medium text-brand-gray-700 mb-2">
            <PlaneLanding className="h-3 w-3 text-brand-pink-500" />
            To
          </Label>
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full px-3 py-2 border border-brand-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink-500 focus:border-transparent text-sm h-10"
            placeholder="Destination city"
          />
        </div>

        {/* Depart Date */}
        <div className="flex-shrink-0 min-w-[140px]">
          <Label className="flex items-center gap-1 text-sm font-medium text-brand-gray-700 mb-2">
            <CalendarDays className="h-3 w-3 text-brand-pink-500" />
            Depart
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal text-xs h-10",
                  !departDate && "text-muted-foreground"
                )}
              >
                <CalendarDays className="mr-2 h-3 w-3" />
                {departDate ? format(departDate, "MMM dd") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={departDate}
                onSelect={setDepartDate}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Return Date (if round-trip) */}
        {flightType === "round-trip" && (
          <div className="flex-shrink-0 min-w-[140px]">
            <Label className="flex items-center gap-1 text-sm font-medium text-brand-gray-700 mb-2">
              <CalendarDays className="h-3 w-3 text-brand-pink-500" />
              Return
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal text-xs h-10",
                    !returnDate && "text-muted-foreground"
                  )}
                >
                  <CalendarDays className="mr-2 h-3 w-3" />
                  {returnDate ? format(returnDate, "MMM dd") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={returnDate}
                  onSelect={setReturnDate}
                  disabled={(date) => date < (departDate || new Date())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}

        {/* Travelers */}
        <div className="flex-shrink-0 min-w-[140px]">
          <Label className="flex items-center gap-1 text-sm font-medium text-brand-gray-700 mb-2">
            <Users className="h-3 w-3 text-brand-pink-500" />
            Travelers
          </Label>
          <select
            value={travelers}
            onChange={(e) => setTravelers(e.target.value)}
            className="w-full px-3 py-2 border border-brand-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink-500 focus:border-transparent text-sm h-10"
          >
            <option value="1 adult, Economy">1 Adult, Economy</option>
            <option value="1 adult, Business">1 Adult, Business</option>
            <option value="2 adults, Economy">2 Adults, Economy</option>
            <option value="2 adults, Business">2 Adults, Business</option>
            <option value="3 adults, Economy">3 Adults, Economy</option>
            <option value="4 adults, Economy">4 Adults, Economy</option>
          </select>
        </div>

        {/* Search Button */}
        <div className="flex-shrink-0">
          <div className="mb-2 h-5"></div> {/* Spacer for alignment */}
          <Button
            onClick={onSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white h-10 px-6"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FlightSearchFormCompact;


