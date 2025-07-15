"use client";
import { Label } from "@/components/ui/label";
import { MapPin, Calendar, Users, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Mock location suggestions function (similar to select-vehicle)
const getLocationSuggestions = async (query: string): Promise<string[]> => {
  // Simulate API call with common cities
  const cities = [
    "New York, NY",
    "Los Angeles, CA",
    "Chicago, IL",
    "Houston, TX",
    "Phoenix, AZ",
    "Philadelphia, PA",
    "San Antonio, TX",
    "San Diego, CA",
    "Dallas, TX",
    "San Jose, CA",
    "Austin, TX",
    "Jacksonville, FL",
    "Fort Worth, TX",
    "Columbus, OH",
    "Charlotte, NC",
    "San Francisco, CA",
    "Indianapolis, IN",
    "Seattle, WA",
    "Denver, CO",
    "Washington, DC",
    "Boston, MA",
    "El Paso, TX",
    "Nashville, TN",
    "Detroit, MI",
    "Oklahoma City, OK",
    "Portland, OR",
    "Las Vegas, NV",
    "Memphis, TN",
    "Louisville, KY",
    "Baltimore, MD",
    "Milwaukee, WI",
    "Albuquerque, NM",
    "Tucson, AZ",
    "Fresno, CA",
    "Mesa, AZ",
    "Sacramento, CA",
    "Atlanta, GA",
    "Kansas City, MO",
    "Colorado Springs, CO",
    "Omaha, NE",
    "Raleigh, NC",
    "Miami, FL",
    "Long Beach, CA",
    "Virginia Beach, VA",
    "Oakland, CA",
    "Minneapolis, MN",
    "Tulsa, OK",
    "Tampa, FL",
    "Arlington, TX",
    "New Orleans, LA",
  ];

  return cities
    .filter((city) => city.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 5);
};

export function SelectHotel() {
  const [city, setCity] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState<number>(1);
  const [rooms, setRooms] = useState<number>(1);

  // City suggestions state
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [isCityFocused, setIsCityFocused] = useState(false);
  const cityRef = useRef<HTMLDivElement>(null);

  // Error states
  const [cityError, setCityError] = useState({ message: "", isError: false });
  const [startDateError, setStartDateError] = useState({
    message: "",
    isError: false,
  });
  const [endDateError, setEndDateError] = useState({
    message: "",
    isError: false,
  });

  const [counts, setCounts] = useState({ guests: 1, rooms: 1 });
  const inc = (key: "guests" | "rooms") =>
      setCounts((c) => ({ ...c, [key]: c[key] + 1 }));
  const dec = (key: "guests" | "rooms") =>
    setCounts((c) => ({ ...c, [key]: Math.max(0, c[key] - 1) }));

  const router = useRouter();

  // Effect for city suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (city.length > 1) {
        const suggestions = await getLocationSuggestions(city);
        setCitySuggestions(suggestions);
      } else {
        setCitySuggestions([]);
      }
    };

    fetchSuggestions();
  }, [city]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) {
        setIsCityFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClick = () => {
    // Get today's date for validation
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison

    // Validation
    if (!city.trim()) {
      setCityError({ message: "Please enter a destination", isError: true });
      return;
    }

    if (!startDate) {
      setStartDateError({
        message: "Please select a check-in date",
        isError: true,
      });
      return;
    }

    if (!endDate) {
      setEndDateError({
        message: "Please select a check-out date",
        isError: true,
      });
      return;
    }

    // Check if check-in date is in the past
    if (startDate && new Date(startDate) < today) {
      setStartDateError({
        message: "Check-in date cannot be in the past",
        isError: true,
      });
      return;
    }

    // Check if check-out date is in the past
    if (endDate && new Date(endDate) < today) {
      setEndDateError({
        message: "Check-out date cannot be in the past",
        isError: true,
      });
      return;
    }

    // Check if check-out date is after check-in date
    if (endDate && new Date(endDate) <= new Date(startDate)) {
      setEndDateError({
        message: "Check-out date must be after check-in date",
        isError: true,
      });
      return;
    }

    const params = new URLSearchParams({
      city,
      startDate: startDate ? startDate.toISOString().split("T")[0] : "",
      endDate: endDate ? endDate.toISOString().split("T")[0] : "",
      guests: `${counts.guests} Guest${counts.guests > 1 ? "s" : ""}`,
      rooms: `${counts.rooms} Room${counts.rooms > 1 ? "s" : ""}`
      
    });
    router.push(`/hotel-search?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Find Your Perfect Hotel
        </h2>
        <p className="text-gray-600">Search hotels for your next adventure</p>
      </div>

      <div className="flex flex-wrap items-end gap-6">
        {/* Destination */}
        <div className="flex flex-col gap-2" ref={cityRef}>
          <Label
            htmlFor="destination"
            className="flex items-center text-sm font-medium text-gray-700"
          >
            <MapPin className="mr-2 h-4 w-4 text-pink-500" />
            Destination
          </Label>
          <div className="relative">
            <TooltipProvider>
              <Tooltip open={cityError.isError}>
                <TooltipTrigger asChild>
                  <input
                    type="text"
                    id="destination"
                    placeholder="Where are you going?"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onFocus={() => {
                      setIsCityFocused(true);
                      setCityError({ message: "", isError: false });
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-sm text-red-500">{cityError.message}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {isCityFocused && citySuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {citySuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setCity(suggestion);
                      setIsCityFocused(false);
                    }}
                  >
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4 text-pink-500" />
                      {suggestion}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Check-in Date */}
        <div role="group"className="flex flex-col gap-2">
          <Label
            htmlFor="checkin"
            className="flex items-center text-sm font-medium text-gray-700"
          >
            <Calendar className="mr-2 h-4 w-4 text-pink-500" />
            Check-in
          </Label>
          <TooltipProvider>
            <Tooltip open={startDateError.isError}>
              <TooltipTrigger asChild>
                <div className="relative">
                  <input
                    type="date"
                    id="checkin"
                    value={
                      startDate ? startDate.toISOString().split("T")[0] : ""
                    }
                    onChange={(e) => {
                      setStartDate(
                        e.target.value ? new Date(e.target.value) : null
                      );
                      setStartDateError({ message: "", isError: false });
                    }}
                    onFocus={() => {
                      setStartDateError({ message: "", isError: false });
                    }}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white hover:border-pink-300 transition-colors cursor-pointer text-gray-700"
                    style={{
                      colorScheme: "light",
                    }}
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-sm text-red-500">{startDateError.message}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Check-out Date */}
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="checkout"
            className="flex items-center text-sm font-medium text-gray-700"
          >
            <Calendar className="mr-2 h-4 w-4 text-pink-500" />
            Check-out
          </Label>
          <TooltipProvider>
            <Tooltip open={endDateError.isError}>
              <TooltipTrigger asChild>
                <div className="relative">
                  <input
                    type="date"
                    id="checkout"
                    value={endDate ? endDate.toISOString().split("T")[0] : ""}
                    onChange={(e) => {
                      setEndDate(
                        e.target.value ? new Date(e.target.value) : null
                      );
                      setEndDateError({ message: "", isError: false });
                    }}
                    onFocus={() => {
                      setEndDateError({ message: "", isError: false });
                    }}
                    min={
                      startDate
                        ? startDate.toISOString().split("T")[0]
                        : new Date().toISOString().split("T")[0]
                    }
                    className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white hover:border-pink-300 transition-colors cursor-pointer text-gray-700"
                    style={{
                      colorScheme: "light",
                    }}
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-sm text-red-500">{endDateError.message}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Guests */}
        <div
        id="guests-count"
    data-testid="guests-count"
    role="group"
    className="flex flex-col"
  >
    <Label 
    htmlFor="guests-count"
    className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
      <Users className="h-4 w-4 text-pink-500" /> Guests
    </Label>

    <div className="flex items-center h-12 space-x-4">
      <button
        type="button"
        data-testid="guests-decrement"
        disabled={counts.guests <= 1}
        onClick={() => dec("guests")}
        className="h-full w-12 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100"
        aria-label="Decrease guests count"
      >−</button>

      <span
        data-testid="guests-count"
        className="flex-1 text-center text-sm"
      >{counts.guests}</span>

      <button
        type="button"
        data-testid="guests-increment"
        onClick={() => inc("guests")}
        className="h-full w-12 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100"
        aria-label="Increase guests count"
      >+</button>
    </div>
  </div>
{/* Rooms */}
  <div
  id="rooms"
    data-testid="rooms"
    role="group"
    className="flex flex-col"
  >
    <Label 
    htmlFor="rooms"
    className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
      <Building2 className="h-4 w-4 text-pink-500" /> Rooms
    </Label>

    <div className="flex items-center h-12 space-x-4">
      <button
        type="button"
        data-testid="rooms-decrement"
        disabled={counts.rooms <= 1}
        onClick={() => dec("rooms")}
        className="h-full w-12 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100"
        aria-label="Decrease rooms count"
      >−</button>

      <span
        data-testid="rooms-count"
        className="flex-1 text-center text-sm"
      >{counts.rooms}</span>

      <button
        type="button"
        data-testid="rooms-increment"
        onClick={() => inc("rooms")}
        className="h-full w-12 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100"
        aria-label="Increase rooms count"
      >+</button>
    </div>
  </div>
</div>

      {/* Hotel Preferences */}
      {/* <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hotel Preferences</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"> */}
      {/* Budget */}
      {/* <div className="border border-gray-200 rounded-lg p-4 hover:border-pink-500 hover:shadow-md transition-all cursor-pointer">
                        <div className="text-center">
                            <div className="text-2xl mb-2">💰</div>
                            <h4 className="font-semibold text-gray-900">Budget</h4>
                            <p className="text-sm text-gray-600 mb-2">Economy hotels</p>
                            <p className="text-lg font-bold text-pink-500">$30-60/night</p>
                        </div>
                    </div> */}

      {/* Mid-Range */}
      {/* <div className="border border-gray-200 rounded-lg p-4 hover:border-pink-500 hover:shadow-md transition-all cursor-pointer">
                        <div className="text-center">
                            <div className="text-2xl mb-2">🏨</div>
                            <h4 className="font-semibold text-gray-900">Mid-Range</h4>
                            <p className="text-sm text-gray-600 mb-2">Comfort & amenities</p>
                            <p className="text-lg font-bold text-pink-500">$60-120/night</p>
                        </div>
                    </div> */}

      {/* Luxury */}
      {/* <div className="border border-gray-200 rounded-lg p-4 hover:border-pink-500 hover:shadow-md transition-all cursor-pointer">
                        <div className="text-center">
                            <div className="text-2xl mb-2">✨</div>
                            <h4 className="font-semibold text-gray-900">Luxury</h4>
                            <p className="text-sm text-gray-600 mb-2">Premium experience</p>
                            <p className="text-lg font-bold text-pink-500">$120-300/night</p>
                        </div>
                    </div> */}

      {/* Resort */}
      {/* <div className="border border-gray-200 rounded-lg p-4 hover:border-pink-500 hover:shadow-md transition-all cursor-pointer">
                        <div className="text-center">
                            <div className="text-2xl mb-2">🏖️</div>
                            <h4 className="font-semibold text-gray-900">Resort</h4>
                            <p className="text-sm text-gray-600 mb-2">All-inclusive</p>
                            <p className="text-lg font-bold text-pink-500">$200+/night</p>
                        </div>
                    </div> */}
      {/* </div>
            </div> */}

      {/* Additional Filters */}
      {/* <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-pink-500 focus:ring-pink-500" />
                        <span className="text-sm text-gray-700">WiFi</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-pink-500 focus:ring-pink-500" />
                        <span className="text-sm text-gray-700">Pool</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-pink-500 focus:ring-pink-500" />
                        <span className="text-sm text-gray-700">Gym</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-pink-500 focus:ring-pink-500" />
                        <span className="text-sm text-gray-700">Spa</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-pink-500 focus:ring-pink-500" />
                        <span className="text-sm text-gray-700">Parking</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-pink-500 focus:ring-pink-500" />
                        <span className="text-sm text-gray-700">Restaurant</span>
                    </label>
                </div>
            </div> */}

      {/* Search Button */}
      <div 
      id="search-hotels-button"
      className="flex justify-center mt-6">
        <button
        id="search-hotels-button"
          className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-8 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
          onClick={() => {
            handleClick();
          }}
        >
          Search Hotels
        </button>
      </div>
    </div>
  );
}
