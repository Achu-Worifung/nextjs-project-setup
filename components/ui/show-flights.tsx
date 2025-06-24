"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Users,
  Filter,
  ArrowRight,
  Wifi,
  Coffee,
  Luggage,
  Search,
  CalendarDays,
  ArrowLeftRight,
  PlaneTakeoff,
  PlaneLanding,
} from "lucide-react";
import { FlightOffer } from "@/types/flight";
import { AirlineLogo } from "@/lib/airline-logos";
import test from "@/public/test.json";

// Cast the imported JSON data to the correct type
const flightData: FlightOffer[] = test as FlightOffer[];

// Utility function to parse duration (PT22H20M -> 22h 20m)
const parseDuration = (duration: string) => {
  const matches = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!matches) return '0h 0m';
  
  const hours = matches[1] ? `${matches[1]}h` : '';
  const minutes = matches[2] ? `${matches[2]}m` : '';
  
  return `${hours} ${minutes}`.trim();
};

// Utility to format date/time (2025-06-24T23:45:00 -> 23:45)
const formatTime = (datetime: string) => {
  return new Date(datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Utility to get the first segment's cabin class
const getCabinClass = (offer: FlightOffer) => {
  return offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin || 'ECONOMY';
};

// Utility to get amenities
const getAmenities = (offer: FlightOffer) => {
  const amenities = new Set<string>();
  
  offer.travelerPricings[0]?.fareDetailsBySegment.forEach(segment => {
    // Check if amenities array exists and is an array
    if (segment.amenities && Array.isArray(segment.amenities)) {
      segment.amenities.forEach(amenity => {
        if (!amenity.isChargeable) {
          amenities.add(amenity.amenityType);
        }
      });
    }
  });
  
  return Array.from(amenities);
};

// Get unique airlines from the flight data
const getUniqueAirlines = (flights: FlightOffer[]) => {
  const airlines = new Set<string>();
  flights.forEach(flight => {
    // Add validating airline codes
    if (flight.validatingAirlineCodes && Array.isArray(flight.validatingAirlineCodes)) {
      flight.validatingAirlineCodes.forEach(code => airlines.add(code));
    }
    
    // Add carrier codes from segments
    if (flight.itineraries && flight.itineraries[0] && flight.itineraries[0].segments) {
      flight.itineraries[0].segments.forEach(segment => {
        if (segment.carrierCode) {
          airlines.add(segment.carrierCode);
        }
        if (segment.operating?.carrierCode) {
          airlines.add(segment.operating.carrierCode);
        }
      });
    }
  });
  return Array.from(airlines);
};

// Get unique classes from the flight data
const getUniqueClasses = (flights: FlightOffer[]) => {
  const classes = new Set<string>();
  flights.forEach(flight => {
    try {
      const cabinClass = getCabinClass(flight);
      if (cabinClass) {
        classes.add(cabinClass);
      }
    } catch (error) {
      console.warn('Error getting cabin class for flight:', flight.id, error);
    }
  });
  return Array.from(classes);
};

const FlightSearchPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Original search parameters from URL
  const originalFlightType = searchParams?.get("flightType") || "round-trip";
  const originalFrom = searchParams?.get("from") || "New York";
  const originalTo = searchParams?.get("to") || "Los Angeles";
  const originalDepartDate = searchParams?.get("departDate") || "";
  const originalReturnDate = searchParams?.get("returnDate") || "";
  const originalTravelers =
    searchParams?.get("travelers") || "1 adult, Economy";
  // Editable search state (always editable)
  const [editFlightType, setEditFlightType] = useState(originalFlightType);
  const [editFrom, setEditFrom] = useState(originalFrom);
  const [editTo, setEditTo] = useState(originalTo);
  const [editDepartDate, setEditDepartDate] = useState<Date | undefined>(
    originalDepartDate ? new Date(originalDepartDate) : undefined
  );
  const [editReturnDate, setEditReturnDate] = useState<Date | undefined>(
    originalReturnDate ? new Date(originalReturnDate) : undefined
  );
  const [editTravelers, setEditTravelers] = useState(originalTravelers);  // Filter states
  const [priceRange, setPriceRange] = useState<number[]>([0, 5000]); // Increased range to show all flights
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [selectedStops, setSelectedStops] = useState<string[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<FlightOffer[]>(flightData);
  const [sortBy, setSortBy] = useState("price");
  // Get unique values for filters
  const airlines = getUniqueAirlines(flightData);
  const classes = getUniqueClasses(flightData);

  // Handle search with new parameters
  const handleNewSearch = () => {
    const params = new URLSearchParams({
      flightType: editFlightType,
      from: editFrom,
      to: editTo,
      departDate: editDepartDate ? format(editDepartDate, "yyyy-MM-dd") : "",
      returnDate: editReturnDate ? format(editReturnDate, "yyyy-MM-dd") : "",
      travelers: editTravelers,
    });
    router.push(`/flight-search?${params.toString()}`);
  };

  // Handle swap locations
  const handleSwapLocations = () => {
    const temp = editFrom;
    setEditFrom(editTo);
    setEditTo(temp);
  };
  useEffect(() => {
    console.log("Flight Search Params:", {
      flightType: originalFlightType,
      from: originalFrom,
      to: originalTo,
      departDate: originalDepartDate,
      returnDate: originalReturnDate,
      travelers: originalTravelers,
    });
  }, [
    originalFlightType,
    originalFrom,
    originalTo,
    originalDepartDate,
    originalReturnDate,
    originalTravelers,
  ]);  // Update your useEffect for filtering
  useEffect(() => {
    // Start with all flights from test.json (no pre-filtering)
    let filtered = [...flightData];
      // Apply client-side filters only
    if (priceRange[0] > 0 || priceRange[1] < 5000) {
      filtered = filtered.filter(flight => {
        const price = parseFloat(flight.price?.total || '0');
        return price >= priceRange[0] && price <= priceRange[1];
      });
    }
    
    if (selectedAirlines.length > 0) {
      filtered = filtered.filter(flight => {
        const flightAirlines: string[] = [];
        
        // Add validating airline codes
        if (flight.validatingAirlineCodes && Array.isArray(flight.validatingAirlineCodes)) {
          flightAirlines.push(...flight.validatingAirlineCodes);
        }
        
        // Add carrier codes from segments
        if (flight.itineraries?.[0]?.segments) {
          flight.itineraries[0].segments.forEach(segment => {
            if (segment.carrierCode) {
              flightAirlines.push(segment.carrierCode);
            }
            if (segment.operating?.carrierCode) {
              flightAirlines.push(segment.operating.carrierCode);
            }
          });
        }
        
        return selectedAirlines.some(airline => flightAirlines.includes(airline));
      });
    }
    
    if (selectedStops.length > 0) {
      filtered = filtered.filter(flight => {
        const segmentCount = flight.itineraries?.[0]?.segments?.length || 1;
        return selectedStops.includes((segmentCount - 1).toString());
      });
    }
    
    if (selectedClasses.length > 0) {
      filtered = filtered.filter(flight => {
        return selectedClasses.includes(getCabinClass(flight));
      });
    }

    // Sort flights
    const sortedFiltered = [...filtered];
    try {
      switch (sortBy) {
        case 'price':
          sortedFiltered.sort((a, b) => {
            const priceA = parseFloat(a.price?.total || '0');
            const priceB = parseFloat(b.price?.total || '0');
            return priceA - priceB;
          });
          break;
        case 'duration':
          sortedFiltered.sort((a, b) => 
            (a.itineraries?.[0]?.duration || '').localeCompare(b.itineraries?.[0]?.duration || ''));
          break;
        case 'departure':
          sortedFiltered.sort((a, b) => 
            (a.itineraries?.[0]?.segments?.[0]?.departure?.at || '').localeCompare(
              b.itineraries?.[0]?.segments?.[0]?.departure?.at || ''
            ));
          break;
      }
    } catch (error) {
      console.warn('Error sorting flights:', error);
    }    // Debug info
    console.log('Total flights from test.json:', flightData.length);
    console.log('Flights after filtering:', sortedFiltered.length);
    setFilteredFlights(sortedFiltered);
  }, [priceRange, selectedAirlines, selectedStops, selectedClasses, sortBy]);

  const handleAirlineChange = (airline: string, checked: boolean) => {
    if (checked) {
      setSelectedAirlines([...selectedAirlines, airline]);
    } else {
      setSelectedAirlines(selectedAirlines.filter((a) => a !== airline));
    }
  };

  const handleStopsChange = (stops: string, checked: boolean) => {
    if (checked) {
      setSelectedStops([...selectedStops, stops]);
    } else {
      setSelectedStops(selectedStops.filter((s) => s !== stops));
    }
  };

  const handleClassChange = (flightClass: string, checked: boolean) => {
    if (checked) {
      setSelectedClasses([...selectedClasses, flightClass]);
    } else {
      setSelectedClasses(selectedClasses.filter((c) => c !== flightClass));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {" "}
      {/* Header with Search Summary */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Flight Search Results
            </h1>
            <Badge className="bg-blue-100 text-blue-800">
              {filteredFlights.length} flights found
            </Badge>
          </div>
          {/* Search Form - Always Visible - Single Row */}
          <div className="p-4 bg-gray-50 rounded-lg mb-4">
            <div className="flex flex-wrap gap-3 items-end">
              {/* Flight Type */}
              <div className="flex-shrink-0">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Flight Type
                </Label>
                <div className="flex gap-2">
                  <RadioGroup
                    value={editFlightType}
                    onValueChange={setEditFlightType}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="one-way" id="edit-one-way" />
                      <Label
                        htmlFor="edit-one-way"
                        className="text-xs whitespace-nowrap"
                      >
                        One Way
                      </Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="round-trip" id="edit-round-trip" />
                      <Label
                        htmlFor="edit-round-trip"
                        className="text-xs whitespace-nowrap"
                      >
                        Round Trip
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* From */}
              <div className="flex-shrink-0 min-w-[140px]">
                <Label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2">
                  <PlaneTakeoff className="h-3 w-3 text-blue-500" />
                  From
                </Label>
                <input
                  type="text"
                  value={editFrom}
                  onChange={(e) => setEditFrom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm h-10"
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
                  onClick={handleSwapLocations}
                  className="p-2 rounded-full h-10 w-10"
                >
                  <ArrowLeftRight className="h-4 w-4" />
                </Button>
              </div>

              {/* To */}
              <div className="flex-shrink-0 min-w-[140px]">
                <Label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2">
                  <PlaneLanding className="h-3 w-3 text-blue-500" />
                  To
                </Label>
                <input
                  type="text"
                  value={editTo}
                  onChange={(e) => setEditTo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm h-10"
                  placeholder="Destination city"
                />
              </div>

              {/* Depart Date */}
              <div className="flex-shrink-0 min-w-[140px]">
                <Label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2">
                  <CalendarDays className="h-3 w-3 text-blue-500" />
                  Depart
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal text-xs h-10",
                        !editDepartDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarDays className="mr-2 h-3 w-3" />
                      {editDepartDate
                        ? format(editDepartDate, "MMM dd")
                        : "Select date"}
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
                <div className="flex-shrink-0 min-w-[140px]">
                  <Label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2">
                    <CalendarDays className="h-3 w-3 text-blue-500" />
                    Return
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal text-xs h-10",
                          !editReturnDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarDays className="mr-2 h-3 w-3" />
                        {editReturnDate
                          ? format(editReturnDate, "MMM dd")
                          : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={editReturnDate}
                        onSelect={setEditReturnDate}
                        disabled={(date) =>
                          date < (editDepartDate || new Date())
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              {/* Travelers */}
              <div className="flex-shrink-0 min-w-[140px]">
                <Label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2">
                  <Users className="h-3 w-3 text-blue-500" />
                  Travelers
                </Label>
                <select
                  value={editTravelers}
                  onChange={(e) => setEditTravelers(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm h-10"
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
                  onClick={handleNewSearch}
                  className="bg-blue-600 hover:bg-blue-700 text-white h-10 px-6"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>
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
                  <h3 className="font-medium mb-3">Price Range</h3>                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={5000}
                    min={0}
                    step={50}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>

                {/* Airlines */}
                <div>
                  <h3 className="font-medium mb-3">Airlines</h3>                  <div className="space-y-2">
                    {airlines.map((airline) => (
                      <div
                        key={airline}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={airline}
                          checked={selectedAirlines.includes(airline)}
                          onCheckedChange={(checked: boolean) =>
                            handleAirlineChange(airline, checked)
                          }
                        />
                        <label htmlFor={airline} className="flex items-center gap-2 text-sm cursor-pointer">
                          <AirlineLogo 
                            airlineCode={airline}
                            className="w-5 h-5"
                            showName={true}
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stops */}
                <div>
                  <h3 className="font-medium mb-3">Stops</h3>
                  <div className="space-y-2">
                    {["0", "1", "2"].map((stops) => (
                      <div key={stops} className="flex items-center space-x-2">
                        <Checkbox
                          id={`stops-${stops}`}
                          checked={selectedStops.includes(stops)}
                          onCheckedChange={(checked: boolean) =>
                            handleStopsChange(stops, checked)
                          }
                        />
                        <label htmlFor={`stops-${stops}`} className="text-sm">
                          {stops === "0"
                            ? "Non-stop"
                            : `${stops} stop${stops === "1" ? "" : "s"}`}
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
                      <div
                        key={flightClass}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={flightClass}
                          checked={selectedClasses.includes(flightClass)}
                          onCheckedChange={(checked: boolean) =>
                            handleClassChange(flightClass, checked)
                          }
                        />
                        <label htmlFor={flightClass} className="text-sm">
                          {flightClass}
                        </label>
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
            </div>            {/* Flight Cards */}
            <div className="space-y-6">
{filteredFlights.map((flight) => {
  // Safety checks for required data
  if (!flight.itineraries?.[0]?.segments?.length) {
    return null; // Skip flights with no segments
  }
  
  const segments = flight.itineraries[0].segments;
  const firstSegment = segments[0];
  const lastSegment = segments[segments.length - 1];
  const totalStops = segments.length - 1;
  const cabinClass = getCabinClass(flight);
  const amenities = getAmenities(flight);
  
  return (
    <Card key={flight.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {/* Flight Info */}
          <div className="md:col-span-2">            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <AirlineLogo 
                  airlineCode={firstSegment.operating?.carrierCode || firstSegment.carrierCode}
                  className="w-8 h-8"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">
                    {firstSegment.operating?.carrierCode || firstSegment.carrierCode} {firstSegment.number}
                  </span>
                  <span className="text-xs text-gray-500">
                    {firstSegment.aircraft?.code}
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {flight.numberOfBookableSeats} seats left
              </div>
            </div>
              <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="text-xl font-bold">
                  {formatTime(firstSegment.departure.at)}
                </div>
                <div className="text-sm text-gray-600">
                  {firstSegment.departure.iataCode}
                </div>
                <div className="text-xs text-gray-500">
                  {firstSegment.departure.terminal && `Terminal ${firstSegment.departure.terminal}`}
                </div>
              </div>
              
              <div className="flex-1 mx-4">
                <div className="flex items-center justify-center relative">
                  <div className="w-full h-px bg-gray-300"></div>
                  <div className="absolute bg-white px-2">
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <div className="text-center mt-1">
                  <div className="text-sm font-medium">
                    {parseDuration(flight.itineraries[0].duration)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {totalStops === 0 ? 'Non-stop' : `${totalStops} stop${totalStops > 1 ? 's' : ''}`}
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-xl font-bold">
                  {formatTime(lastSegment.arrival.at)}
                </div>
                <div className="text-sm text-gray-600">
                  {lastSegment.arrival.iataCode}
                </div>
                <div className="text-xs text-gray-500">
                  {lastSegment.arrival.terminal && `Terminal ${lastSegment.arrival.terminal}`}
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="flex items-center gap-2 mt-3">
              {amenities.includes('MEAL') && <Coffee className="w-4 h-4 text-green-600" />}
              {amenities.includes('BAGGAGE') && <Luggage className="w-4 h-4 text-blue-600" />}
              {amenities.includes('PRE_RESERVED_SEAT') && <Wifi className="w-4 h-4 text-purple-600" />}
            </div>
          </div>          {/* Price and Class */}
          <div className="text-center">
            <Badge variant="outline" className="mb-2">
              {cabinClass}
            </Badge>
            <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
              {firstSegment.aircraft?.code || 'N/A'}
            </div>
          </div>

          {/* Price and Book Button */}
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              ${flight.price.total}
            </div>
            <div className="text-sm text-gray-600 mb-3">per person</div>
            <Button className="w-full">
              Select Flight
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
})}
            </div>

            {/* No Results */}
            {filteredFlights.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No flights found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your filters or search criteria
                  </p>                  <Button
                    variant="outline"
                    onClick={() => {
                      setPriceRange([0, 5000]);
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
