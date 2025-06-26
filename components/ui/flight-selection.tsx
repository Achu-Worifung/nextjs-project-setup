"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import airports from "@/public/airports.json";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Search,
  Users,
  CalendarDays,
  PlaneLanding,
  PlaneTakeoff,
  ArrowLeftRight,
  MapPin,
} from "lucide-react";

type Airport = { name: string; city: string; country: string; iata: string; icao: string };
type Leg = { from: string; to: string; date?: Date };

export function FlightSelection() {
  const router = useRouter();

  // Global form state
  const [flightType, setFlightType] =
    useState<"one-way" | "round-trip" | "multi-city">("round-trip");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departDate, setDepartDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [travelers, setTravelers] = useState("1 Adult");


  const [airportSuggestions, setAirportSuggestions] = useState<Airport[]>([]);
  const [toAirportSuggestions, setToAirportSuggestions] = useState<Airport[]>([]);

  // Multi-city legs
  const [legs, setLegs] = useState<Leg[]>([{ from: "", to: "", date: undefined }]);
  const [legFromSuggestions, setLegFromSuggestions] = useState<Airport[][]>([[]]);
  const [legToSuggestions, setLegToSuggestions] = useState<Airport[][]>([[]]);

  // Search helper
  function findAirport(q: string): Airport[] {
    const query = q.toLowerCase();
    return airports
      .map((a) => {
        let score = 0;
        if (a.iata.toLowerCase() === query) score += 50;
        if (a.icao.toLowerCase() === query) score += 50;
        if (a.name.toLowerCase().includes(query)) score += 20;
        if (a.city.toLowerCase().includes(query)) score += 15;
        if (a.country.toLowerCase().includes(query)) score += 10;
        return { airport: a, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.airport);
  }

  // Single-leg handlers
  const onFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFrom(e.target.value);
    setAirportSuggestions(findAirport(e.target.value));
  };
  const onToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTo(e.target.value);
    setToAirportSuggestions(findAirport(e.target.value));
  };

  // Multi-city handlers
  function updateLeg(idx: number, data: Partial<Leg>) {
    setLegs((ls) => {
      const copy = [...ls];
      copy[idx] = { ...copy[idx], ...data };
      return copy;
    });
  }
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
  const onLegDateChange = (idx: number, date?: Date) => {
    updateLeg(idx, { date });
  };
  const addLeg = () => {
    setLegs((ls) => [...ls, { from: "", to: "", date: undefined }]);
    setLegFromSuggestions((s) => [...s, []]);
    setLegToSuggestions((s) => [...s, []]);
  };
  const removeLeg = (idx: number) => {
    setLegs((ls) => ls.filter((_, i) => i !== idx));
    setLegFromSuggestions((s) => s.filter((_, i) => i !== idx));
    setLegToSuggestions((s) => s.filter((_, i) => i !== idx));
  };

  // Swap single-leg
  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  // Final search
  const handleSearch = () => {
    const params = new URLSearchParams({
      flightType,
      from,
      to,
      departDate: departDate ? format(departDate, "yyyy-MM-dd") : "",
      returnDate: returnDate ? format(returnDate, "yyyy-MM-dd") : "",
      travelers,
      legs: flightType === "multi-city" ? JSON.stringify(legs) : "",
    });
    router.push(`/flight-search?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-6 pt-10">
      {/* Flight Type Selection */}
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
                flightType === val
                  ? "border-pink-500 bg-pink-50"
                  : "border-gray-200"
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
      
      <div className="mb-6 flex flex-col sm:flex-row sm:space-x-4">
  {/* Travelers */}
  <div className="flex-1">
    <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
      <Users className="h-4 w-4 text-pink-500" />
      Travelers
    </Label>
    <select
      value={travelers}
      onChange={(e) => setTravelers(e.target.value)}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-sm"
    >
      <option>1</option>
      <option>2</option>
      <option>3</option>
      <option>4</option>
    </select>
  </div>

  {/* Class */}
  <div className="flex-1 mt-4 sm:mt-0">
    <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
      <Users className="h-4 w-4 text-pink-500" />
      Class
    </Label>
    <select
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-sm"
    >
      <option>Economy</option>
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
                        setFrom(`${ap.iata}, ${ap.city}`);
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
                        setTo(`${ap.iata}, ${ap.city}`);
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
            <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <CalendarDays className="h-4 w-4 text-pink-500" /> Depart
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full text-left", !departDate && "text-muted-foreground")}
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {departDate ? format(departDate, "MMM dd, yyyy") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start">
                <Calendar
                  mode="single"
                  selected={departDate}
                  onSelect={setDepartDate}
                  disabled={(d) => d < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Return */}
          {flightType === "round-trip" && (
            <div className="lg:col-span-2">
              <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <CalendarDays className="h-4 w-4 text-pink-500" /> Return
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full text-left", !returnDate && "text-muted-foreground")}
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {returnDate ? format(returnDate, "MMM dd, yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start">
                  <Calendar
                    mode="single"
                    selected={returnDate}
                    onSelect={setReturnDate}
                    disabled={(d) => d < (departDate || new Date())}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      )}

      {/* Multi-city legs */}
      {flightType === "multi-city" && (
        <div className="mt-6">
          {legs.map((leg, idx) => (
            <div key={idx} className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end mb-4">
              {/* From */}
              <div className="lg:col-span-3 relative overflow-visible">
                <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <PlaneTakeoff className="h-4 w-4 text-pink-500" /> From
                </Label>
                <div className="relative">
                  <input
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
                            updateLeg(idx, { from: `${ap.iata}, ${ap.city}` });
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

              {/* Swap this leg */}
              <div className="lg:col-span-1 flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const copy = [...legs];
                    [copy[idx].from, copy[idx].to] = [copy[idx].to, copy[idx].from];
                    setLegs(copy);
                  }}
                  className="p-2 rounded-full border-2 border-pink-200 hover:border-pink-500 hover:bg-pink-50"
                >
                  <ArrowLeftRight className="h-4 w-4 text-pink-500" />
                </Button>
              </div>

              {/* To */}
              <div className="lg:col-span-3 relative overflow-visible">
                <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <PlaneLanding className="h-4 w-4 text-pink-500" /> To
                </Label>
                <div className="relative">
                  <input
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
                            updateLeg(idx, { to: `${ap.iata}, ${ap.city}` });
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

              {/* Depart this leg */}
              <div className="lg:col-span-2">
                <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <CalendarDays className="h-4 w-4 text-pink-500" /> Depart
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full text-left", !leg.date && "text-muted-foreground")}
                    >
                      <CalendarDays className="mr-2 h-4 w-4" />
                      {leg.date ? format(leg.date, "MMM dd, yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start">
                    <Calendar
                      mode="single"
                      selected={leg.date}
                      onSelect={(d) => onLegDateChange(idx, d)}
                      disabled={(d) => d < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Remove this leg */}
              {idx > 0 && (
                <div className="lg:col-span-1 flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeLeg(idx)}
                    className="p-2 rounded-full text-red-500 hover:bg-red-50"
                  >
                    ✕
                  </Button>
                </div>
              )}
            </div>
          ))}

          {/* Add another leg */}
          <div className="lg:col-span-12">
            <button
              type="button"
              className="text-sm font-medium text-pink-500 hover:underline"
              onClick={addLeg}
            >
              + Add Another Flight
            </button>
          </div>
        </div>
      )}

      {/* Final Search Button */}
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