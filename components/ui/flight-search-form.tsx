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

interface FlightSearchFormProps {
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

export function FlightSearchForm({
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
}: FlightSearchFormProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 shadow-lg dark:shadow-brand-dark-lg">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Find Your Perfect Flight</h1>
            <p className="text-blue-100 dark:text-blue-200">Search and compare flights from hundreds of airlines</p>
          </div>

          {/* Flight Type Selector */}
          <div className="mb-6">
            <RadioGroup
              value={flightType}
              onValueChange={setFlightType}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="round-trip" id="round-trip" />
                <Label htmlFor="round-trip" className="text-white">Round Trip</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="one-way" id="one-way" />
                <Label htmlFor="one-way" className="text-white">One Way</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Search Form */}
          <div className="bg-white dark:bg-[rgb(25,30,36)] rounded-lg p-4 shadow-lg dark:shadow-brand-dark-lg">
            <div className="flex flex-wrap gap-4 items-end">
              {/* From */}
              <div className="flex-1 min-w-[200px]">
                <Label className="flex items-center gap-1 text-sm font-medium text-brand-gray-700 dark:text-brand-gray-300 mb-2">
                  <PlaneTakeoff className="h-3 w-3 text-brand-pink-500" />
                  From
                </Label>
                <input
                  type="text"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="Departure city"
                  className="w-full px-3 py-2 border border-brand-gray-300 dark:border-brand-gray-600 bg-white dark:bg-[rgb(25,30,36)] dark:text-white dark:placeholder-brand-gray-400 rounded-lg focus:ring-2 focus:ring-brand-pink-500 focus:border-transparent text-sm h-10"
                />
              </div>

              {/* Swap Button */}
              <div className="flex-shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onSwapLocations}
                  className="h-10 w-10 p-0"
                >
                  <ArrowLeftRight className="h-4 w-4" />
                </Button>
              </div>

              {/* To */}
              <div className="flex-1 min-w-[200px]">
                <Label className="flex items-center gap-1 text-sm font-medium text-brand-gray-700 dark:text-brand-gray-300 mb-2">
                  <PlaneLanding className="h-3 w-3 text-brand-pink-500" />
                  To
                </Label>
                <input
                  type="text"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="Destination city"
                  className="w-full px-3 py-2 border border-brand-gray-300 dark:border-brand-gray-600 bg-white dark:bg-[rgb(25,30,36)] dark:text-white dark:placeholder-brand-gray-400 rounded-lg focus:ring-2 focus:ring-brand-pink-500 focus:border-transparent text-sm h-10"
                />
              </div>

              {/* Departure Date */}
              <div className="flex-shrink-0 min-w-[140px]">
                <Label className="flex items-center gap-1 text-sm font-medium text-brand-gray-700 dark:text-brand-gray-300 mb-2">
                  <CalendarDays className="h-3 w-3 text-brand-pink-500" />
                  Departure
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal text-xs h-10 dark:border-brand-gray-600 dark:bg-[rgb(25,30,36)] dark:text-white dark:hover:bg-[rgb(35,42,49)]",
                        !departDate && "text-muted-foreground dark:text-brand-gray-400"
                      )}
                    >
                      <CalendarDays className="mr-2 h-3 w-3" />
                      {departDate ? format(departDate, "MMM dd") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white dark:bg-[rgb(25,30,36)] border border-brand-gray-200 dark:border-brand-gray-600 shadow-xl dark:shadow-brand-dark-lg" align="start">
                    <Calendar
                      mode="single"
                      selected={departDate}
                      onSelect={setDepartDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="dark:text-white"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Return Date (if round-trip) */}
              {flightType === "round-trip" && (
                <div className="flex-shrink-0 min-w-[140px]">
                  <Label className="flex items-center gap-1 text-sm font-medium text-brand-gray-700 dark:text-brand-gray-300 mb-2">
                    <CalendarDays className="h-3 w-3 text-brand-pink-500" />
                    Return
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal text-xs h-10 dark:border-brand-gray-600 dark:bg-[rgb(25,30,36)] dark:text-white dark:hover:bg-[rgb(35,42,49)]",
                          !returnDate && "text-muted-foreground dark:text-brand-gray-400"
                        )}
                      >
                        <CalendarDays className="mr-2 h-3 w-3" />
                        {returnDate ? format(returnDate, "MMM dd") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white dark:bg-[rgb(25,30,36)] border border-brand-gray-200 dark:border-brand-gray-600 shadow-xl dark:shadow-brand-dark-lg" align="start">
                      <Calendar
                        mode="single"
                        selected={returnDate}
                        onSelect={setReturnDate}
                        disabled={(date) => date < (departDate || new Date())}
                        initialFocus
                        className="dark:text-white"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              {/* Travelers */}
              <div className="flex-shrink-0 min-w-[140px]">
                <Label className="flex items-center gap-1 text-sm font-medium text-brand-gray-700 dark:text-brand-gray-300 mb-2">
                  <Users className="h-3 w-3 text-brand-pink-500" />
                  Travelers
                </Label>
                <select
                  value={travelers}
                  onChange={(e) => setTravelers(e.target.value)}
                  className="w-full px-3 py-2 border border-brand-gray-300 dark:border-brand-gray-600 bg-white dark:bg-[rgb(25,30,36)] dark:text-white rounded-lg focus:ring-2 focus:ring-brand-pink-500 focus:border-transparent text-sm h-10"
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
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white h-10 px-6 shadow-lg hover:shadow-xl dark:hover:shadow-brand-dark-xl transition-all"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>  );
}

export default FlightSearchForm;


