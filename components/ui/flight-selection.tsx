"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import airports from  "@/public/airports.json";
import {
  Search,
  Users,
  CalendarDays,
  PlaneLanding,
  PlaneTakeoff,
  ArrowLeftRight,
  MapPin,
} from "lucide-react";

import {useRouter} from 'next/navigation'
export function FlightSelection() {
  const [flightType, setFlightType] = useState("round-trip");
  const [departDate, setDepartDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");  const [travelers, setTravelers] = useState("1 adult, Economy");
  const [airportSuggestions, setAirportSuggestions] = useState<{name: string, city: string, country: string, iata: string, icao: string}[]>([]);
  const [toAirportSuggestions, setToAirportSuggestions] = useState<{name: string, city: string, country: string, iata: string, icao: string}[]>([]);

 const router = useRouter()
  const handleSwapLocations = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };



const handleSearch = () => {

  const params = new URLSearchParams({
    flightType,
    departDate: departDate ? format(departDate, 'yyyy-MM-dd') : '',
    returnDate: returnDate ? format(returnDate, 'yyyy-MM-dd') : '',
    from,
    to,
    travelers: String(travelers), 
  });

  router.push(`/flight-search?${params.toString()}`);
};

const getAirportLocation = async (e : React.ChangeEvent<HTMLInputElement>) =>
{
  setFrom(e.target.value);
  setAirportSuggestions(findAirportWithRanking(e.target.value))
}

const getToAirportLocation = async (e : React.ChangeEvent<HTMLInputElement>) =>
{
  setTo(e.target.value);
  setToAirportSuggestions(findAirportWithRanking(e.target.value))
}

function findAirportWithRanking(query : string) {
  const queryLower = query.toLowerCase();

  return airports
    .map(airport => {
      let score = 0;

      // Exact matches (highest score)
      if (airport.iata.toLowerCase() === queryLower) score += 50;
      if (airport.icao.toLowerCase() === queryLower) score += 50;

      // Partial matches (medium score)
      if (airport.name.toLowerCase().includes(queryLower)) score += 20;
      if (airport.city.toLowerCase().includes(queryLower)) score += 15;
      if (airport.country.toLowerCase().includes(queryLower)) score += 10;

      return { airport, score };
    })
    .filter(({ score }) => score > 0)  // Only keep matches
    .sort((a, b) => b.score - a.score) // Sort descending by score
    .map(({ airport }) => airport);    // Return airports only
}


  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-6 pt-10">
      {/* Flight Type Selection */}
        <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Cheap Flights</h2>
        <p className="text-gray-600">Search flights for your next adventure!</p>
        <RadioGroup
          value={flightType}
          onValueChange={setFlightType}
          className="flex items-center justify-center gap-8"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="one-way" id="one-way" />
            <Label htmlFor="one-way" className="font-medium cursor-pointer">
              One Way
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="round-trip" id="round-trip" />
            <Label htmlFor="round-trip" className="font-medium cursor-pointer">
              Round Trip
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="multi-city" id="multi-city" />
            <Label htmlFor="multi-city" className="font-medium cursor-pointer">
              Multi City
            </Label>
          </div>
        </RadioGroup>
      </div>      <div className="border-t border-gray-200 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">          {/* From Input */}
          <div className="lg:col-span-3 relative overflow-visible">
            <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <PlaneTakeoff className="h-4 w-4 text-pink-500" />
              From
            </Label>
            <div className="relative">
              <input
                onFocus={()=>{setAirportSuggestions([])}}
                type="text"
                value={from}
                onChange={(e) => getAirportLocation(e)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-sm"
                placeholder="Departure city"
              />
              <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
               
              {(airportSuggestions.length > 0 && from) && (
                <div className="absolute top-full left-0 w-full z-[9999] bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-32 overflow-y-auto">
                  {airportSuggestions.map((airport, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-pink-50 cursor-pointer"
                      onClick={() => {
                        setFrom(airport.iata + ", " + airport.city);
                        setAirportSuggestions([]);
                      }}
                    >
                      <div className="text-sm font-medium text-gray-800">
                        {airport.name} ({airport.iata})
                      </div>
                      <div className="text-xs text-gray-500">
                        {airport.city}, {airport.country}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Swap Button */}
          <div className="lg:col-span-1 flex justify-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSwapLocations}
              className="p-2 rounded-full border-2 border-pink-200 hover:border-pink-500 hover:bg-pink-50 transition-all duration-200"
            >
              <ArrowLeftRight className="h-4 w-4 text-pink-500" />
            </Button>
          </div>          {/* To Input */}
          <div className="lg:col-span-3 relative overflow-visible">
            <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <PlaneLanding className="h-4 w-4 text-pink-500" />
              To
            </Label>
            <div className="relative">
              <input
                onFocus={()=>{setToAirportSuggestions([])}}
                type="text"
                value={to}
                onChange={(e) => getToAirportLocation(e)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-sm"
                placeholder="Destination city"
              />
              <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
               
              {(toAirportSuggestions.length > 0 && to) && (
                <div className="absolute top-full left-0 w-full z-[9999] bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-32 overflow-y-auto">
                  {toAirportSuggestions.map((airport, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-pink-50 cursor-pointer"
                      onClick={() => {
                        setTo(airport.iata + ", " + airport.city);
                        setToAirportSuggestions([]);
                      }}
                    >
                      <div className="text-sm font-medium text-gray-800">
                        {airport.name} ({airport.iata})
                      </div>
                      <div className="text-xs text-gray-500">
                        {airport.city}, {airport.country}
                      </div>
                    </div>
                  ))}
                </div>
              )}            </div>
          </div>

          {/* Depart Date */}
          <div className="lg:col-span-2">
            <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <CalendarDays className="h-4 w-4 text-pink-500" />
              Depart
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal px-4 py-3 h-auto",
                    !departDate && "text-muted-foreground"
                  )}
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {departDate
                    ? format(departDate, "MMM dd, yyyy")
                    : "Select date"}
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

          {/* Return Date */}
          {flightType === "round-trip" && (
            <div className="lg:col-span-2">
              <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <CalendarDays className="h-4 w-4 text-pink-500" />
                Return
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal px-4 py-3 h-auto",
                      !returnDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {returnDate
                      ? format(returnDate, "MMM dd, yyyy")
                      : "Select date"}
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

          {/* Travelers & Class */}
          <div
            className={cn(
              "lg:col-span-2",
              flightType !== "round-trip" && "lg:col-span-4"
            )}
          >
            <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Users className="h-4 w-4 text-pink-500" />
              Travelers & Class
            </Label>
            <select
              value={travelers}
              onChange={(e) => setTravelers(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-sm"
            >
              <option value="1 adult, Economy">1 Adult, Economy</option>
              <option value="1 adult, Business">1 Adult, Business</option>
              <option value="1 adult, First">1 Adult, First Class</option>
              <option value="2 adults, Economy">2 Adults, Economy</option>
              <option value="2 adults, Business">2 Adults, Business</option>
              <option value="2 adults, First">2 Adults, First Class</option>
              <option value="3 adults, Economy">3 Adults, Economy</option>
              <option value="3 adults, Business">3 Adults, Business</option>
              <option value="4 adults, Economy">4 Adults, Economy</option>
            </select>
          </div>

          <Button className="cursor-pointer bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white h-auto font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 w-fit "
           onClick={handleSearch}>
            <Search className="h-5 w-5 mr-2" />
            Search
          </Button>
        </div>
      </div>

      {/* Quick Search Options */}
      {/* <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Popular destinations from your location
          </div>
          <div className="flex gap-2 flex-wrap">
            {["New York", "London", "Tokyo", "Paris", "Dubai"].map((city) => (
              <button
                key={city}
                onClick={() => setTo(city)}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-pink-100 hover:text-pink-600 rounded-full transition-colors duration-200"
              >
                {city}
              </button>
            ))}
          </div>{" "}
        </div>
      </div> */}
    </div>
  );
}
