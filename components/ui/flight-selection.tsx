"use client";

import React, { useState, useEffect, useTransition, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import airports from "@/public/airports.json";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Search,
  Users,
  Calendar,
  PlaneTakeoff,
  PlaneLanding,
  ArrowLeftRight,
  MapPin,
} from "lucide-react";

type Airport = {
  name: string;
  city: string;
  country: string;
  iata: string;
  icao: string;
};
type Leg = { from: string; to: string; date?: Date };

export function FlightSelection() {
  const router = useRouter();
  const MAX_LEGS = 5;
  
  // Use transition for non-blocking updates
  const [isPending, startTransition] = useTransition();
  
  // Search loading state
  const [isSearching, setIsSearching] = useState(false);

  // Flight type
  const [flightType, setFlightType] = useState<
    "one-way" | "round-trip" | "multi-city"
  >("round-trip");

  // Single-leg inputs
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departDate, setDepartDate] = useState<Date | undefined>(undefined);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
 const fromRef = useRef<HTMLDivElement>(null);
 const toRef = useRef<HTMLDivElement>(null);
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

  // Multi-city legs
  const [legs, setLegs] = useState<Leg[]>([
    { from: "", to: "", date: undefined },
  ]);
  const [legFromSuggestions, setLegFromSuggestions] = useState<Airport[][]>([
    [],
  ]);
  const [legToSuggestions, setLegToSuggestions] = useState<Airport[][]>([[]]);

  // Helper to score & find airports - simplified to search entire dataset
  const findAirport = useMemo(() => {
    return (q: string): Airport[] => {
      if (q.length < 1) return [];
      
      const query = q.toLowerCase();
      const results = airports
        .map((a) => {
          let score = 0;
          
          // Exact matches get highest priority
          if (a.iata.toLowerCase() === query) score += 1000;
          if (a.icao.toLowerCase() === query) score += 1000;
          if (a.city.toLowerCase() === query) score += 900;
          
          // Starts with gets high priority
          if (a.city.toLowerCase().startsWith(query)) score += 800;
          if (a.name.toLowerCase().startsWith(query)) score += 700;
          if (a.iata.toLowerCase().startsWith(query)) score += 600;
          
          // Contains gets medium priority
          if (a.city.toLowerCase().includes(query)) score += 500;
          if (a.name.toLowerCase().includes(query)) score += 400;
          if (a.country.toLowerCase().includes(query)) score += 300;
          if (a.iata.toLowerCase().includes(query)) score += 200;
          if (a.icao.toLowerCase().includes(query)) score += 100;
          
          return { airport: a, score };
        })
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 20) // Show top 20 results
        .map((x) => x.airport);
      
      return results;
    };
  }, []);

  //useEffect to handle outside click for clearing suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fromRef.current && !fromRef.current.contains(event.target as Node)) {
        if(airportSuggestions.length > 0) {
          const airport = airportSuggestions[0];
          setFrom(`${airport.name}, ${airport.city}`);
        }
        setAirportSuggestions([]);
      }
      if (toRef.current && !toRef.current.contains(event.target as Node)) {
        if(toAirportSuggestions.length > 0) {
          const airport = toAirportSuggestions[0];
          setTo(`${airport.name}, ${airport.city}`);
        }
        setToAirportSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [fromRef, toRef, airportSuggestions, toAirportSuggestions]);

  // Single-leg handlers - optimized with transitions
  const onFromChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setFrom(v);
    
    // Clear error when user starts typing
    if (fromError.isError) {
      setFromError({ isError: false, message: "" });
    }
    
    // Clear suggestions immediately for empty input
    if (v.length === 0) {
      setAirportSuggestions([]);
      return;
    }
    
    // Use transition to prevent blocking the UI
    startTransition(() => {
      setAirportSuggestions(findAirport(v));
    });
  }, [findAirport, startTransition, fromError.isError]);
  
  const onToChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setTo(v);
    
    // Clear error when user starts typing
    if (toError.isError) {
      setToError({ isError: false, message: "" });
    }
    
    // Clear suggestions immediately for empty input
    if (v.length === 0) {
      setToAirportSuggestions([]);
      return;
    }
    
    // Use transition to prevent blocking the UI
    startTransition(() => {
      setToAirportSuggestions(findAirport(v));
    });
  }, [findAirport, startTransition, toError.isError]);

  // Multi-city handlers - optimized with transitions
  const updateLeg = (idx: number, data: Partial<Leg>) => {
    setLegs((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], ...data };
      return copy;
    });
  };
  
  const onLegFromChange = useCallback((
    idx: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const v = e.target.value;
    updateLeg(idx, { from: v });
    
    // Clear suggestions immediately for empty input
    if (v.length === 0) {
      setLegFromSuggestions((s) => {
        const copy = [...s];
        copy[idx] = [];
        return copy;
      });
      return;
    }
    
    // Use transition to prevent blocking the UI
    startTransition(() => {
      setLegFromSuggestions((s) => {
        const copy = [...s];
        copy[idx] = findAirport(v);
        return copy;
      });
    });
  }, [findAirport, startTransition]);
  
  const onLegToChange = useCallback((
    idx: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const v = e.target.value;
    updateLeg(idx, { to: v });
    
    // Clear suggestions immediately for empty input
    if (v.length === 0) {
      setLegToSuggestions((s) => {
        const copy = [...s];
        copy[idx] = [];
        return copy;
      });
      return;
    }
    
    // Use transition to prevent blocking the UI
    startTransition(() => {
      setLegToSuggestions((s) => {
        const copy = [...s];
        copy[idx] = findAirport(v);
        return copy;
      });
    });
  }, [findAirport, startTransition]);
  const onLegDateChange = (idx: number, date?: Date) =>
    updateLeg(idx, { date });
  const addLeg = () => {
    setLegs((prev) => [...prev, { from: "", to: "", date: undefined }]);
    setLegFromSuggestions((s) => [...s, []]);
    setLegToSuggestions((s) => [...s, []]);
  };
  const removeLeg = (idx: number) => {
    setLegs((prev) => prev.filter((_, i) => i !== idx));
    setLegFromSuggestions((s) => s.filter((_, i) => i !== idx));
    setLegToSuggestions((s) => s.filter((_, i) => i !== idx));
  };

  // Swap for single-leg
  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  // search
  const handleSearch = async () => {
    setIsSearching(true);
    
    try {
      // Helper function to validate if input contains airport info
      const isValidAirportInput = (input: string) => {
        if (!input || !input.includes(',')) return false;
        
        // With our format: "Airport Name, City"
        const [airportName] = input.split(',').map(s => s.trim());
        return airports.find((airport) => airport.name === airportName);
      };

      // Validate inputs
      if(!from) {
        setFromError({ isError: true, message: "Please enter a departure city." });
        return;
      }
      if(!isValidAirportInput(from)) {
        setFromError({ isError: true, message: "Please select a valid departure airport." });
        return;
      }

      if (!to) {
        setToError({ isError: true, message: "Please enter a destination city." });
        return;
      }
      if (!isValidAirportInput(to)) {
        setToError({ isError: true, message: "Please select a valid destination airport." });
        return;
      }
      
      if(!departDate) {
        setDepartDateError({ isError: true, message: "Please select a departure date." });
        return;
      }
      // //for round trips
      if (flightType == 'round-trip' && !returnDate) {
        setReturnDateError({ isError: true, message: "Please select a return date." });
        return;
      }

      //going to the search page
      
      //formating the date
      const ddate = departDate ? departDate.toISOString().split('T')[0] : "";
      const rdate = returnDate ? returnDate.toISOString().split('T')[0] : "";
      const params = new URLSearchParams({
        flightType,
        from,
        to,
        departDate: ddate,
        returnDate: rdate,
        travelers: `${counts.adults} Adult${counts.adults > 1 ? "s" : ""}`,
        classType,
        legs: flightType === "multi-city" ? JSON.stringify(legs) : "",
      })
      router.push(`/flight-search?${params.toString()}`);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 pt-6 sm:pt-10">
      {/* Flight Types */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Book Cheap Flights
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">Search flights for your next adventure!</p>
        <RadioGroup
          value={flightType}
          onValueChange={(val) => {
            setFlightType(val as "one-way" | "round-trip" | "multi-city");
            // if (val !== "multi-city") {
            //   setLegs([{ from: "", to: "", date: undefined }]);
            //   setLegFromSuggestions([[]]);
            //   setLegToSuggestions([[]]);
            // }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4"
        >
          {(["one-way", "round-trip"] as const).map((val) => (
            <div
              key={val}
              onClick={() => setFlightType(val)}
              className={cn(
                "flex items-center justify-center p-3 sm:p-4 border rounded-lg cursor-pointer transition-colors",
                flightType === val
                  ? "border-pink-500 bg-pink-50"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <RadioGroupItem value={val} id={val} className="sr-only" />
              <Label
                htmlFor={val}
                className="text-sm font-medium cursor-pointer capitalize"
              >
                {val.replace("-", " ")}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
       {/* Single-leg / Round-trip */}
      {flightType !== "multi-city" && (
        <div className="border-t border-gray-200 pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
          {/* From */}
          <div ref={fromRef} className="md:col-span-1 lg:col-span-3 relative overflow-visible">
            <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <PlaneTakeoff className="h-4 w-4 text-pink-500" /> From
            </Label>
            <div className="relative">
              <TooltipProvider>
                <Tooltip open={fromError.isError}>
                  <TooltipTrigger asChild>
                    <input
                      type="text"
                      value={from}
                      onFocus={() => {
                        setAirportSuggestions([]);
                        setFromError({ isError: false, message: "" });
                      }}
                      onChange={onFromChange}
                      placeholder="Departure city"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-sm"
                    />
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-sm text-red-500">{fromError.message}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <MapPin className={`absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isPending ? 'animate-pulse text-pink-500' : 'text-gray-400'}`} />
              {airportSuggestions.length > 0 && from && (
                <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-32 overflow-y-auto z-10">
                  {airportSuggestions.map((ap, i) => (
                    <div
                      key={i}
                      className="px-4 py-2 hover:bg-pink-50 cursor-pointer"
                      onClick={() => {
                        setFrom(`${ap.name}, ${ap.city}`);
                        setAirportSuggestions([]);
                      }}
                    >
                      <div className="text-sm font-medium">
                        {ap.name} ({ap.iata})
                      </div>
                      <div className="text-xs text-gray-500">
                        {ap.city}, {ap.country}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Swap */}
          {flightType === "round-trip" && (
            <div className="hidden md:flex md:col-span-2 lg:col-span-1 justify-center order-3 md:order-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSwap}
                aria-label="Swap departure and destination"
                className="p-2 rounded-full border-2 border-pink-200 hover:border-pink-500 hover:bg-pink-50"
              >
                <ArrowLeftRight className="h-4 w-4 text-pink-500" />
              </Button>
            </div>
          )}

          {/* To */}
          <div ref={toRef} className="md:col-span-1 lg:col-span-3 relative overflow-visible order-2 md:order-3">
            <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <PlaneLanding className="h-4 w-4 text-pink-500" /> To
            </Label>
            <div className="relative">
              <TooltipProvider>
                <Tooltip open={toError.isError}>
                  <TooltipTrigger asChild>
                    <input
                      type="text"
                      value={to}
                      onFocus={() => {
                        setToAirportSuggestions([]);
                        setToError({ isError: false, message: "" });
                      }}
                      onChange={onToChange}
                      placeholder="Destination city"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-sm"
                    />
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-sm text-red-500">{toError.message}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <MapPin className={`absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isPending ? 'animate-pulse text-pink-500' : 'text-gray-400'}`} />
              {toAirportSuggestions.length > 0 && to && (
                <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-32 overflow-y-auto z-10">
                  {toAirportSuggestions.map((ap, i) => (
                    <div
                      key={i}
                      className="px-4 py-2 hover:bg-pink-50 cursor-pointer"
                      onClick={() => {
                        setTo(`${ap.name}, ${ap.city}`);
                        setToAirportSuggestions([]);
                      }}
                    >
                      <div className="text-sm font-medium">
                        {ap.name} ({ap.iata})
                      </div>
                      <div className="text-xs text-gray-500">
                        {ap.city}, {ap.country}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Swap Button */}
          {flightType === "round-trip" && (
            <div className="md:hidden flex justify-center order-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSwap}
                aria-label="Swap departure and destination"
                className="p-2 rounded-full border-2 border-pink-200 hover:border-pink-500 hover:bg-pink-50"
              >
                <ArrowLeftRight className="h-4 w-4 text-pink-500" />
              </Button>
            </div>
          )}

          {/* Depart */}
          <div className={`${flightType === "one-way" ? "md:col-span-2 lg:col-span-5" : "md:col-span-1 lg:col-span-2"} order-5`}>
            <Label
              htmlFor="departure"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
            >
              <Calendar className="h-4 w-4 text-pink-500" /> Departure date
            </Label>
            <TooltipProvider>
              <Tooltip open={departDateError.isError}>
                <TooltipTrigger asChild>
                  <input
                    type="date"
                    id="departure"
                    value={
                      departDate ? departDate.toISOString().split("T")[0] : ""
                    }
                    onChange={(e) =>
                      setDepartDate(
                        e.target.value ? new Date(e.target.value) : undefined
                      )
                    }
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                  />
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-sm text-red-500">
                    {departDateError.message}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Return */}
          {flightType === "round-trip" && (
            <div className="md:col-span-1 lg:col-span-2 order-6">
              <Label
                htmlFor="return"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
              >
                <Calendar className="h-4 w-4 text-pink-500" /> Return date
              </Label>
               <TooltipProvider>
                <Tooltip open={returnDateError.isError}>
                  <TooltipTrigger asChild>
              <input
                type="date"
                id="return"
                value={returnDate ? returnDate.toISOString().split("T")[0] : ""}
                onChange={(e) =>
                  setReturnDate(
                    e.target.value ? new Date(e.target.value) : undefined
                  )
                }
                onFocus={() => {
                  setReturnDateError({ isError: false, message: "" });
                }}
                min={(departDate || new Date()).toISOString().split("T")[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
              />
               </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-sm text-red-500">{returnDateError.message}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      )}

      <div className="mb-6 flex flex-col sm:flex-row sm:items-end space-y-4 sm:space-y-0 sm:space-x-4 w-full">
        {/* Adults */}
        <div
          data-testid="passenger-adults"
          role="group"
          aria-label="Adult passengers"
          className="flex-1 min-w-0"
        >
          <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2 items-center justify-center sm:justify-start space-x-4 pt-10">
            <Users className="h-4 w-4 text-pink-500 " /> Adults
          </Label>
          <div className="flex items-center justify-center sm:justify-start space-x-4">
            <span className="sr-only">Adults</span>
            <button
              type="button"
              data-testid="adults-decrement"
              disabled={counts.adults <= 1}
              onClick={() => dec("adults")}
              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100"
              aria-label="Decrease adult count"
            >
              −
            </button>
            <span
              data-testid="adults-count"
              className="w-8 text-center text-sm"
            >
              {counts.adults}
            </span>
            <button
              type="button"
              data-testid="adults-increment"
              onClick={() => inc("adults")}
              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100"
              aria-label="Increase adult count"
            >
              +
            </button>
            <span className="sr-only">Adults</span>
          </div>
        </div>

        {/* Children */}
        <div
          data-testid="passenger-children"
          role="group"
          aria-label="Child passengers"
          className="flex-1 min-w-0"
        >
          <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2 items-center justify-center sm:justify-start space-x-4">
            <Users className="h-4 w-4 text-pink-500" /> Children
          </Label>
          <div className="flex items-center justify-center sm:justify-start space-x-4">
            <span className="sr-only">Children</span>
            <button
              type="button"
              data-testid="children-decrement"
              onClick={() => dec("children")}
              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100"
              aria-label="Decrease children count"
            >
              −
            </button>
            <span
              data-testid="children-count"
              className="w-8 text-center text-sm"
            >
              {counts.children}
            </span>
            <button
              type="button"
              data-testid="children-increment"
              onClick={() => inc("children")}
              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100"
              aria-label="Increase children count"
            >
              +
            </button>
            <span className="sr-only">Children</span>
          </div>
        </div>

        {/* Class */}
        <div className="flex-1 min-w-0 sm:min-w-[120px]">
          <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            Class
          </Label>
          <select
            value={classType}
            onChange={(e) => setClassType(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-sm"
          >
            <option>Economy</option>
            <option>Premium Economy</option>
            <option>Business</option>
            <option>First</option>
          </select>
        </div>
      </div>

     
      

      {/* Multi-city Legs */}
      {flightType === "multi-city" && (
        <div className="mt-6">
          {legs.map((leg, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end mb-4"
            >
              {/* From */}
              <div className="sm:col-span-1 lg:col-span-3 relative overflow-visible">
                <Label
                  htmlFor={`from-${idx}`}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
                >
                  <PlaneTakeoff className="h-4 w-4 text-pink-500" /> From
                </Label>
                <div className="relative">
                  <input
                    id={`from-${idx}`}
                    type="text"
                    value={leg.from}
                    onFocus={() => {
                      const s = [...legFromSuggestions];
                      s[idx] = [];
                      setLegFromSuggestions(s);
                    }}
                    onChange={(e) => onLegFromChange(idx, e)}
                    placeholder="Departure city"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-sm"
                  />
                  <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  {legFromSuggestions[idx].length > 0 && leg.from && (
                    <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-32 overflow-y-auto z-10">
                      {legFromSuggestions[idx].map((ap, i) => (
                        <div
                          key={i}
                          className="px-4 py-2 hover:bg-pink-50 cursor-pointer"
                          onClick={() => {
                            updateLeg(idx, { from: `${ap.name}, ${ap.city}` });
                            const s = [...legFromSuggestions];
                            s[idx] = [];
                            setLegFromSuggestions(s);
                          }}
                        >
                          <div className="text-sm font-medium">
                            {ap.name} ({ap.iata})
                          </div>
                          <div className="text-xs text-gray-500">
                            {ap.city}, {ap.country}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Swap leg */}
              <div className="hidden lg:flex lg:col-span-1 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const c = [...legs];
                    [c[idx].from, c[idx].to] = [c[idx].to, c[idx].from];
                    setLegs(c);
                  }}
                  aria-label="Swap departure and destination"
                  className="p-2 rounded-full border-2 border-pink-200 hover:border-pink-500 hover:bg-pink-50"
                >
                  <ArrowLeftRight className="h-4 w-4 text-pink-500" />
                </Button>
              </div>
              {/* To */}
              <div className="sm:col-span-1 lg:col-span-3 relative overflow-visible">
                <Label
                  htmlFor={`to-${idx}`}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
                >
                  <PlaneLanding className="h-4 w-4 text-pink-500" /> To
                </Label>
                <div className="relative">
                  <input
                    id={`to-${idx}`}
                    type="text"
                    value={leg.to}
                    onFocus={() => {
                      const s = [...legToSuggestions];
                      s[idx] = [];
                      setLegToSuggestions(s);
                    }}
                    onChange={(e) => onLegToChange(idx, e)}
                    placeholder="Destination city"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-sm"
                  />
                  <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  {legToSuggestions[idx].length > 0 && leg.to && (
                    <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-32 overflow-y-auto z-10">
                      {legToSuggestions[idx].map((ap, i) => (
                        <div
                          key={i}
                          className="px-4 py-2 hover:bg-pink-50 cursor-pointer"
                          onClick={() => {
                            updateLeg(idx, { to: `${ap.name}, ${ap.city}` });
                            const s = [...legToSuggestions];
                            s[idx] = [];
                            setLegToSuggestions(s);
                          }}
                        >
                          <div className="text-sm font-medium">
                            {ap.name} ({ap.iata})
                          </div>
                          <div className="text-xs text-gray-500">
                            {ap.city}, {ap.country}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Mobile Swap Button for Multi-city */}
              <div className="sm:col-span-2 lg:hidden flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const c = [...legs];
                    [c[idx].from, c[idx].to] = [c[idx].to, c[idx].from];
                    setLegs(c);
                  }}
                  aria-label="Swap departure and destination"
                  className="p-2 rounded-full border-2 border-pink-200 hover:border-pink-500 hover:bg-pink-50"
                >
                  <ArrowLeftRight className="h-4 w-4 text-pink-500" />
                </Button>
              </div>
              
              {/* Depart leg */}
              <div className="sm:col-span-1 lg:col-span-2">
                <Label
                  htmlFor={`leg-${idx}-date`}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
                >
                  <Calendar className="h-4 w-4 text-pink-500" /> Departure date
                </Label>
                <input
                  type="date"
                  id={`leg-${idx}-date`}
                  value={leg.date ? leg.date.toISOString().split("T")[0] : ""}
                  onChange={(e) =>
                    onLegDateChange(
                      idx,
                      e.target.value ? new Date(e.target.value) : undefined
                    )
                  }
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Remove leg */}
              {idx > 0 && (
                <div className="sm:col-span-1 lg:col-span-1 flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeLeg(idx)}
                    className="w-10 h-10 p-2 rounded-full text-red-500 hover:bg-red-50 flex items-center justify-center z-10"
                  >
                    x
                  </Button>
                </div>
              )}
            </div>
          ))}

          {/* + Add Another Flight */}
          <div className="flex justify-center sm:justify-end">
            <button
              type="button"
              onClick={addLeg}
              disabled={legs.length >= MAX_LEGS}
              className={cn(
                "text-sm font-medium px-4 py-2 rounded-lg border transition-colors",
                legs.length >= MAX_LEGS
                  ? "text-gray-400 cursor-not-allowed border-gray-200"
                  : "text-pink-500 hover:bg-pink-50 border-pink-200 hover:border-pink-500"
              )}
            >
              {legs.length >= MAX_LEGS
                ? `Maximum ${MAX_LEGS} flights reached`
                : "+ Add Another Flight"}
            </button>
          </div>
        </div>
      )}

      {/* Search button */}
      <div className="mt-6 flex justify-center">
        <Button
          onClick={handleSearch}
          disabled={isSearching}
          className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold shadow-lg hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isSearching ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Searching...
            </>
          ) : (
            <>
              <Search className="h-5 w-5 mr-2" /> Search Flights
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
