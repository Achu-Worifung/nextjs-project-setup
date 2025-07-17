"use client";

import { useState, useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MapPin, Calendar as CalendarIcon, Search, ArrowLeftRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  mockAvailableCars,
  getLocationSuggestions,
  carTypes,
  type CarData,
} from "@/fake-data/car-rental-data";

export function SelectVehicle() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState("All");
  const [dateRange, setDateRange] = useState<{start: Date | null, end: Date | null}>({start: null, end: null});

  // Location state
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [pickupSuggestions, setPickupSuggestions] = useState<string[]>([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState<string[]>([]);

  const pickupRef = useRef<HTMLDivElement>(null);
  const dropoffRef = useRef<HTMLDivElement>(null);

  // Error states
  const [pickupError, setPickupError] = useState({
    message: "",
    isError: false,
  });
  const [dropoffError, setDropoffError] = useState({
    message: "",
    isError: false,
  });
  const [dateError, setDateError] = useState({
    message: "",
    isError: false,
  });

  // Filter states
  const [minSeats, setMinSeats] = useState(2);
  const [maxPrice, setMaxPrice] = useState(100);

  const handleSearch = () => {
    // Validation
    if (!pickupLocation.trim()) {
      setPickupError({
        message: "Please enter a pickup location",
        isError: true,
      });
      return;
    }

    if (!dropoffLocation.trim()) {
      setDropoffError({
        message: "Please enter a dropoff location",
        isError: true,
      });
      return;
    }

    if (!dateRange.start) {
      setDateError({
        message: "Please select a pickup date",
        isError: true,
      });
      return;
    }

    if (!dateRange.end) {
      setDateError({
        message: "Please select a dropoff date",
        isError: true,
      });
      return;
    }

    if (dateRange.end <= dateRange.start) {
      setDateError({
        message: "Dropoff date must be after pickup date",
        isError: true,
      });
      return;
    }

    const params = new URLSearchParams({
      pickup: pickupLocation,
      dropoff: dropoffLocation,
      pickupDate: dateRange.start.toISOString().split("T")[0],
      dropoffDate: dateRange.end.toISOString().split("T")[0],
      minSeats: minSeats.toString(),
      maxPrice: maxPrice.toString(),
      vehicleType: selectedType,
    });
    router.push(`/car-search-results?${params.toString()}`);
  };

  // Swap locations
  const handleSwap = () => {
    setPickupLocation(dropoffLocation);
    setDropoffLocation(pickupLocation);
  };

  // Effect for pickup location suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (pickupLocation.length > 1) {
        const suggestions = await getLocationSuggestions(pickupLocation);
        setPickupSuggestions(suggestions);
      } else {
        setPickupSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [pickupLocation]);

  // Effect for dropoff location suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (dropoffLocation.length > 1) {
        const suggestions = await getLocationSuggestions(dropoffLocation);
        setDropoffSuggestions(suggestions);
      } else {
        setDropoffSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [dropoffLocation]);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickupRef.current && !pickupRef.current.contains(event.target as Node)) {
        setPickupSuggestions([]);
      }
      if (dropoffRef.current && !dropoffRef.current.contains(event.target as Node)) {
        setDropoffSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto bg-white dark:bg-[rgb(25,30,36)]  transition-all duration-300 p-0 sm:p-6">
      {/* Header */}
      <div className="text-center px-4 sm:px-0">
        <h2 className="text-2xl sm:text-3xl font-bold text-brand-gray-900 dark:text-white">
          Book Your Ride
        </h2>
        <p className="text-brand-gray-600 dark:text-brand-gray-300">Select your pickup and dropoff details</p>
      </div>

      {/* Vehicle Type Selector */}
      <div className="flex justify-center px-4 sm:px-0">
        <div className="inline-flex bg-brand-gray-100 dark:bg-[rgb(35,42,49)] rounded-lg p-1 overflow-x-auto shadow-sm dark:shadow-brand-dark">
          {carTypes.slice(0, 4).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={cn(
                "px-3 py-2 text-xs font-medium rounded-md transition-all whitespace-nowrap",
                selectedType === type
                  ? "bg-white dark:bg-[rgb(25,30,36)] text-pink-600 dark:text-pink-400 shadow-sm dark:shadow-brand-dark"
                  : "text-brand-gray-600 dark:text-brand-gray-300 hover:text-brand-gray-900 dark:hover:text-white"
              )}
            >
              {type === "All" ? "All Types" : type}
            </button>
          ))}
        </div>
      </div>

      {/* Main Search Form - Horizontal Layout */}
      <div className=" rounded-xl p-2 sm:p-6 mx-2 sm:mx-0  transition-all duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          
          {/* Pickup Location */}
          <div className="lg:col-span-3 relative" ref={pickupRef}>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                <MapPin className="h-4 w-4 text-pink-500" />
              </div>
              <input
                type="text"
                value={pickupLocation}
                onFocus={() => {
                  setPickupSuggestions([]);
                  setPickupError({ isError: false, message: "" });
                }}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="Pickup location"
                className="w-full pl-10 pr-4 py-3 border-2 border-brand-gray-200 dark:border-brand-gray-600 bg-white dark:bg-[rgb(25,30,36)] rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm font-medium shadow-sm hover:shadow-md dark:hover:shadow-brand-dark transition-all duration-200 dark:text-white dark:placeholder-brand-gray-400"
              />
              {pickupError.isError && (
                <p className="text-xs text-brand-error mt-1">{pickupError.message}</p>
              )}
            </div>
            {pickupSuggestions.length > 0 && pickupLocation && (
              <div className="absolute top-full left-0 w-full bg-white dark:bg-[rgb(25,30,36)] border border-brand-gray-200 dark:border-brand-gray-600 rounded-lg shadow-xl dark:shadow-brand-dark-lg mt-1 max-h-48 overflow-y-auto z-50">
                {pickupSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 hover:bg-pink-50 dark:hover:bg-[rgb(35,42,49)] cursor-pointer border-b border-gray-100 dark:border-brand-gray-600 last:border-0 dark:text-white"
                    onClick={() => {
                      setPickupLocation(suggestion);
                      setPickupSuggestions([]);
                    }}
                  >
                    <div className="text-sm font-semibold text-brand-gray-900">
                      {suggestion}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Swap Button */}
          <div className="lg:col-span-1 flex justify-center">
            <button
              onClick={handleSwap}
              className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105 border border-brand-gray-200"
            >
              <ArrowLeftRight className="h-4 w-4 text-pink-500" />
            </button>
          </div>

          {/* Dropoff Location */}
          <div className="lg:col-span-3 relative" ref={dropoffRef}>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                <MapPin className="h-4 w-4 text-pink-500" />
              </div>
              <input
                type="text"
                value={dropoffLocation}
                onFocus={() => {
                  setDropoffSuggestions([]);
                  setDropoffError({ isError: false, message: "" });
                }}
                onChange={(e) => setDropoffLocation(e.target.value)}
                placeholder="Dropoff location"
                className="w-full pl-10 pr-4 py-3 border-2 border-brand-gray-200 dark:border-brand-gray-600 bg-white dark:bg-[rgb(25,30,36)] rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm font-medium shadow-sm hover:shadow-md dark:hover:shadow-brand-dark transition-all duration-200 dark:text-white dark:placeholder-brand-gray-400"
              />
              {dropoffError.isError && (
                <p className="text-xs text-brand-error mt-1">{dropoffError.message}</p>
              )}
            </div>
            {dropoffSuggestions.length > 0 && dropoffLocation && (
              <div className="absolute top-full left-0 w-full bg-white dark:bg-[rgb(25,30,36)] border border-brand-gray-200 dark:border-brand-gray-600 rounded-lg shadow-xl dark:shadow-brand-dark-lg mt-1 max-h-48 overflow-y-auto z-50">
                {dropoffSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 hover:bg-pink-50 dark:hover:bg-[rgb(35,42,49)] cursor-pointer border-b border-gray-100 dark:border-brand-gray-600 last:border-0 dark:text-white"
                    onClick={() => {
                      setDropoffLocation(suggestion);
                      setDropoffSuggestions([]);
                    }}
                  >
                    <div className="text-sm font-semibold text-brand-gray-900">
                      {suggestion}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Date Range */}
          <div className="lg:col-span-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-medium text-sm py-4 px-4 bg-white dark:bg-[rgb(25,30,36)] border-2 border-brand-gray-200 dark:border-brand-gray-600 rounded-lg shadow-sm hover:shadow-md dark:hover:shadow-brand-dark transition-all duration-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 dark:text-white",
                    !dateRange.start && "text-muted-foreground dark:text-brand-gray-400"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-pink-500" />
                  {dateRange.start && dateRange.end
                    ? `${format(dateRange.start, "MMM dd")} - ${format(dateRange.end, "MMM dd")}`
                    : dateRange.start
                    ? `${format(dateRange.start, "MMM dd")} - Return date`
                    : "Select rental period"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white dark:bg-[rgb(25,30,36)] border border-brand-gray-200 dark:border-brand-gray-600 shadow-xl dark:shadow-brand-dark-lg" align="start">
                <div className="p-4">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block dark:text-white">Pickup Date</Label>
                      <Calendar
                        mode="single"
                        selected={dateRange.start || undefined}
                        onSelect={(date) => {
                          setDateRange(prev => ({ ...prev, start: date || null }));
                          setDateError({ isError: false, message: "" });
                        }}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="dark:text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block dark:text-white">Dropoff Date</Label>
                      <Calendar
                        mode="single"
                        selected={dateRange.end || undefined}
                        onSelect={(date) => {
                          setDateRange(prev => ({ ...prev, end: date || null }));
                          setDateError({ isError: false, message: "" });
                        }}
                        disabled={(date) =>
                          date < (dateRange.start || new Date())
                        }
                        className="dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            {dateError.isError && (
              <p className="text-xs text-brand-error mt-1">{dateError.message}</p>
            )}
          </div>

          {/* Search Button - Desktop Only */}
          <div className="hidden lg:block lg:col-span-2">
            <Button
              onClick={handleSearch}
              className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-4 rounded-lg shadow-lg hover:shadow-xl dark:hover:shadow-brand-dark-xl transition-all"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap justify-center gap-4 px-4 sm:px-0">
        {/* Min Seats */}
        <div className="flex items-center rounded-lg px-4 py-2 ">
          <span className="text-sm font-medium mr-3 text-brand-gray-700 dark:text-brand-gray-300">Min Seats:</span>
          <div className="relative">
            <select
              value={minSeats}
              onChange={(e) => setMinSeats(parseInt(e.target.value))}
              className="bg-white dark:bg-[rgb(25,30,36)] border border-brand-gray-200 dark:border-brand-gray-600 rounded-md px-3 py-1.5 text-sm font-medium text-pink-600 dark:text-pink-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none appearance-none pr-8 min-w-[80px]"
            >
              <option value={1}>1+</option>
              <option value={2}>2+</option>
              <option value={4}>4+</option>
              <option value={6}>6+</option>
              <option value={8}>8+</option>
            </select>
            {/* Custom dropdown arrow */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Max Price */}
        <div className="flex items-center rounded-lg px-4 py-2 ">
          <span className="text-sm font-medium mr-3 text-brand-gray-700 dark:text-brand-gray-300">Max Price:</span>
          <div className="relative">
            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="bg-white dark:bg-[rgb(25,30,36)] border border-brand-gray-200 dark:border-brand-gray-600 rounded-md px-3 py-1.5 text-sm font-medium text-pink-600 dark:text-pink-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none appearance-none pr-8 min-w-[100px]"
            >
              <option value={50}>$50/day</option>
              <option value={75}>$75/day</option>
              <option value={100}>$100/day</option>
              <option value={150}>$150/day</option>
              <option value={200}>$200/day</option>
              <option value={300}>$300/day</option>
            </select>
            {/* Custom dropdown arrow */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
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
          Search Vehicles
        </Button>
      </div>
    </div>
  );
}


