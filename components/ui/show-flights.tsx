"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { format, isValid } from "date-fns";
import {
  Users,
  Filter,
  Search,
  CalendarDays,
  ArrowLeftRight,
  PlaneTakeoff,
  PlaneLanding,
  Car,
  Hotel,
} from "lucide-react";
import { Flight } from "@/lib/types";
import { FlightCards } from "@/components/ui/flight-cards";

interface CarRental {
  inventoryId: string;
  companyCity: string;
  companyCountry: string;
  carType: string;
  datesAvailable: string;
  datesUnavailable: string;
  dailyPrice: string;
  childPrice: string;
}

interface Hotel {
  inventoryId: string;
  hotelName: string;
  hotelCity: string;
  hotelCountry: string;
  datesAvailable: string;
  datesUnavailable: string;
  basePrice: string;
  childPricePerNight: string;
}

const getUniqueAirlines = (flights: Flight[]) => {
  const airlines = new Set<string>();
  flights.forEach((flight) => airlines.add(flight.airline));
  return Array.from(airlines);
};

const FlightSearchPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const originalFlightType = searchParams?.get("flightType") || "round-trip";
  const originalFrom = searchParams?.get("from")?.split(",")[0].trim() || "New York";
  const originalTo = searchParams?.get("to")?.split(",")[0].trim() || "London";
  const originalDepartDate = searchParams?.get("departDate") || "2025-08-01";
  const originalReturnDate = searchParams?.get("returnDate") || "2025-08-08";
  const originalTravelers = searchParams?.get("travelers") || "1 Adult";
  const originalClassType = searchParams?.get("classType") || "Economy";

  const [editFlightType, setEditFlightType] = useState(originalFlightType);
  const [editFrom, setEditFrom] = useState(originalFrom);
  const [editTo, setEditTo] = useState(originalTo);
  const [editDepartDate, setEditDepartDate] = useState<Date | undefined>(
    isValid(new Date(originalDepartDate)) ? new Date(originalDepartDate) : undefined
  );
  const [editReturnDate, setEditReturnDate] = useState<Date | undefined>(
    isValid(new Date(originalReturnDate)) ? new Date(originalReturnDate) : undefined
  );
  const [editTravelers, setEditTravelers] = useState(`${originalTravelers}, ${originalClassType}`);

  const [flights, setFlights] = useState<Flight[]>([]);
  const [carRentals, setCarRentals] = useState<CarRental[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [priceRange, setPriceRange] = useState<number[]>([0, 5000]);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [selectedStops, setSelectedStops] = useState<string[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [sortBy, setSortBy] = useState("price");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!isValid(new Date(originalDepartDate))) {
          throw new Error("Invalid departure date");
        }
        if (editFlightType === "round-trip" && !isValid(new Date(originalReturnDate))) {
          throw new Error("Invalid return date");
        }

        const flightResponse = await fetch(
          `http://localhost:8000/flights?origin_city=${encodeURIComponent(
            originalFrom
          )}&destination_city=${encodeURIComponent(
            originalTo
          )}&departure_date=${format(new Date(originalDepartDate), "yyyy-MM-dd")}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!flightResponse.ok) {
          throw new Error(`Flight fetch failed: ${flightResponse.statusText}`);
        }
        const flightData = await flightResponse.json();
        console.log("Flights response:", flightData);
        setFlights(Array.isArray(flightData) ? flightData : []);

        const carResponse = await fetch(
          `http://localhost:8000/car-rentals?city=${encodeURIComponent(
            originalTo
          )}&start_date=${format(
            new Date(originalDepartDate),
            "yyyy-MM-dd"
          )}&end_date=${format(new Date(originalReturnDate), "yyyy-MM-dd")}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!carResponse.ok) {
          throw new Error(`Car rental fetch failed: ${carResponse.statusText}`);
        }
        const carData = await carResponse.json();
        console.log("Car rentals response:", carData);
        setCarRentals(Array.isArray(carData) ? carData : []);

        const hotelResponse = await fetch(
          `http://localhost:8000/hotels?city=${encodeURIComponent(
            originalTo
          )}&check_in=${format(
            new Date(originalDepartDate),
            "yyyy-MM-dd"
          )}&check_out=${format(new Date(originalReturnDate), "yyyy-MM-dd")}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!hotelResponse.ok) {
          throw new Error(`Hotel fetch failed: ${hotelResponse.statusText}`);
        }
        const hotelData = await hotelResponse.json();
        console.log("Hotels response:", hotelData);
        setHotels(Array.isArray(hotelData) ? hotelData : []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [originalFrom, originalTo, originalDepartDate, originalReturnDate, editFlightType]);

  useEffect(() => {
    let filtered = [...flights];

    if (priceRange[0] > 0 || priceRange[1] < 5000) {
      filtered = filtered.filter((flight) => {
        const lowestPrice = Math.min(
          ...Object.values(flight.prices as Record<string, number>)
        );
        return lowestPrice >= priceRange[0] && lowestPrice <= priceRange[1];
      });
    }

    if (selectedAirlines.length > 0) {
      filtered = filtered.filter((flight) =>
        selectedAirlines.includes(flight.airline)
      );
    }

    if (selectedStops.length > 0) {
      filtered = filtered.filter((flight) =>
        selectedStops.includes(flight.numberOfStops.toString())
      );
    }

    const sortedFiltered = [...filtered];
    try {
      switch (sortBy) {
        case "price":
          sortedFiltered.sort((a, b) => {
            const priceA = Math.min(
              ...Object.values(a.prices as Record<string, number>)
            );
            const priceB = Math.min(
              ...Object.values(b.prices as Record<string, number>)
            );
            return priceA - priceB;
          });
          break;
        case "duration":
          sortedFiltered.sort((a, b) => {
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

    console.log("Total flights:", flights.length);
    console.log("Filtered flights:", sortedFiltered.length);
    setFilteredFlights(sortedFiltered);
  }, [flights, priceRange, selectedAirlines, selectedStops, sortBy]);

  const handleAirlineChange = (airline: string, checked: boolean) => {
    setSelectedAirlines(
      checked
        ? [...selectedAirlines, airline]
        : selectedAirlines.filter((a) => a !== airline)
    );
  };

  const handleStopsChange = (stops: string, checked: boolean) => {
    setSelectedStops(
      checked ? [...selectedStops, stops] : selectedStops.filter((s) => s !== stops)
    );
  };

  const handleFlightSelect = (flight: Flight) => {
    const flightParams = new URLSearchParams({
      flight: encodeURIComponent(JSON.stringify(flight)),
    });
    router.push(`/flight-details?${flightParams.toString()}`);
  };

  const handleCarSelect = (car: CarRental) => {
    const carParams = new URLSearchParams({
      car: encodeURIComponent(JSON.stringify(car)),
    });
    router.push(`/car-details?${carParams.toString()}`);
  };

  const handleHotelSelect = (hotel: Hotel) => {
    const hotelParams = new URLSearchParams({
      hotel: encodeURIComponent(JSON.stringify(hotel)),
    });
    router.push(`/hotel-details?${hotelParams.toString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-gray-50 dark:bg-[rgb(20,25,30)]">
        <p className="text-gray-900 dark:text-white">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-gray-50 dark:bg-[rgb(20,25,30)]">
        <Card className="bg-white dark:bg-[rgb(25,30,36)]">
          <CardContent className="pt-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4 bg-brand-pink-600 text-white"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-gray-50 dark:bg-[rgb(20,25,30)]">
      <div className="bg-white shadow-sm border-gray-200 dark:bg-[rgb(25,30,36)] dark:border-brand-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Travel Search Results
            </h1>
            <div className="flex gap-2">
              <Badge className="bg-brand-pink-100 text-brand-pink-800 dark:bg-brand-pink-900 dark:text-brand-pink-200">
                {filteredFlights.length} flights
              </Badge>
              <Badge className="bg-brand-blue-100 text-brand-blue-800 dark:bg-brand-blue-900 dark:text-brand-blue-200">
                {carRentals.length} cars
              </Badge>
              <Badge className="bg-brand-green-100 text-brand-green-800 dark:bg-brand-green-900 dark:text-brand-green-200">
                {hotels.length} hotels
              </Badge>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-brand-gray-200 p-6 mb-6 dark:bg-[rgb(25,30,36)] dark:border-brand-gray-700 dark:shadow-xl dark:text-white">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
              <div className="lg:col-span-2">
                <Label className="flex items-center gap-2 text-sm font-semibold">
                  Trip Type
                </Label>
                <select
                  value={editFlightType}
                  onChange={(e) =>
                    setEditFlightType(e.target.value as "one-way" | "round-trip")
                  }
                  className="w-full px-4 py-3 border border-brand-gray-300 rounded-lg focus:ring-1 focus:ring-brand-pink-500 focus:border-brand-pink-500 text-sm font-medium shadow-sm transition-all duration-200 hover:shadow-md h-12 dark:bg-[rgb(40,47,54)] dark:border-brand-gray-600 dark:text-white"
                >
                  <option value="one-way">One Way</option>
                  <option value="round-trip">Round Trip</option>
                </select>
              </div>
              <div className="lg:col-span-2">
                <Label className="flex items-center gap-2 text-sm font-semibold mb-2">
                  <PlaneTakeoff className="h-4 w-4 text-brand-pink-600" />
                  From
                </Label>
                <input
                  type="text"
                  value={editFrom}
                  onChange={(e) => setEditFrom(e.target.value)}
                  className="w-full px-4 py-3 border border-brand-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink-500 focus:border-brand-pink-500 text-sm font-medium shadow-sm transition-all duration-200 hover:shadow-md h-12 dark:bg-[rgb(40,47,54)] dark:border-brand-gray-600 dark:text-white"
                  placeholder="Departure city"
                />
              </div>
              <div className="lg:col-span-1 flex justify-center">
                <div className="mb-2 h-5"></div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const temp = editFrom;
                    setEditFrom(editTo);
                    setEditTo(temp);
                  }}
                  className="p-3 rounded-full h-12 w-12 border-2 border-brand-pink-200 hover:border-brand-pink-500 hover:bg-brand-pink-50 dark:border-brand-pink-700 dark:hover:border-brand-pink-400 dark:hover:bg-brand-pink-900"
                >
                  <ArrowLeftRight className="h-5 w-5 text-brand-pink-600 dark:text-brand-pink-400" />
                </Button>
              </div>
              <div className="lg:col-span-2">
                <Label className="flex items-center gap-2 text-sm font-semibold mb-2">
                  <PlaneLanding className="h-4 w-4 text-brand-pink-600" />
                  To
                </Label>
                <input
                  type="text"
                  value={editTo}
                  onChange={(e) => setEditTo(e.target.value)}
                  className="w-full px-4 py-3 border border-brand-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink-500 focus:border-brand-pink-500 text-sm font-medium shadow-sm transition-all duration-200 hover:shadow-md h-12 dark:bg-[rgb(40,47,54)] dark:border-brand-gray-600 dark:text-white"
                  placeholder="Destination city"
                />
              </div>
              <div className="lg:col-span-2">
                <Label className="flex items-center gap-2 text-sm font-semibold mb-2">
                  <CalendarDays className="h-4 w-4 text-brand-pink-600" />
                  {editFlightType === "round-trip" ? "Departure & Return" : "Departure"}
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-medium text-sm h-12 px-4 shadow-sm hover:shadow-md transition-all duration-200 bg-white border-brand-gray-300 text-gray-900 hover:bg-gray-50 dark:bg-[rgb(40,47,54)] dark:border-brand-gray-600 dark:text-white",
                        !editDepartDate && "text-gray-900 dark:text-white"
                      )}
                    >
                      <CalendarDays className="mr-2 h-4 w-4 text-brand-pink-600 dark:text-brand-pink-400" />
                      {editDepartDate && editFlightType === "round-trip" && editReturnDate
                        ? `${format(editDepartDate, "MMM dd")} - ${format(
                            editReturnDate,
                            "MMM dd"
                          )}`
                        : editDepartDate
                        ? format(editDepartDate, "MMM dd, yyyy")
                        : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 bg-white border-brand-gray-200 dark:bg-[rgb(25,30,36)] dark:border-brand-gray-700"
                    align="start"
                  >
                    <div className="p-4">
                      {editFlightType === "round-trip" ? (
                        <div className="flex flex-col lg:flex-row gap-4">
                          <div>
                            <Label className="text-sm font-medium mb-2 block text-gray-900 dark:text-white">
                              Departure Date
                            </Label>
                            <Calendar
                              mode="single"
                              selected={editDepartDate}
                              onSelect={setEditDepartDate}
                              disabled={(date) => date < new Date()}
                              initialFocus
                              className="bg-white text-gray-900 dark:bg-[rgb(25,30,36)] dark:text-white"
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium mb-2 block text-gray-900 dark:text-white">
                              Return Date
                            </Label>
                            <Calendar
                              mode="single"
                              selected={editReturnDate}
                              onSelect={setEditReturnDate}
                              disabled={(date) => date < (editDepartDate || new Date())}
                              className="bg-white text-gray-900 dark:bg-[rgb(25,30,36)] dark:text-white"
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <Label className="text-sm font-medium mb-2 block text-gray-900 dark:text-white">
                            Departure Date
                          </Label>
                          <Calendar
                            mode="single"
                            selected={editDepartDate}
                            onSelect={setEditDepartDate}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="bg-white text-gray-900 dark:bg-[rgb(25,30,36)] dark:text-white"
                          />
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="lg:col-span-2">
                <Label className="flex items-center gap-2 text-sm font-semibold mb-2">
                  <Users className="h-4 w-4 text-brand-pink-600" />
                  Travelers & Class
                </Label>
                <select
                  value={editTravelers}
                  onChange={(e) => setEditTravelers(e.target.value)}
                  className="w-full px-4 py-3 border border-brand-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink-500 focus:border-brand-pink-500 text-sm font-medium shadow-sm transition-all duration-200 hover:shadow-md h-12 dark:bg-[rgb(40,47,54)] dark:border-brand-gray-600 dark:text-white"
                >
                  <option value="1 Adult, Economy">1 Adult, Economy</option>
                  <option value="1 Adult, Business">1 Adult, Business</option>
                  <option value="2 Adults, Economy">2 Adults, Economy</option>
                  <option value="2 Adults, Business">2 Adults, Business</option>
                  <option value="3 Adults, Economy">3 Adults, Economy</option>
                  <option value="4 Adults, Economy">4 Adults, Economy</option>
                </select>
              </div>
              <div className="lg:col-span-1">
                <div className="mb-2 h-5"></div>
                <Button
                  onClick={() => {
                    const params = new URLSearchParams({
                      flightType: editFlightType,
                      from: editFrom,
                      to: editTo,
                      departDate: editDepartDate ? format(editDepartDate, "yyyy-MM-dd") : "",
                      returnDate: editReturnDate ? format(editReturnDate, "yyyy-MM-dd") : "",
                      travelers: editTravelers.split(",")[0].trim(),
                      classType: editTravelers.split(",")[1]?.trim() || "Economy",
                    });
                    router.push(`/flight-search?${params.toString()}`);
                  }}
                  className="bg-pink-600 w-full hover:from-brand-pink-700 hover:to-brand-pink-800 text-white h-12 px-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card className="bg-white border-brand-gray-200 dark:bg-[rgb(25,30,36)] dark:border-brand-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Filter className="w-5 h-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3 text-gray-900 dark:text-white">Price Range</h3>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={5000}
                    min={0}
                    step={50}
                    className="mb-2 [&>span:first-child]:bg-brand-pink-500 dark:[&>span:first-child]:bg-brand-pink-400"
                  />
                  <div className="flex justify-between text-sm text-gray-900 dark:text-brand-gray-300">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-3 text-gray-900 dark:text-white">Airlines</h3>
                  <div className="space-y-2">
                    {getUniqueAirlines(flights).map((airline) => (
                      <div key={airline} className="flex items-center space-x-2">
                        <Checkbox
                          id={airline}
                          checked={selectedAirlines.includes(airline)}
                          onCheckedChange={(checked: boolean) => handleAirlineChange(airline, checked)}
                          className="data-[state=checked]:bg-brand-pink-500 data-[state=checked]:border-brand-pink-500"
                        />
                        <label
                          htmlFor={airline}
                          className="flex items-center gap-2 text-sm cursor-pointer text-gray-900 dark:text-white"
                        >
                          <span className="w-5 h-5 bg-brand-pink-100 rounded text-xs flex items-center justify-center">
                            {airline.substring(0, 2)}
                          </span>
                          {airline}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-3 text-gray-900 dark:text-white">Stops</h3>
                  <div className="space-y-2">
                    {["0", "1", "2"].map((stops) => (
                      <div key={stops} className="flex items-center space-x-2">
                        <Checkbox
                          id={`stops-${stops}`}
                          checked={selectedStops.includes(stops)}
                          onCheckedChange={(checked: boolean) => handleStopsChange(stops, checked)}
                          className="data-[state=checked]:bg-brand-pink-500 data-[state=checked]:border-brand-pink-500"
                        />
                        <label
                          htmlFor={`stops-${stops}`}
                          className="text-sm text-gray-900 dark:text-white"
                        >
                          {stops === "0" ? "Non-stop" : `${stops} stop${stops === "1" ? "" : "s"}`}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-3">
            <Tabs defaultValue="flights" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4 bg-white dark:bg-[rgb(40,47,54)]">
                <TabsTrigger
                  value="flights"
                  className="data-[state=active]:bg-brand-pink-100 data-[state=active]:text-brand-pink-800 dark:data-[state=active]:bg-brand-pink-900 dark:data-[state=active]:text-brand-pink-200"
                >
                  <PlaneTakeoff className="w-4 h-4 mr-2" />
                  Flights
                </TabsTrigger>
                <TabsTrigger
                  value="cars"
                  className="data-[state=active]:bg-brand-blue-100 data-[state=active]:text-brand-blue-800 dark:data-[state=active]:bg-brand-blue-900 dark:data-[state=active]:text-brand-blue-200"
                >
                  <Car className="w-4 h-4 mr-2" />
                  Car Rentals
                </TabsTrigger>
                <TabsTrigger
                  value="hotels"
                  className="data-[state=active]:bg-brand-green-100 data-[state=active]:text-brand-green-800 dark:data-[state=active]:bg-brand-green-900 dark:data-[state=active]:text-brand-green-200"
                >
                  <Hotel className="w-4 h-4 mr-2" />
                  Hotels
                </TabsTrigger>
              </TabsList>
              <TabsContent value="flights">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-white">
                      Sort by:
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-1 border rounded-sm text-sm dark:bg-[rgb(40,47,54)] dark:text-white"
                    >
                      <option value="price">Price (Low to High)</option>
                      <option value="duration">Duration</option>
                      <option value="departure">Departure Time</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-6">
                  {filteredFlights.length === 0 ? (
                    <Card className="text-center py-12 bg-white border-brand-gray-200 dark:bg-[rgb(25,30,36)] dark:border-brand-gray-700">
                      <CardContent>
                        <Search className="w-12 h-12 text-gray-400 mx-auto mb-4 dark:text-gray-500" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2 dark:text-white">
                          No flights found
                        </h3>
                        <p className="text-gray-900 mb-4 dark:text-brand-gray-300">
                          Try adjusting your filters or search criteria
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setPriceRange([0, 5000]);
                            setSelectedAirlines([]);
                            setSelectedStops([]);
                          }}
                          className="bg-white text-gray-900 border-gray-300 hover:bg-gray-50 dark:bg-[rgb(40,47,54)] dark:text-brand-gray-200 dark:border-brand-gray-600"
                        >
                          Clear All Filters
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredFlights.map((flight) => (
                      <div
                        key={`${flight.airline}-${flight.flightNumber}`}
                        onClick={() => handleFlightSelect(flight)}
                        className="cursor-pointer transition-transform hover:scale-[1.02] hover:shadow-lg"
                      >
                        <FlightCards flight={flight} />
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
              <TabsContent value="cars">
                <div className="space-y-6">
                  {carRentals.length === 0 ? (
                    <Card className="text-center py-12 bg-white border-brand-gray-200 dark:bg-[rgb(25,30,36)] dark:border-brand-gray-700">
                      <CardContent>
                        <Car className="w-12 h-12 text-gray-400 mx-auto mb-4 dark:text-gray-500" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2 dark:text-white">
                          No car rentals found
                        </h3>
                        <p className="text-gray-900 mb-4 dark:text-brand-gray-300">
                          Try adjusting your search criteria
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    carRentals.map((car) => (
                      <Card
                        key={car.inventoryId}
                        onClick={() => handleCarSelect(car)}
                        className="cursor-pointer transition-transform hover:scale-[1.02] hover:shadow-lg bg-white dark:bg-[rgb(25,30,36)]"
                      >
                        <CardHeader>
                          <CardTitle className="text-gray-900 dark:text-white">
                            {car.carType} in {car.companyCity}, {car.companyCountry}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-900 dark:text-brand-gray-300">
                            Dates: {format(new Date(car.datesAvailable), "MMM dd, yyyy")} -{" "}
                            {format(new Date(car.datesUnavailable), "MMM dd, yyyy")}
                          </p>
                          <p className="text-gray-900 dark:text-brand-gray-300">
                            Daily Price: ${car.dailyPrice}
                          </p>
                          <p className="text-gray-900 dark:text-brand-gray-300">
                            Child Price: ${car.childPrice}
                          </p>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
              <TabsContent value="hotels">
                <div className="space-y-6">
                  {hotels.length === 0 ? (
                    <Card className="text-center py-12 bg-white border-brand-gray-200 dark:bg-[rgb(25,30,36)] dark:border-brand-gray-700">
                      <CardContent>
                        <Hotel className="w-12 h-12 text-gray-400 mx-auto mb-4 dark:text-gray-500" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2 dark:text-white">
                          No hotels found
                        </h3>
                        <p className="text-gray-900 mb-4 dark:text-brand-gray-300">
                          Try adjusting your search criteria
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    hotels.map((hotel) => (
                      <Card
                        key={hotel.inventoryId}
                        onClick={() => handleHotelSelect(hotel)}
                        className="cursor-pointer transition-transform hover:scale-[1.02] hover:shadow-lg bg-white dark:bg-[rgb(25,30,36)]"
                      >
                        <CardHeader>
                          <CardTitle className="text-gray-900 dark:text-white">
                            {hotel.hotelName} in {hotel.hotelCity}, {hotel.hotelCountry}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-900 dark:text-brand-gray-300">
                            Dates: {format(new Date(hotel.datesAvailable), "MMM dd, yyyy")} -{" "}
                            {format(new Date(hotel.datesUnavailable), "MMM dd, yyyy")}
                          </p>
                          <p className="text-gray-900 dark:text-brand-gray-300">
                            Price per Night: ${hotel.basePrice}
                          </p>
                          <p className="text-gray-900 dark:text-brand-gray-300">
                            Child Price per Night: ${hotel.childPricePerNight}
                          </p>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightSearchPage;