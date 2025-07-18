"use client";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Building2, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { apiHelpers, API_ENDPOINTS } from '../../lib/api-config';
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
  const [dateRange, setDateRange] = useState<{start: Date | null, end: Date | null}>({start: null, end: null});

  // City suggestions state
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const cityRef = useRef<HTMLDivElement>(null);

  // Error states
  const [cityError, setCityError] = useState({ message: "", isError: false });
  const [checkInDateError, setCheckInDateError] = useState({
    message: "",
    isError: false,
  });
  const [checkOutDateError, setCheckOutDateError] = useState({
    message: "",
    isError: false,
  });

  const [counts, setCounts] = useState({ guests: 1, rooms: 1 });
  const inc = (key: "guests" | "rooms") =>
      setCounts((c) => ({ ...c, [key]: c[key] + 1 }));
  const dec = (key: "guests" | "rooms") =>
    setCounts((c) => ({ ...c, [key]: Math.max(1, c[key] - 1) }));

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
        setCitySuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    // Validation
    if (!city.trim()) {
      setCityError({ message: "Please enter a destination", isError: true });
      return;
    }

    if (!dateRange.start) {
      setCheckInDateError({
        message: "Please select a check-in date",
        isError: true,
      });
      return;
    }

    if (!dateRange.end) {
      setCheckOutDateError({
        message: "Please select a check-out date",
        isError: true,
      });
      return;
    }

    if (dateRange.end <= dateRange.start) {
      setCheckOutDateError({
        message: "Check-out date must be after check-in date",
        isError: true,
      });
      return;
    }

    const params = new URLSearchParams({
      city,
      checkIn: dateRange.start.toISOString().split("T")[0],
      checkOut: dateRange.end.toISOString().split("T")[0],
      guests: `${counts.guests} Guest${counts.guests > 1 ? "s" : ""}`,
      rooms: `${counts.rooms} Room${counts.rooms > 1 ? "s" : ""}`
    });
    router.push(`/hotel-search?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-white dark:bg-[rgb(25,30,36)] transition-all duration-300 p-0 sm:p-6">
      {/* Header */}
      <div className="text-center px-4 sm:px-0">
        <h2 className="text-2xl sm:text-3xl font-bold text-brand-gray-900 dark:text-white">
          Find Your Perfect Hotel
        </h2>
        <p className="text-brand-gray-600 dark:text-brand-gray-300">Search hotels for your next adventure</p>
      </div>

      {/* Main Search Form - Horizontal Layout */}
      <div className=" rounded-xl p-2 sm:p-6 mx-2 sm:mx-0  transition-all duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          
          {/* Destination */}
          <div className="lg:col-span-4 relative" ref={cityRef}>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                <MapPin className="h-4 w-4 text-pink-500" />
              </div>
              <input
                type="text"
                value={city}
                onFocus={() => {
                  setCitySuggestions([]);
                  setCityError({ isError: false, message: "" });
                }}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Where are you going?"
                className="w-full pl-10 pr-4 py-1 border-2 border-brand-gray-200 dark:border-brand-gray-600 bg-white dark:bg-[rgb(25,30,36)] rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm font-medium shadow-sm hover:shadow-md dark:hover:shadow-brand-dark transition-all duration-200 dark:text-white"
              />
              {cityError.isError && (
                <p className="text-xs text-brand-error mt-1">{cityError.message}</p>
              )}
            </div>
            {citySuggestions.length > 0 && city && (
              <div className="absolute top-full left-0 w-full bg-white dark:bg-[rgb(25,30,36)] border border-brand-gray-200 dark:border-brand-gray-600 rounded-lg shadow-xl dark:shadow-brand-dark-lg mt-1 max-h-48 overflow-y-auto z-50">
                {citySuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 hover:bg-pink-50 dark:hover:bg-[rgb(35,42,49)] cursor-pointer border-b border-gray-100 dark:border-brand-gray-600 last:border-0 dark:text-white"
                    onClick={() => {
                      setCity(suggestion);
                      setCitySuggestions([]);
                    }}
                  >
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-pink-500 mr-2" />
                      <span className="text-sm font-medium">{suggestion}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Check-in and Check-out Date Inputs */}
          <div className="lg:col-span-4 flex gap-4">
            <div className="relative flex-1 min-w-[120px] transition-all duration-500">
              {!dateRange.start && (
                <span className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 pointer-events-none text-xs">
                  Check-in date
                </span>
              )}
              <input
                type="date"
                value={dateRange.start ? dateRange.start.toISOString().split("T")[0] : ""}
                onChange={(e) => {
                  const selectedDate = new Date(e.target.value);
                  if (isNaN(selectedDate.getTime())) {
                    setCheckInDateError({
                      isError: true,
                      message: "Invalid date",
                    });
                  } else {
                    setDateRange(prev => ({ ...prev, start: selectedDate }));
                    setCheckInDateError({ isError: false, message: "" });
                    // Reset check-out if before check-in
                    if (dateRange.end && selectedDate >= dateRange.end) {
                      setDateRange(prev => ({ ...prev, end: null }));
                      setCheckOutDateError({ isError: false, message: "" });
                    }
                  }
                }}
                min={new Date().toISOString().split("T")[0]}
                className={`w-full border border-brand-gray-200 dark:border-brand-gray-600 bg-white dark:bg-[rgb(25,30,36)] rounded-md py-2 px-3 text-xs font-medium shadow-sm hover:shadow-md dark:hover:shadow-brand-dark transition-all duration-200 focus:ring-2 focus:ring-brand-pink-500 focus:border-brand-pink-500 ${
                  !dateRange.start ? "text-transparent" : "text-black dark:text-white"
                } transition-all duration-500`}
              />
              {checkInDateError.isError && (
                <p className="text-xs text-brand-error mt-1">
                  {checkInDateError.message}
                </p>
              )}
            </div>
            <div className="relative flex-1 min-w-[120px] transition-all duration-500">
              {!dateRange.end && (
                <span className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 pointer-events-none text-xs">
                  Check-out date
                </span>
              )}
              <input
                type="date"
                value={dateRange.end ? dateRange.end.toISOString().split("T")[0] : ""}
                onChange={(e) => {
                  const selectedDate = new Date(e.target.value);
                  if (isNaN(selectedDate.getTime())) {
                    setCheckOutDateError({
                      isError: true,
                      message: "Invalid date",
                    });
                  } else if (dateRange.start && selectedDate <= dateRange.start) {
                    setCheckOutDateError({
                      isError: true,
                      message: "Check-out must be after check-in.",
                    });
                  } else {
                    setDateRange(prev => ({ ...prev, end: selectedDate }));
                    setCheckOutDateError({ isError: false, message: "" });
                  }
                }}
                min={dateRange.start ? dateRange.start.toISOString().split("T")[0] : new Date().toISOString().split("T")[0]}
                className={`w-full border border-brand-gray-200 dark:border-brand-gray-600 bg-white dark:bg-[rgb(25,30,36)] rounded-md py-2 px-3 text-xs font-medium shadow-sm hover:shadow-md dark:hover:shadow-brand-dark transition-all duration-200 focus:ring-2 focus:ring-brand-pink-500 focus:border-brand-pink-500 ${
                  !dateRange.end ? "text-transparent" : "text-black dark:text-white"
                } transition-all duration-500`}
              />
              {checkOutDateError.isError && (
                <p className="text-xs text-brand-error mt-1">
                  {checkOutDateError.message}
                </p>
              )}
            </div>
          </div>

          {/* Search Button - Desktop Only */}
          <div className="hidden lg:block lg:col-span-4">
            <Button
              onClick={handleSearch}
              className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-4 rounded-lg shadow-lg hover:shadow-xl dark:hover:shadow-brand-dark-xl transition-all"
            >
              <Search className="h-4 w-4 mr-2" />
              Search Hotels
            </Button>
          </div>

        </div>
      </div>

      {/* Guests & Rooms Selection */}
      <div className="flex flex-wrap justify-center gap-4 px-4 sm:px-0">
        {/* Guests */}
        <div className="flex items-center rounded-lg px-4 py-2 ">
          <Users className="h-4 w-4 text-pink-500 mr-2" />
          <span className="text-sm font-medium mr-3 dark:text-white">Guests:</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => dec("guests")}
              disabled={counts.guests <= 1}
              className="w-6 h-6 rounded-full bg-white dark:bg-[rgb(25,30,36)] border border-brand-gray-300 dark:border-brand-gray-600 flex items-center justify-center text-xs hover:bg-brand-gray-100 dark:hover:bg-[rgb(35,42,49)] disabled:opacity-50 dark:text-white transition-colors"
            >
              −
            </button>
            <span className="text-sm font-medium px-2 dark:text-white">{counts.guests}</span>
            <button
              onClick={() => inc("guests")}
              className="w-6 h-6 rounded-full bg-white dark:bg-[rgb(25,30,36)] border border-brand-gray-300 dark:border-brand-gray-600 flex items-center justify-center text-xs hover:bg-brand-gray-100 dark:hover:bg-[rgb(35,42,49)] dark:text-white transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Rooms */}
        <div className="flex items-center rounded-lg px-4 py-2 ">
          <Building2 className="h-4 w-4 text-pink-500 mr-2" />
          <span className="text-sm font-medium mr-3 dark:text-white">Rooms:</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => dec("rooms")}
              disabled={counts.rooms <= 1}
              className="w-6 h-6 rounded-full bg-white dark:bg-[rgb(25,30,36)] border border-brand-gray-300 dark:border-brand-gray-600 flex items-center justify-center text-xs hover:bg-brand-gray-100 dark:hover:bg-[rgb(35,42,49)] disabled:opacity-50 dark:text-white transition-colors"
            >
              −
            </button>
            <span className="text-sm font-medium px-2 dark:text-white">{counts.rooms}</span>
            <button
              onClick={() => inc("rooms")}
              className="w-6 h-6 rounded-full bg-white dark:bg-[rgb(25,30,36)] border border-brand-gray-300 dark:border-brand-gray-600 flex items-center justify-center text-xs hover:bg-brand-gray-100 dark:hover:bg-[rgb(35,42,49)] dark:text-white transition-colors"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Search Button - Mobile Only */}
      <div className="lg:hidden px-4 sm:px-0 flex justify-center">
        <Button
          onClick={handleSearch}
          className="w-full max-w-sm bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-4 rounded-lg shadow-lg hover:shadow-xl dark:hover:shadow-brand-dark-xl transition-all"
        >
          <Search className="h-4 w-4 mr-2" />
          Search Hotels
        </Button>
      </div>
    </div>
  );
}


