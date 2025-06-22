'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { 
  Plane, 
  Clock, 
  Users, 
  Filter,
  ArrowRight,
  Star,
  Wifi,
  Coffee,
  Luggage,
  Search,
  CalendarDays,
  ArrowLeftRight,
  PlaneTakeoff,
  PlaneLanding,
  Edit3
} from 'lucide-react';

// Temporary flight data
const tempFlightData = [
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

const FlightSearchPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Original search parameters from URL
  const originalFlightType = searchParams?.get('flightType') || 'round-trip';
  const originalFrom = searchParams?.get('from') || 'New York';
  const originalTo = searchParams?.get('to') || 'Los Angeles';
  const originalDepartDate = searchParams?.get('departDate') || '';
  const originalReturnDate = searchParams?.get('returnDate') || '';
  const originalTravelers = searchParams?.get('travelers') || '1 adult, Economy';
  
  // Editable search state
  const [isEditingSearch, setIsEditingSearch] = useState(false);
  const [editFlightType, setEditFlightType] = useState(originalFlightType);
  const [editFrom, setEditFrom] = useState(originalFrom);
  const [editTo, setEditTo] = useState(originalTo);
  const [editDepartDate, setEditDepartDate] = useState<Date | undefined>(
    originalDepartDate ? new Date(originalDepartDate) : undefined
  );
  const [editReturnDate, setEditReturnDate] = useState<Date | undefined>(
    originalReturnDate ? new Date(originalReturnDate) : undefined
  );
  const [editTravelers, setEditTravelers] = useState(originalTravelers);
  
  // Filter states
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [selectedStops, setSelectedStops] = useState<string[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [filteredFlights, setFilteredFlights] = useState(tempFlightData);
  const [sortBy, setSortBy] = useState('price');
  // Get unique values for filters
  const airlines = [...new Set(tempFlightData.map(flight => flight.airline))];
  const classes = [...new Set(tempFlightData.map(flight => flight.class))];

  // Handle search with new parameters
  const handleNewSearch = () => {
    const params = new URLSearchParams({
      flightType: editFlightType,
      from: editFrom,
      to: editTo,
      departDate: editDepartDate ? format(editDepartDate, 'yyyy-MM-dd') : '',
      returnDate: editReturnDate ? format(editReturnDate, 'yyyy-MM-dd') : '',
      travelers: editTravelers,
    });
    
    router.push(`/flight-search?${params.toString()}`);
    setIsEditingSearch(false);
  };

  // Handle swap locations
  const handleSwapLocations = () => {
    const temp = editFrom;
    setEditFrom(editTo);
    setEditTo(temp);
  };
  useEffect(() => {
    console.log('Flight Search Params:', {
      flightType: originalFlightType,
      from: originalFrom,
      to: originalTo,
      departDate: originalDepartDate,
      returnDate: originalReturnDate,
      travelers: originalTravelers,
    });
  }, [originalFlightType, originalFrom, originalTo, originalDepartDate, originalReturnDate, originalTravelers]);
  // Filter flights based on selected criteria
  useEffect(() => {
    const filtered = tempFlightData.filter(flight => {
      const priceInRange = flight.price >= priceRange[0] && flight.price <= priceRange[1];
      const airlineMatch = selectedAirlines.length === 0 || selectedAirlines.includes(flight.airline);
      const stopsMatch = selectedStops.length === 0 || selectedStops.includes(flight.stops.toString());
      const classMatch = selectedClasses.length === 0 || selectedClasses.includes(flight.class);
      
      return priceInRange && airlineMatch && stopsMatch && classMatch;
    });

    // Sort flights
    switch (sortBy) {
      case 'price':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'duration':
        filtered.sort((a, b) => a.duration.localeCompare(b.duration));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'departure':
        filtered.sort((a, b) => a.departure.time.localeCompare(b.departure.time));
        break;
    }

    setFilteredFlights(filtered);
  }, [priceRange, selectedAirlines, selectedStops, selectedClasses, sortBy]);

  const handleAirlineChange = (airline: string, checked: boolean) => {
    if (checked) {
      setSelectedAirlines([...selectedAirlines, airline]);
    } else {
      setSelectedAirlines(selectedAirlines.filter(a => a !== airline));
    }
  };

  const handleStopsChange = (stops: string, checked: boolean) => {
    if (checked) {
      setSelectedStops([...selectedStops, stops]);
    } else {
      setSelectedStops(selectedStops.filter(s => s !== stops));
    }
  };

  const handleClassChange = (flightClass: string, checked: boolean) => {
    if (checked) {
      setSelectedClasses([...selectedClasses, flightClass]);
    } else {
      setSelectedClasses(selectedClasses.filter(c => c !== flightClass));
    }
  };return (
    <div className="min-h-screen bg-gray-50">      {/* Header with Search Summary and Edit Button */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Flight Search Results</h1>
            <div className="flex items-center gap-3">
              <Badge className="bg-blue-100 text-blue-800">
                {filteredFlights.length} flights found
              </Badge>
              <Button
                onClick={() => setIsEditingSearch(!isEditingSearch)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                {isEditingSearch ? 'Cancel' : 'Edit Search'}
              </Button>
            </div>          </div>
          
          {/* Current Search Parameters Summary */}
          {!isEditingSearch && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-blue-700">Route:</span>
                  <span className="bg-white px-2 py-1 rounded border flex items-center gap-1">
                    <PlaneTakeoff className="w-4 h-4 text-blue-500" />
                    {originalFrom}
                  </span>
                  <ArrowRight className="w-4 h-4 text-blue-500" />
                  <span className="bg-white px-2 py-1 rounded border flex items-center gap-1">
                    <PlaneLanding className="w-4 h-4 text-blue-500" />
                    {originalTo}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-blue-700">Type:</span>
                  <span className="bg-white px-2 py-1 rounded border">{originalFlightType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-blue-700">Departure:</span>
                  <span className="bg-white px-2 py-1 rounded border">{originalDepartDate || 'Not set'}</span>
                </div>
                {originalReturnDate && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-blue-700">Return:</span>
                    <span className="bg-white px-2 py-1 rounded border">{originalReturnDate}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="font-medium text-blue-700">Travelers:</span>
                  <span className="bg-white px-2 py-1 rounded border">{originalTravelers}</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Editable Search Form */}
          {isEditingSearch && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
                {/* Flight Type */}
                <div className="lg:col-span-1">
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Flight Type</Label>
                  <RadioGroup value={editFlightType} onValueChange={setEditFlightType}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="one-way" id="edit-one-way" />
                      <Label htmlFor="edit-one-way" className="text-xs">One Way</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="round-trip" id="edit-round-trip" />
                      <Label htmlFor="edit-round-trip" className="text-xs">Round Trip</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {/* From */}
                <div className="lg:col-span-1">
                  <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <PlaneTakeoff className="h-4 w-4 text-blue-500" />
                    From
                  </Label>
                  <input
                    type="text"
                    value={editFrom}
                    onChange={(e) => setEditFrom(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Departure city"
                  />
                </div>

                {/* Swap Button */}
                <div className="lg:col-span-1 flex justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSwapLocations}
                    className="p-2 rounded-full"
                  >
                    <ArrowLeftRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* To */}
                <div className="lg:col-span-1">
                  <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <PlaneLanding className="h-4 w-4 text-blue-500" />
                    To
                  </Label>
                  <input
                    type="text"
                    value={editTo}
                    onChange={(e) => setEditTo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Destination city"
                  />
                </div>

                {/* Depart Date */}
                <div className="lg:col-span-1">
                  <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <CalendarDays className="h-4 w-4 text-blue-500" />
                    Depart
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal text-sm h-10",
                          !editDepartDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarDays className="mr-2 h-4 w-4" />
                        {editDepartDate ? format(editDepartDate, "MMM dd, yyyy") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={editDepartDate}
                        onSelect={setEditDepartDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Return Date (if round-trip) */}
                {editFlightType === "round-trip" && (
                  <div className="lg:col-span-1">
                    <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <CalendarDays className="h-4 w-4 text-blue-500" />
                      Return
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal text-sm h-10",
                            !editReturnDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarDays className="mr-2 h-4 w-4" />
                          {editReturnDate ? format(editReturnDate, "MMM dd, yyyy") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={editReturnDate}
                          onSelect={setEditReturnDate}
                          disabled={(date) => date < (editDepartDate || new Date())}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}

                {/* Travelers */}
                <div className="lg:col-span-1">
                  <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    Travelers
                  </Label>
                  <select
                    value={editTravelers}
                    onChange={(e) => setEditTravelers(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
                <div className="lg:col-span-1">
                  <Button
                    onClick={handleNewSearch}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card>
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
                          onCheckedChange={(checked: boolean) => handleAirlineChange(airline, checked)}
                        />
                        <label htmlFor={airline} className="text-sm">{airline}</label>
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
                          onCheckedChange={(checked: boolean) => handleStopsChange(stops, checked)}
                        />
                        <label htmlFor={`stops-${stops}`} className="text-sm">
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
                          onCheckedChange={(checked: boolean) => handleClassChange(flightClass, checked)}
                        />
                        <label htmlFor={flightClass} className="text-sm">{flightClass}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Flight Results */}
          <div className="lg:col-span-3">
            {/* Sort Options */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1 border rounded-md text-sm"
                >
                  <option value="price">Price (Low to High)</option>
                  <option value="duration">Duration</option>
                  <option value="rating">Rating</option>
                  <option value="departure">Departure Time</option>
                </select>
              </div>
            </div>

            {/* Flight Cards */}
            <div className="space-y-4">
              {filteredFlights.map((flight) => (
                <Card key={flight.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      {/* Flight Info */}
                      <div className="md:col-span-2">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Plane className="w-5 h-5 text-blue-600" />
                            <span className="font-semibold">{flight.airline}</span>
                            <span className="text-sm text-gray-500">{flight.flightNumber}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{flight.rating}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-center">
                            <div className="text-xl font-bold">{flight.departure.time}</div>
                            <div className="text-sm text-gray-600">{flight.departure.airport}</div>
                            <div className="text-xs text-gray-500">{flight.departure.city}</div>
                          </div>
                          
                          <div className="flex-1 mx-4">
                            <div className="flex items-center justify-center relative">
                              <div className="w-full h-px bg-gray-300"></div>
                              <div className="absolute bg-white px-2">
                                <ArrowRight className="w-4 h-4 text-gray-400" />
                              </div>
                            </div>
                            <div className="text-center mt-1">
                              <div className="text-sm font-medium">{flight.duration}</div>
                              <div className="text-xs text-gray-500">
                                {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-center">
                            <div className="text-xl font-bold">{flight.arrival.time}</div>
                            <div className="text-sm text-gray-600">{flight.arrival.airport}</div>
                            <div className="text-xs text-gray-500">{flight.arrival.city}</div>
                          </div>
                        </div>

                        {/* Amenities */}
                        <div className="flex items-center gap-2 mt-3">
                          {flight.amenities.includes('wifi') && <Wifi className="w-4 h-4 text-blue-600" />}
                          {flight.amenities.includes('meals') && <Coffee className="w-4 h-4 text-green-600" />}
                          {flight.amenities.includes('entertainment') && <Clock className="w-4 h-4 text-purple-600" />}
                          {flight.amenities.includes('lounge access') && <Luggage className="w-4 h-4 text-orange-600" />}
                        </div>
                      </div>

                      {/* Price and Class */}
                      <div className="text-center">
                        <Badge variant="outline" className="mb-2">
                          {flight.class}
                        </Badge>
                        <div className="text-sm text-gray-600">{flight.aircraft}</div>
                      </div>

                      {/* Price and Book Button */}
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-2">
                          ${flight.price}
                        </div>
                        <div className="text-sm text-gray-600 mb-3">per person</div>
                        <Button className="w-full">
                          Select Flight
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* No Results */}
            {filteredFlights.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No flights found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your filters or search criteria
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setPriceRange([0, 1000]);
                      setSelectedAirlines([]);
                      setSelectedStops([]);
                      setSelectedClasses([]);
                    }}
                  >
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightSearchPage;
