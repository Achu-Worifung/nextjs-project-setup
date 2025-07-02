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
  Search,
  CalendarDays,
  ArrowLeftRight,
  PlaneTakeoff,
  PlaneLanding,
} from "lucide-react";
import { generateFakeFlights } from "@/lib/flight-generator";
import { Flight } from "@/lib/types";
import { FlightCards } from "@/components/ui/flight-cards";



// Get unique airlines from the flight data
const getUniqueAirlines = (flights: Flight[]) => {
  const airlines = new Set<string>();
  flights.forEach((flight) => {
    airlines.add(flight.airline);
  });
  return Array.from(airlines);
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
  const [editTravelers, setEditTravelers] = useState(originalTravelers); 
  
  // Generate flight data based on search parameters
  const [flightData] = useState<Flight[]>(() => {
    const departDate = originalDepartDate || format(new Date(), "yyyy-MM-dd");
    console.log("Generating flights for date:", departDate);
    const flights = generateFakeFlights(departDate, 10);
    console.log("Generated flights:", flights);
    console.log("Number of flights generated:", flights.length);
    return flights;
  });
  
  // Filter states
  const [priceRange, setPriceRange] = useState<number[]>([0, 5000]); // Increased range to show all flights
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [selectedStops, setSelectedStops] = useState<string[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>(flightData);
  const [sortBy, setSortBy] = useState("price");
  
  // Get unique values for filters
  const airlines = getUniqueAirlines(flightData);

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
  ]); 
  
  // Update your useEffect for filtering
  useEffect(() => {
    // Start with all flights
    let filtered = [...flightData];
    
    // Apply client-side filters
    if (priceRange[0] > 0 || priceRange[1] < 5000) {
      filtered = filtered.filter((flight) => {
        // Get the lowest price from all classes
        const lowestPrice = Math.min(...Object.values(flight.prices));
        return lowestPrice >= priceRange[0] && lowestPrice <= priceRange[1];
      });
    }

    if (selectedAirlines.length > 0) {
      filtered = filtered.filter((flight) => {
        return selectedAirlines.includes(flight.airline);
      });
    }

    if (selectedStops.length > 0) {
      filtered = filtered.filter((flight) => {
        return selectedStops.includes(flight.numberOfStops.toString());
      });
    }

    // Sort flights
    const sortedFiltered = [...filtered];
    try {
      switch (sortBy) {
        case "price":
          sortedFiltered.sort((a, b) => {
            const priceA = Math.min(...Object.values(a.prices));
            const priceB = Math.min(...Object.values(b.prices));
            return priceA - priceB;
          });
          break;
        case "duration":
          sortedFiltered.sort((a, b) => {
            // Convert duration string to minutes for comparison
            const getDurationMinutes = (duration: string) => {
              const matches = duration.match(/(\d+)h\s*(\d+)m/);
              if (!matches) return 0;
              const hours = parseInt(matches[1]) || 0;
              const minutes = parseInt(matches[2]) || 0;
              return hours * 60 + minutes;
            };
            return getDurationMinutes(a.duration) - getDurationMinutes(b.duration);
          });
          break;
        case "departure":
          sortedFiltered.sort((a, b) => 
            a.departureTime.localeCompare(b.departureTime)
          );
          break;
      }
    } catch (error) {
      console.warn("Error sorting flights:", error);
    }
    
    // Debug info
    console.log("Total flights generated:", flightData.length);
    console.log("Flights after filtering:", sortedFiltered.length);
    setFilteredFlights(sortedFiltered);
  }, [flightData, priceRange, selectedAirlines, selectedStops, sortBy]);

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

  const handleFlightSelect = (flight: Flight) => {
    // Navigate to flight details page with flight data
    const flightParams = new URLSearchParams({
      flight: encodeURIComponent(JSON.stringify(flight)),
    });
    router.push(`/flight-details?${flightParams.toString()}`);
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
                  <h3 className="font-medium mb-3">Price Range</h3>{" "}
                  <Slider
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
                  <h3 className="font-medium mb-3">Airlines</h3>{" "}
                  <div className="space-y-2">
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
                        <label
                          htmlFor={airline}
                          className="flex items-center gap-2 text-sm cursor-pointer"
                        >
                          <span className="w-5 h-5 bg-blue-100 rounded text-xs flex items-center justify-center">
                            {airline.substring(0, 2)}
                          </span>
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
            </div>{" "}
            {/* Flight Cards */}
            <div className="space-y-6">
              {filteredFlights.map((flight) => (
                <div 
                  key={`${flight.airline}-${flight.flightNumber}`}
                  onClick={() => handleFlightSelect(flight)}
                  className="cursor-pointer transition-transform hover:scale-[1.02] hover:shadow-lg"
                >
                  <FlightCards flight={flight} />
                </div>
              ))}
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
                  </p>{" "}
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPriceRange([0, 5000]);
                      setSelectedAirlines([]);
                      setSelectedStops([]);
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
