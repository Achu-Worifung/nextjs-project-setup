"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import airports from "@/public/airports.json";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { DayPicker } from "react-day-picker";
import {
  Search,
  Users,
  Calendar,
  PlaneTakeoff,
  PlaneLanding,
  ArrowLeftRight,
  MapPin,
} from "lucide-react";

type Airport = { name: string; city: string; country: string; iata: string; icao: string };
type Leg = { from: string; to: string; date?: Date };

export function FlightSelection() {
  const router = useRouter();
  const MAX_LEGS = 5;

  // Flight type
  const [flightType, setFlightType] = useState<"one-way" | "round-trip" | "multi-city">(
    "round-trip"
  );

  // Single-leg inputs
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departDate, setDepartDate] = useState<Date | undefined>(undefined);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);

  // Passenger counts
  const [counts, setCounts] = useState({ adults: 0, children: 0 });
  const inc = (key: "adults" | "children") =>
    setCounts(c => ({ ...c, [key]: c[key] + 1 }));
  const dec = (key: "adults" | "children") =>
    setCounts(c => ({ ...c, [key]: Math.max(0, c[key] - 1) }));

  const [classType, setClassType] = useState("Economy");

  // Autocomplete suggestions
  const [airportSuggestions, setAirportSuggestions] = useState<Airport[]>([]);
  const [toAirportSuggestions, setToAirportSuggestions] = useState<Airport[]>([]);

  // Multi-city legs
  const [legs, setLegs] = useState<Leg[]>([{ from: "", to: "", date: undefined }]);
  const [legFromSuggestions, setLegFromSuggestions] = useState<Airport[][]>([[]]);
  const [legToSuggestions, setLegToSuggestions] = useState<Airport[][]>([[]]);

  // Helper to score & find airports
  function findAirport(q: string): Airport[] {
    const query = q.toLowerCase();
    return airports
      .map((a) => {
        let score = 0;
        // Exact matches first
        if (a.iata.toLowerCase() === query) score += 100;
        if (a.icao.toLowerCase() === query) score += 100;
        // Major airports ranking
        if (a.name.toLowerCase().includes("international")) score += 40;
        if (a.name.toLowerCase().includes("heathrow")) score += 50;
        // Major cities bonus
        const majorCities = ["london", "new york", "paris", "tokyo", "beijing", "dubai", "los angeles", "chicago", "hong kong", "frankfurt"];
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
      .map((x) => x.airport);
  }

  // Single-leg handlers
  const onFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setFrom(v);
    setAirportSuggestions(findAirport(v));
  };
  const onToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setTo(v);
    setToAirportSuggestions(findAirport(v));
  };

  // Multi-city handlers
  const updateLeg = (idx: number, data: Partial<Leg>) => {
    setLegs((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], ...data };
      return copy;
    });
  };
  const onLegFromChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    updateLeg(idx, { from: v });
    setLegFromSuggestions((s) => {
      const copy = [...s];
      copy[idx] = findAirport(v);
      return copy;
    });
  };
  const onLegToChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    updateLeg(idx, { to: v });
    setLegToSuggestions((s) => {
      const copy = [...s];
      copy[idx] = findAirport(v);
      return copy;
    });
  };
  const onLegDateChange = (idx: number, date?: Date) => updateLeg(idx, { date });
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
  const handleSearch = () => {
    const params = new URLSearchParams({
      flightType,
      from,
      to,
      departDate: departDate ? format(departDate, "yyyy-MM-dd") : "",
      returnDate: returnDate ? format(returnDate, "yyyy-MM-dd") : "",
      travelers: `${counts.adults} Adult${counts.adults > 1 ? "s" : ""}`,
      classType,
      legs: flightType === "multi-city" ? JSON.stringify(legs) : "",
    });
    router.push(`/flight-search?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-6 pt-10">

      {/* Flight Types */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Cheap Flights</h2>
        <p className="text-gray-600">Search flights for your next adventure!</p>
        <RadioGroup
          value={flightType}
          onValueChange={(val) => {
            setFlightType(val as any);
            if (val !== "multi-city") {
              setLegs([{ from: "", to: "", date: undefined }]);
              setLegFromSuggestions([[]]);
              setLegToSuggestions([[]]);
            }
          }}
          className="grid grid-cols-3 gap-4 mt-4"
        >
          {(["one-way", "round-trip", "multi-city"] as const).map((val) => (
            <div
              key={val}
              onClick={() => setFlightType(val)}
              className={cn(
                "flex items-center justify-center p-4 border rounded-lg cursor-pointer",
                flightType === val ? "border-pink-500 bg-pink-50" : "border-gray-200"
              )}
            >
              <RadioGroupItem value={val} id={val} className="sr-only" />
              <Label htmlFor={val} className="text-sm font-medium cursor-pointer capitalize">
                {val.replace("-", " ")}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

 
<div className="mb-6 flex items-end space-x-4 w-full">
  {/* Adults */}
  <div data-testid="passenger-adults" role="group" aria-label="Adult passengers">
    <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
      <Users className="h-4 w-4 text-pink-500" /> Adults
    </Label>
    <div className="flex items-center space-x-4">
      <span className="sr-only">Adults</span>
      <button
        type="button"
        data-testid="adults-decrement"
        onClick={() => dec("adults")}
        className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100"
        aria-label="Decrease adult count"
      >
        −
      </button>
      <span data-testid="adults-count" className="w-8 text-center text-sm">{counts.adults}</span>
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
  <div data-testid="passenger-children" role="group" aria-label="Child passengers">
    <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
      <Users className="h-4 w-4 text-pink-500" /> Children
    </Label>
    <div className="flex items-center space-x-4">
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
      <span data-testid="children-count" className="w-8 text-center text-sm">{counts.children}</span>
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
  <div className="flex-1">
    <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
      Class
    </Label>
    <select
      value={classType}
      onChange={e => setClassType(e.target.value)}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-sm"
    >
      <option>Economy</option>
      <option>Premium Economy</option>
      <option>Business</option>
      <option>First</option>
    </select>
  </div>
</div>

      {/* Single-leg / Round-trip */}
      {flightType !== "multi-city" && (
        <div className="border-t border-gray-200 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
          
          {/* From */}
          <div className="lg:col-span-3 relative overflow-visible">
            <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <PlaneTakeoff className="h-4 w-4 text-pink-500" /> From
            </Label>
            <div className="relative">
              <input
                type="text"
                value={from}
                onFocus={() => setAirportSuggestions([])}
                onChange={onFromChange}
                placeholder="Departure city"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-sm"
              />
              <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              {airportSuggestions.length > 0 && from && (
                <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-32 overflow-y-auto z-10">
                  {airportSuggestions.map((ap, i) => (
                    <div
                      key={i}
                      className="px-4 py-2 hover:bg-pink-50 cursor-pointer"
                      onClick={() => {
                        setFrom(`${ap.city}, ${ap.iata}`);
                        setAirportSuggestions([]);
                      }}
                    >
                      <div className="text-sm font-medium">{ap.name} ({ap.iata})</div>
                      <div className="text-xs text-gray-500">{ap.city}, {ap.country}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Swap */}
          {flightType === "round-trip" && (
            <div className="lg:col-span-1 flex justify-center">
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
          <div className="lg:col-span-3 relative overflow-visible">
            <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <PlaneLanding className="h-4 w-4 text-pink-500" /> To
            </Label>
            <div className="relative">
              <input
                type="text"
                value={to}
                onFocus={() => setToAirportSuggestions([])}
                onChange={onToChange}
                placeholder="Destination city"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-sm"
              />
              <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              {toAirportSuggestions.length > 0 && to && (
                <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-32 overflow-y-auto z-10">
                  {toAirportSuggestions.map((ap, i) => (
                    <div
                      key={i}
                      className="px-4 py-2 hover:bg-pink-50 cursor-pointer"
                      onClick={() => {
                        setTo(`${ap.city}, ${ap.iata}`);
                        setToAirportSuggestions([]);
                      }}
                    >
                      <div className="text-sm font-medium">{ap.name} ({ap.iata})</div>
                      <div className="text-xs text-gray-500">{ap.city}, {ap.country}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Depart */}
          <div className="lg:col-span-2">
            <Label htmlFor="departure" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4 text-pink-500" /> Departure date
            </Label>
            <input
              type="date"
              id="departure"
              value={departDate ? departDate.toISOString().split('T')[0] : ''}
              onChange={e => setDepartDate(e.target.value ? new Date(e.target.value) : undefined)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Return */}
          {flightType === "round-trip" && (
            <div className="lg:col-span-2">
              <Label htmlFor="return" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 text-pink-500" /> Return date
              </Label>
              <input
                type="date"
                id="return"
                value={returnDate ? returnDate.toISOString().split('T')[0] : ''}
                onChange={e => setReturnDate(e.target.value ? new Date(e.target.value) : undefined)}
                min={(departDate || new Date()).toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
              />
            </div>
          )}
        </div>
      )}

      
      {/* Multi-city Legs */}
      {flightType === "multi-city" && (
        <div className="mt-6">
          {legs.map((leg, idx) => (
            <div key={idx} className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end mb-4">
              {/* From */}
              <div className="lg:col-span-3 relative overflow-visible">
                <Label htmlFor={`from-${idx}`} className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
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
                            updateLeg(idx, { from: `${ap.city}, ${ap.iata}` });
                            const s = [...legFromSuggestions];
                            s[idx] = [];
                            setLegFromSuggestions(s);
                          }}
                        >
                          <div className="text-sm font-medium">{ap.name} ({ap.iata})</div>
                          <div className="text-xs text-gray-500">{ap.city}, {ap.country}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Swap leg */}
              <div className="lg:col-span-1 flex justify-center">
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
              <div className="lg:col-span-3 relative overflow-visible">
                <Label htmlFor={`to-${idx}`} className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
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
                            updateLeg(idx, { to: `${ap.city}, ${ap.iata}` });
                            const s = [...legToSuggestions];
                            s[idx] = [];
                            setLegToSuggestions(s);
                          }}
                        >
                          <div className="text-sm font-medium">{ap.name} ({ap.iata})</div>
                          <div className="text-xs text-gray-500">{ap.city}, {ap.country}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/* Depart leg */}
              <div className="lg:col-span-2">
                <Label htmlFor={`leg-${idx}-date`} className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 text-pink-500" /> Departure date
                </Label>
                <input
                  type="date"
                  id={`leg-${idx}-date`}
                  value={leg.date ? leg.date.toISOString().split('T')[0] : ''}
                  onChange={e => onLegDateChange(idx, e.target.value ? new Date(e.target.value) : undefined)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Remove leg */}
              {idx > 0 && (
                <div className="lg:col-span-1 flex justify-center">
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
    <div className="lg:col-span-2 self-start flex justify-end whitespace-nowrap relative top-[-45px]">
      <button
        type="button"
        onClick={addLeg}
        disabled={legs.length >= MAX_LEGS}
        className={cn(
          "text-sm font-medium",
          legs.length >= MAX_LEGS
            ? "text-gray-400 cursor-not-allowed"
            : "text-pink-500 hover:underline"
        )}
      >
        {legs.length >= MAX_LEGS ? `Maximum ${MAX_LEGS} flights reached` : "Add Another Flight"}
      </button>
    </div>
    
  </div>
)}

      {/* Search button */}
      <div className="mt-6">
        <Button
          onClick={handleSearch}
          className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold shadow-lg hover:scale-105 transition"
        >
          <Search className="h-5 w-5 mr-2" /> Search
        </Button>
      </div>
    </div>
  );
}