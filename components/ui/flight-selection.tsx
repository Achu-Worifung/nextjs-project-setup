"use client";

import React, {
  useState,
  useTransition,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import airports from "@/public/airports.json";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Search,
  Users,
  CalendarDays,
  PlaneTakeoff,
  PlaneLanding,
  ArrowLeftRight,
} from "lucide-react";

type Airport = {
  name: string;
  city: string;
  country: string;
  iata: string;
  icao: string;
};

export function FlightSelection() {
  const router = useRouter();

  // Use transition for non-blocking updates
  const [, startTransition] = useTransition();

  // Flight type
  const [flightType, setFlightType] = useState<"one-way" | "round-trip">(
    "round-trip"
  );

  // Single-leg inputs
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departDate, setDepartDate] = useState<Date | undefined>(undefined);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  // --------------------------------ERROR HANDLING WARNING---------------------------------------
  const [fromError, setFromError] = useState({ message: "", isError: false });
  const [toError, setToError] = useState({ message: "", isError: false });
  const [departDateError, setDepartDateError] = useState({
    message: "",
    isError: false,
  });
  const [returnDateError, setReturnDateError] = useState({
    message: "",
    isError: false,
  });
  // -----------------------------------------------------------------------------------------------
  // Passenger counts
  const [counts, setCounts] = useState({ adults: 1, children: 0 });
  const inc = (key: "adults" | "children") =>
    setCounts((c) => ({ ...c, [key]: c[key] + 1 }));
  const dec = (key: "adults" | "children") =>
    setCounts((c) => ({ ...c, [key]: Math.max(0, c[key] - 1) }));

  const [classType, setClassType] = useState("Economy");

  // Autocomplete suggestions
  const [airportSuggestions, setAirportSuggestions] = useState<Airport[]>([]);
  const [toAirportSuggestions, setToAirportSuggestions] = useState<Airport[]>(
    []
  );

  // Refs for click outside detection
  const fromDropdownRef = useRef<HTMLDivElement>(null);
  const toDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        fromDropdownRef.current &&
        !fromDropdownRef.current.contains(event.target as Node)
      ) {
        setAirportSuggestions([]);
      }
      if (
        toDropdownRef.current &&
        !toDropdownRef.current.contains(event.target as Node)
      ) {
        setToAirportSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Helper to score & find airports - optimized with memoization
  const findAirport = useMemo(() => {
    return (q: string): Airport[] => {
      if (q.length < 2) return []; // Don't search for very short queries

      const query = q.toLowerCase();
      const results = airports
        .map((a) => {
          let score = 0;
          // Exact matches first
          if (a.iata.toLowerCase() === query) score += 100;
          if (a.icao.toLowerCase() === query) score += 100;
          // Major airports ranking
          if (a.name.toLowerCase().includes("international")) score += 40;
          if (a.name.toLowerCase().includes("heathrow")) score += 50;
          // Major cities bonus
          const majorCities = [
            "london",
            "new york",
            "paris",
            "tokyo",
            "beijing",
            "dubai",
            "los angeles",
            "chicago",
            "hong kong",
            "frankfurt",
          ];
          if (majorCities.includes(a.city.toLowerCase())) score += 30;
          // Partial matches
          if (a.name.toLowerCase().includes(query)) score += 20;
          if (a.city.toLowerCase().includes(query)) score += 15;
          if (a.iata.toLowerCase().includes(query)) score += 15;
          if (a.icao.toLowerCase().includes(query)) score += 15;
          if (a.country.toLowerCase().includes(query)) score += 10;
          return { airport: a, score };
        })
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10) // Limit results to improve performance
        .map((x) => x.airport);

      return results;
    };
  }, []);

  // Single-leg handlers - optimized with transitions
  const onFromChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setFrom(v);

      // Clear suggestions immediately for empty input
      if (v.length === 0) {
        setAirportSuggestions([]);
        return;
      }

      // Use transition to prevent blocking the UI
      startTransition(() => {
        setAirportSuggestions(findAirport(v));
      });
    },
    [findAirport, startTransition]
  );

  const onToChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setTo(v);

      // Clear suggestions immediately for empty input
      if (v.length === 0) {
        setToAirportSuggestions([]);
        return;
      }

      // Use transition to prevent blocking the UI
      startTransition(() => {
        setToAirportSuggestions(findAirport(v));
      });
    },
    [findAirport, startTransition]
  );

  // Swap for single-leg
  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  // search
  const handleSearch = () => {
    // Validate inputs
    if (!from) {
      setFromError({
        isError: true,
        message: "Please enter a departure city.",
      });
      return;
    }
    if (airportSuggestions.length === 0) {
      setFromError({ isError: true, message: "Please enter a valid city." });
      return;
    }
    setFrom(airportSuggestions[0].city + ", " + airportSuggestions[0].iata);

    if (!to) {
      setToError({
        isError: true,
        message: "Please enter a destination city.",
      });
      return;
    }
    if (toAirportSuggestions.length === 0) {
      setToError({ isError: true, message: "Please enter a valid city." });
      return;
    }
    setTo(toAirportSuggestions[0].city + ", " + toAirportSuggestions[0].iata);

    // Validate dates based on flight type
    if (flightType === "round-trip") {
      if (!dateRange.start) {
        setDepartDateError({
          isError: true,
          message: "Please select a departure date.",
        });
        return;
      }
      if (!dateRange.end) {
        setReturnDateError({
          isError: true,
          message: "Please select a return date.",
        });
        return;
      }
      if (dateRange.end <= dateRange.start) {
        setReturnDateError({
          isError: true,
          message: "Return date must be after departure date.",
        });
        return;
      }
    } else {
      if (!departDate) {
        setDepartDateError({
          isError: true,
          message: "Please select a departure date.",
        });
        return;
      }
    }

    // Format the dates
    const ddate =
      flightType === "round-trip" && dateRange.start
        ? dateRange.start.toISOString().split("T")[0]
        : departDate
        ? departDate.toISOString().split("T")[0]
        : "";
    const rdate =
      flightType === "round-trip" && dateRange.end
        ? dateRange.end.toISOString().split("T")[0]
        : returnDate
        ? returnDate.toISOString().split("T")[0]
        : "";

    const params = new URLSearchParams({
      flightType,
      from,
      to,
      departDate: ddate,
      returnDate: rdate,
      travelers: `${counts.adults} Adult${counts.adults > 1 ? "s" : ""}`,
      classType,
    });
    router.push(`/flight-search?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-white dark:bg-[rgb(25,30,36)]   transition-all duration-300 p-0 sm:p-6">
      {/* Header */}
      <div className="text-center px-4 sm:px-0">
        <h2 className="text-2xl sm:text-3xl font-bold text-brand-gray-900 dark:text-white">
          Find Your Perfect Flight
        </h2>
        <p className="text-brand-gray-600 dark:text-brand-gray-300">
          Search and compare flights from hundreds of airlines
        </p>
      </div>

      {/* Flight Type Selector - Simplified */}
      <div className="flex justify-center px-4 sm:px-0">
        <div className="inline-flex bg-brand-gray-100 dark:bg-[rgb(35,42,49)] rounded-lg p-1 shadow-sm dark:shadow-brand-dark">
          {(["one-way", "round-trip"] as const).map((val) => (
            <button
              key={val}
              onClick={() => setFlightType(val)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
                flightType === val
                  ? "bg-white dark:bg-[rgb(25,30,36)] text-brand-pink-600 dark:text-brand-pink-400 shadow-sm dark:shadow-brand-dark"
                  : "text-brand-gray-600 dark:text-brand-gray-300 hover:text-brand-gray-900 dark:hover:text-white hover:bg-brand-gray-50 dark:hover:bg-[rgb(35,42,49)]"
              )}
            >
              {val === "one-way" ? "One Way" : "Round Trip"}
            </button>
          ))}
        </div>
      </div>

      {/* Main Search Form - Horizontal Layout */}
      <div className="rounded-xl p-2 sm:p-6 mx-2 sm:mx-0 transition-all duration-300">
        {/* Switch to flex layout for horizontal row */}
        <div className="flex flex-row flex-wrap gap-2 sm:gap-4 items-center w-full transition-all duration-500">
          {/* From */}
          <div className="flex-1 min-w-[120px] relative transition-all duration-300" ref={fromDropdownRef}>
            <div className="relative">
              <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10">
                <PlaneTakeoff className="h-3 w-3 text-brand-pink-500" />
              </div>
              <input
                type="text"
                value={from}
                onFocus={() => {
                  setAirportSuggestions([]);
                  setFromError({ isError: false, message: "" });
                }}
                onChange={onFromChange}
                placeholder="From where?"
                className="w-full pl-8 pr-2 py-2 border border-brand-gray-200 dark:border-brand-gray-600 bg-white dark:bg-[rgb(25,30,36)] rounded-md focus:ring-2 focus:ring-brand-pink-500 focus:border-brand-pink-500 text-xs font-medium shadow-sm hover:shadow-md dark:hover:shadow-brand-dark transition-all duration-200 dark:text-white dark:placeholder-brand-gray-400"
              />
              {fromError.isError && (
                <p className="text-xs text-brand-error mt-1">
                  {fromError.message}
                </p>
              )}
            </div>
            {airportSuggestions.length > 0 && from && (
              <div className="absolute top-full left-0 w-full bg-white dark:bg-[rgb(25,30,36)] border border-brand-gray-200 dark:border-brand-gray-600 rounded-lg shadow-xl dark:shadow-brand-dark-lg mt-1 max-h-48 overflow-y-auto z-50">
                {airportSuggestions.map((ap, i) => (
                  <div
                    key={i}
                    className="px-4 py-3 hover:bg-brand-pink-50 dark:hover:bg-[rgb(35,42,49)] cursor-pointer border-b border-brand-gray-100 dark:border-brand-gray-600 last:border-0"
                    onClick={() => {
                      setFrom(`${ap.name}, ${ap.city}`);
                      setAirportSuggestions([]);
                    }}
                  >
                    <div className="text-sm font-semibold text-brand-gray-900 dark:text-white">
                      {ap.name} ({ap.iata})
                    </div>
                    <div className="text-xs text-brand-gray-500 dark:text-brand-gray-400">
                      {ap.city}, {ap.country}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Swap Button */}
          <div className="flex-none flex justify-center items-center transition-all duration-300" style={{ minWidth: 60 }}>
            <button
              onClick={handleSwap}
              className="p-2 bg-white dark:bg-[rgb(25,30,36)] rounded-full shadow-sm hover:shadow-md dark:shadow-brand-dark dark:hover:shadow-brand-dark-lg transition-all duration-200 hover:scale-105 border border-brand-gray-200 dark:border-brand-gray-600 dark:glow-brand-pink"
              style={{ margin: '0 2px' }}
            >
              <ArrowLeftRight className="h-3 w-3 text-brand-pink-500 dark:text-brand-pink-400" />
            </button>
          </div>

          {/* To */}
          <div className="flex-1 min-w-[120px] relative transition-all duration-300" ref={toDropdownRef}>
            <div className="relative">
              <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10">
                <PlaneLanding className="h-3 w-3 text-brand-pink-500" />
              </div>
              <input
                type="text"
                value={to}
                onFocus={() => {
                  setToAirportSuggestions([]);
                  setToError({ isError: false, message: "" });
                }}
                onChange={onToChange}
                placeholder="To where?"
                className="w-full pl-8 pr-2 py-2 border border-brand-gray-200 dark:border-brand-gray-600 bg-white dark:bg-[rgb(25,30,36)] rounded-md focus:ring-2 focus:ring-brand-pink-500 focus:border-brand-pink-500 text-xs font-medium shadow-sm hover:shadow-md dark:hover:shadow-brand-dark transition-all duration-200 dark:text-white dark:placeholder-brand-gray-400"
              />
              {toError.isError && (
                <p className="text-xs text-brand-error mt-1">
                  {toError.message}
                </p>
              )}
            </div>
            {toAirportSuggestions.length > 0 && to && (
              <div className="absolute top-full left-0 w-full bg-white border border-brand-gray-200 rounded-lg shadow-xl mt-1 max-h-48 overflow-y-auto z-50">
                {toAirportSuggestions.map((ap, i) => (
                  <div
                    key={i}
                    className="px-4 py-3 hover:bg-brand-pink-50 cursor-pointer border-b border-brand-gray-100 last:border-0"
                    onClick={() => {
                      setTo(`${ap.city}, ${ap.iata}`);
                      setToAirportSuggestions([]);
                    }}
                  >
                    <div className="text-sm font-semibold text-brand-gray-900">
                      {ap.name} ({ap.iata})
                    </div>
                    <div className="text-xs text-brand-gray-500">
                      {ap.city}, {ap.country}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={`flex-1 flex flex-row gap-2 sm:gap-4 items-center transition-all duration-500`}>
            {/* Departure Date */}
            <div className="relative flex-1 min-w-[120px] transition-all duration-500">
              {!departDate && (
                <span className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 pointer-events-none text-xs">
                  Departure date
                </span>
              )}
              <input
                type="date"
                value={departDate ? departDate.toISOString().split("T")[0] : ""}
                onChange={(e) => {
                  const selectedDate = new Date(e.target.value);
                  if (isNaN(selectedDate.getTime())) {
                    setDepartDateError({
                      isError: true,
                      message: "Invalid date",
                    });
                  } else {
                    setDepartDate(selectedDate);
                    setDepartDateError({ isError: false, message: "" });
                  }
                }}
                min={new Date().toISOString().split("T")[0]}
                className={`w-full border border-brand-gray-200 dark:border-brand-gray-600 bg-white dark:bg-[rgb(25,30,36)] rounded-md py-2 px-3 text-xs font-medium shadow-sm hover:shadow-md dark:hover:shadow-brand-dark transition-all duration-200 focus:ring-2 focus:ring-brand-pink-500 focus:border-brand-pink-500 ${
                  !departDate ? "text-transparent" : "text-black dark:text-white"
                } transition-all duration-500`}
              />
              {departDateError.isError && (
                <p className="text-xs text-brand-error mt-1">
                  {departDateError.message}
                </p>
              )}
            </div>

            {/* Return Date - Animate removal by flex-grow and width */}
            <div
              className={`relative transition-all duration-500 ${
                flightType === "round-trip" ? "flex-1 min-w-[120px] opacity-100" : "w-0 min-w-0 opacity-0 pointer-events-none"
              }`}
              style={{
                transitionProperty: 'width, min-width, opacity',
                width: flightType === 'round-trip' ? '100%' : '0px',
                minWidth: flightType === 'round-trip' ? 120 : 0,
                opacity: flightType === 'round-trip' ? 1 : 0,
                overflow: 'hidden',
              }}
            >
              {flightType === "round-trip" && !returnDate && (
                <span className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 pointer-events-none text-xs">
                  Return date
                </span>
              )}
              {flightType === "round-trip" && (
                <input
                  type="date"
                  value={returnDate ? returnDate.toISOString().split("T")[0] : ""}
                  onChange={(e) => {
                    const selectedDate = new Date(e.target.value);
                    if (isNaN(selectedDate.getTime())) {
                      setReturnDateError({
                        isError: true,
                        message: "Invalid date",
                      });
                    } else {
                      setReturnDate(selectedDate);
                      setReturnDateError({ isError: false, message: "" });
                    }
                  }}
                  min={
                    departDate
                      ? departDate.toISOString().split("T")[0]
                      : new Date().toISOString().split("T")[0]
                  }
                  className={`w-full border border-brand-gray-200 dark:border-brand-gray-600 bg-white dark:bg-[rgb(25,30,36)] rounded-md py-2 px-3 text-xs font-medium shadow-sm hover:shadow-md dark:hover:shadow-brand-dark transition-all duration-200 focus:ring-2 focus:ring-brand-pink-500 focus:border-pink-500 ${
                    !returnDate ? "text-transparent" : "text-black dark:text-white"
                  } transition-all duration-500`}
                />
              )}
              {flightType === "round-trip" && returnDateError.isError && (
                <p className="text-xs text-brand-error mt-1">
                  {returnDateError.message}
                </p>
              )}
            </div>
          </div>

          {/* Search Button - Desktop Only */}
          <div className="hidden lg:block flex-none" style={{ minWidth: 120 }}>
            <Button
              onClick={handleSearch}
              className="w-full max-w-sm bg-pink-500 hover:bg-pink-600 dark:bg-pink-400 dark:hover:bg-pink-500 text-white font-semibold py-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          {/* Remove search button from round-trip inline position */}
        </div>
      </div>

      {/* Simplified Passenger & Class Selection */}
      <div className="flex flex-wrap justify-center gap-4 px-4 sm:px-0">
        {/* Passengers */}
        <div className="flex items-center rounded-lg px-4 py-2">
          <Users className="h-4 w-4 text-brand-pink-500 mr-2" />
          <span className="text-sm font-medium mr-3">Passengers:</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => dec("adults")}
              disabled={counts.adults <= 1}
              className="w-6 h-6 rounded-full bg-white dark:bg-[rgb(25,30,36)] border border-brand-gray-300 dark:border-brand-gray-600 flex items-center justify-center text-xs hover:bg-brand-gray-100 dark:hover:bg-[rgb(35,42,49)] disabled:opacity-50 text-brand-gray-700 dark:text-brand-gray-300 transition-all duration-200 shadow-sm dark:shadow-brand-dark"
            >
              −
            </button>
            <span className="text-sm font-medium px-2 text-brand-gray-700 dark:text-brand-gray-300">
              {counts.adults + counts.children}
            </span>
            <button
              onClick={() => inc("adults")}
              className="w-6 h-6 rounded-full bg-white dark:bg-[rgb(25,30,36)] border border-brand-gray-300 dark:border-brand-gray-600 flex items-center justify-center text-xs hover:bg-brand-gray-100 dark:hover:bg-[rgb(35,42,49)] text-brand-gray-700 dark:text-brand-gray-300 transition-all duration-200 shadow-sm dark:shadow-brand-dark"
            >
              +
            </button>
          </div>
        </div>
        {/* Class */}
        <div className="flex items-center  rounded-lg px-4 py-2  ">
          <span className="text-sm font-medium mr-3 text-brand-gray-700 dark:text-brand-gray-300">
            Class:
          </span>
          <div className="relative">
            <select
              value={classType}
              onChange={(e) => setClassType(e.target.value)}
              className="bg-white dark:bg-[rgb(25,30,36)] border border-brand-gray-200 dark:border-brand-gray-600 rounded-md px-3 py-1.5 text-sm font-medium text-pink-600 dark:text-pink-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none appearance-none pr-8 min-w-[120px] shadow-sm dark:shadow-brand-dark transition-all duration-200"
            >
              <option
                value="Economy"
                className="dark:bg-[rgb(25,30,36)] dark:text-white"
              >
                Economy
              </option>
              <option
                value="Premium Economy"
                className="dark:bg-[rgb(25,30,36)] dark:text-white"
              >
                Premium Economy
              </option>
              <option
                value="Business"
                className="dark:bg-[rgb(25,30,36)] dark:text-white"
              >
                Business
              </option>
              <option
                value="First"
                className="dark:bg-[rgb(25,30,36)] dark:text-white"
              >
                First
              </option>
            </select>
            {/* Custom dropdown arrow */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                className="w-4 h-4 text-pink-500 dark:text-pink-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>{" "}
      </div>

      {/* Search Button for All Flight Types - Mobile Only (After Passenger Controls) */}
      <div className="lg:hidden px-4 sm:px-0 flex justify-center">
        <Button
          onClick={handleSearch}
          className="w-full max-w-sm bg-pink-500 hover:bg-pink-600 dark:bg-pink-400 dark:hover:bg-pink-500 text-white font-semibold py-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
        >
          Search
          <Search className="h-4 w-4 mr-2" />
          {flightType === "one-way"
            ? "Search Flights"
            : "Search Round-Trip Flights"}
        </Button>
      </div>
    </div>
  );
}
