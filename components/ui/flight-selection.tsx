"use client";

import React, { useState, useTransition, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
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
  TicketsPlane,
} from "lucide-react";

type Airport = {
  name: string;
  city: string;
  country: string;
  iata: string;
  icao: string;
};
type Leg = { from: string; to: string; date?: Date };

// Major International Airports Database
const airports: Airport[] = [
  // United States
  { name: "John F. Kennedy International Airport", city: "New York", country: "United States", iata: "JFK", icao: "KJFK" },
  { name: "Los Angeles International Airport", city: "Los Angeles", country: "United States", iata: "LAX", icao: "KLAX" },
  { name: "Chicago O'Hare International Airport", city: "Chicago", country: "United States", iata: "ORD", icao: "KORD" },
  { name: "Miami International Airport", city: "Miami", country: "United States", iata: "MIA", icao: "KMIA" },
  { name: "San Francisco International Airport", city: "San Francisco", country: "United States", iata: "SFO", icao: "KSFO" },
  { name: "Seattle-Tacoma International Airport", city: "Seattle", country: "United States", iata: "SEA", icao: "KSEA" },
  { name: "Denver International Airport", city: "Denver", country: "United States", iata: "DEN", icao: "KDEN" },
  { name: "Dallas/Fort Worth International Airport", city: "Dallas", country: "United States", iata: "DFW", icao: "KDFW" },
  { name: "Atlanta Hartsfield-Jackson International Airport", city: "Atlanta", country: "United States", iata: "ATL", icao: "KATL" },
  { name: "Boston Logan International Airport", city: "Boston", country: "United States", iata: "BOS", icao: "KBOS" },
  { name: "Newark Liberty International Airport", city: "Newark", country: "United States", iata: "EWR", icao: "KEWR" },
  { name: "Washington Dulles International Airport", city: "Washington", country: "United States", iata: "IAD", icao: "KIAD" },
  { name: "LaGuardia Airport", city: "New York", country: "United States", iata: "LGA", icao: "KLGA" },
  { name: "Phoenix Sky Harbor International Airport", city: "Phoenix", country: "United States", iata: "PHX", icao: "KPHX" },
  { name: "Las Vegas McCarran International Airport", city: "Las Vegas", country: "United States", iata: "LAS", icao: "KLAS" },
  
  // United Kingdom
  { name: "London Heathrow Airport", city: "London", country: "United Kingdom", iata: "LHR", icao: "EGLL" },
  { name: "London Gatwick Airport", city: "London", country: "United Kingdom", iata: "LGW", icao: "EGKK" },
  { name: "London Stansted Airport", city: "London", country: "United Kingdom", iata: "STN", icao: "EGSS" },
  { name: "Manchester Airport", city: "Manchester", country: "United Kingdom", iata: "MAN", icao: "EGCC" },
  { name: "Edinburgh Airport", city: "Edinburgh", country: "United Kingdom", iata: "EDI", icao: "EGPH" },
  { name: "Birmingham Airport", city: "Birmingham", country: "United Kingdom", iata: "BHX", icao: "EGBB" },
  
  // Canada
  { name: "Toronto Pearson International Airport", city: "Toronto", country: "Canada", iata: "YYZ", icao: "CYYZ" },
  { name: "Vancouver International Airport", city: "Vancouver", country: "Canada", iata: "YVR", icao: "CYVR" },
  { name: "Montreal-Pierre Elliott Trudeau International Airport", city: "Montreal", country: "Canada", iata: "YUL", icao: "CYUL" },
  { name: "Calgary International Airport", city: "Calgary", country: "Canada", iata: "YYC", icao: "CYYC" },
  
  // Germany
  { name: "Frankfurt Airport", city: "Frankfurt", country: "Germany", iata: "FRA", icao: "EDDF" },
  { name: "Munich Airport", city: "Munich", country: "Germany", iata: "MUC", icao: "EDDM" },
  { name: "Berlin Brandenburg Airport", city: "Berlin", country: "Germany", iata: "BER", icao: "EDDB" },
  { name: "Hamburg Airport", city: "Hamburg", country: "Germany", iata: "HAM", icao: "EDDH" },
  { name: "Düsseldorf Airport", city: "Düsseldorf", country: "Germany", iata: "DUS", icao: "EDDL" },
  
  // France
  { name: "Charles de Gaulle Airport", city: "Paris", country: "France", iata: "CDG", icao: "LFPG" },
  { name: "Orly Airport", city: "Paris", country: "France", iata: "ORY", icao: "LFPO" },
  { name: "Nice Côte d'Azur Airport", city: "Nice", country: "France", iata: "NCE", icao: "LFMN" },
  { name: "Lyon-Saint Exupéry Airport", city: "Lyon", country: "France", iata: "LYS", icao: "LFLL" },
  
  // Spain
  { name: "Madrid-Barajas Airport", city: "Madrid", country: "Spain", iata: "MAD", icao: "LEMD" },
  { name: "Barcelona-El Prat Airport", city: "Barcelona", country: "Spain", iata: "BCN", icao: "LEBL" },
  { name: "Palma de Mallorca Airport", city: "Palma", country: "Spain", iata: "PMI", icao: "LESB" },
  { name: "Málaga Airport", city: "Málaga", country: "Spain", iata: "AGP", icao: "LEMG" },
  
  // Italy
  { name: "Rome Fiumicino Airport", city: "Rome", country: "Italy", iata: "FCO", icao: "LIRF" },
  { name: "Milan Malpensa Airport", city: "Milan", country: "Italy", iata: "MXP", icao: "LIMC" },
  { name: "Venice Marco Polo Airport", city: "Venice", country: "Italy", iata: "VCE", icao: "LIPZ" },
  { name: "Naples International Airport", city: "Naples", country: "Italy", iata: "NAP", icao: "LIRN" },
  
  // Netherlands
  { name: "Amsterdam Airport Schiphol", city: "Amsterdam", country: "Netherlands", iata: "AMS", icao: "EHAM" },
  
  // Switzerland
  { name: "Zurich Airport", city: "Zurich", country: "Switzerland", iata: "ZUR", icao: "LSZH" },
  { name: "Geneva Airport", city: "Geneva", country: "Switzerland", iata: "GVA", icao: "LSGG" },
  
  // Austria
  { name: "Vienna International Airport", city: "Vienna", country: "Austria", iata: "VIE", icao: "LOWW" },
  
  // Belgium
  { name: "Brussels Airport", city: "Brussels", country: "Belgium", iata: "BRU", icao: "EBBR" },
  
  // Japan
  { name: "Tokyo Haneda Airport", city: "Tokyo", country: "Japan", iata: "HND", icao: "RJTT" },
  { name: "Tokyo Narita International Airport", city: "Tokyo", country: "Japan", iata: "NRT", icao: "RJAA" },
  { name: "Osaka Kansai International Airport", city: "Osaka", country: "Japan", iata: "KIX", icao: "RJBB" },
  { name: "Nagoya Chubu Centrair International Airport", city: "Nagoya", country: "Japan", iata: "NGO", icao: "RJGG" },
  
  // China
  { name: "Beijing Capital International Airport", city: "Beijing", country: "China", iata: "PEK", icao: "ZBAA" },
  { name: "Shanghai Pudong International Airport", city: "Shanghai", country: "China", iata: "PVG", icao: "ZSPD" },
  { name: "Guangzhou Baiyun International Airport", city: "Guangzhou", country: "China", iata: "CAN", icao: "ZGGG" },
  { name: "Shenzhen Bao'an International Airport", city: "Shenzhen", country: "China", iata: "SZX", icao: "ZGSZ" },
  
  // Hong Kong
  { name: "Hong Kong International Airport", city: "Hong Kong", country: "Hong Kong", iata: "HKG", icao: "VHHH" },
  
  // Singapore
  { name: "Singapore Changi Airport", city: "Singapore", country: "Singapore", iata: "SIN", icao: "WSSS" },
  
  // South Korea
  { name: "Seoul Incheon International Airport", city: "Seoul", country: "South Korea", iata: "ICN", icao: "RKSI" },
  { name: "Seoul Gimpo International Airport", city: "Seoul", country: "South Korea", iata: "GMP", icao: "RKSS" },
  
  // India
  { name: "Delhi Indira Gandhi International Airport", city: "Delhi", country: "India", iata: "DEL", icao: "VIDP" },
  { name: "Mumbai Chhatrapati Shivaji International Airport", city: "Mumbai", country: "India", iata: "BOM", icao: "VABB" },
  { name: "Bangalore Kempegowda International Airport", city: "Bangalore", country: "India", iata: "BLR", icao: "VOBL" },
  { name: "Chennai International Airport", city: "Chennai", country: "India", iata: "MAA", icao: "VOMM" },
  
  // Australia
  { name: "Sydney Kingsford Smith Airport", city: "Sydney", country: "Australia", iata: "SYD", icao: "YSSY" },
  { name: "Melbourne Airport", city: "Melbourne", country: "Australia", iata: "MEL", icao: "YMML" },
  { name: "Brisbane Airport", city: "Brisbane", country: "Australia", iata: "BNE", icao: "YBBN" },
  { name: "Perth Airport", city: "Perth", country: "Australia", iata: "PER", icao: "YPPH" },
  
  // New Zealand
  { name: "Auckland Airport", city: "Auckland", country: "New Zealand", iata: "AKL", icao: "NZAA" },
  { name: "Christchurch Airport", city: "Christchurch", country: "New Zealand", iata: "CHC", icao: "NZCH" },
  
  // Middle East
  { name: "Dubai International Airport", city: "Dubai", country: "United Arab Emirates", iata: "DXB", icao: "OMDB" },
  { name: "Abu Dhabi International Airport", city: "Abu Dhabi", country: "United Arab Emirates", iata: "AUH", icao: "OMAA" },
  { name: "Doha Hamad International Airport", city: "Doha", country: "Qatar", iata: "DOH", icao: "OTHH" },
  { name: "Kuwait International Airport", city: "Kuwait City", country: "Kuwait", iata: "KWI", icao: "OKKK" },
  { name: "King Abdulaziz International Airport", city: "Jeddah", country: "Saudi Arabia", iata: "JED", icao: "OEJN" },
  { name: "King Khalid International Airport", city: "Riyadh", country: "Saudi Arabia", iata: "RUH", icao: "OERK" },
  { name: "Tel Aviv Ben Gurion Airport", city: "Tel Aviv", country: "Israel", iata: "TLV", icao: "LLBG" },
  
  // Turkey
  { name: "Istanbul Airport", city: "Istanbul", country: "Turkey", iata: "IST", icao: "LTFM" },
  { name: "Sabiha Gökçen International Airport", city: "Istanbul", country: "Turkey", iata: "SAW", icao: "LTFJ" },
  { name: "Ankara Esenboğa Airport", city: "Ankara", country: "Turkey", iata: "ESB", icao: "LTAC" },
  
  // Russia
  { name: "Moscow Sheremetyevo International Airport", city: "Moscow", country: "Russia", iata: "SVO", icao: "UUEE" },
  { name: "Moscow Domodedovo Airport", city: "Moscow", country: "Russia", iata: "DME", icao: "UUDD" },
  { name: "St. Petersburg Pulkovo Airport", city: "St. Petersburg", country: "Russia", iata: "LED", icao: "ULLI" },
  
  // Brazil
  { name: "São Paulo-Guarulhos International Airport", city: "São Paulo", country: "Brazil", iata: "GRU", icao: "SBGR" },
  { name: "Rio de Janeiro-Galeão International Airport", city: "Rio de Janeiro", country: "Brazil", iata: "GIG", icao: "SBGL" },
  { name: "Brasília International Airport", city: "Brasília", country: "Brazil", iata: "BSB", icao: "SBBR" },
  
  // Mexico
  { name: "Mexico City International Airport", city: "Mexico City", country: "Mexico", iata: "MEX", icao: "MMMX" },
  { name: "Cancún International Airport", city: "Cancún", country: "Mexico", iata: "CUN", icao: "MMUN" },
  { name: "Guadalajara International Airport", city: "Guadalajara", country: "Mexico", iata: "GDL", icao: "MMGL" },
  
  // South Africa
  { name: "Cape Town International Airport", city: "Cape Town", country: "South Africa", iata: "CPT", icao: "FACT" },
  { name: "Johannesburg OR Tambo International Airport", city: "Johannesburg", country: "South Africa", iata: "JNB", icao: "FAJS" },
  
  // Egypt
  { name: "Cairo International Airport", city: "Cairo", country: "Egypt", iata: "CAI", icao: "HECA" },
  
  // Thailand
  { name: "Bangkok Suvarnabhumi Airport", city: "Bangkok", country: "Thailand", iata: "BKK", icao: "VTBS" },
  { name: "Bangkok Don Mueang International Airport", city: "Bangkok", country: "Thailand", iata: "DMK", icao: "VTBD" },
  { name: "Phuket International Airport", city: "Phuket", country: "Thailand", iata: "HKT", icao: "VTSP" },
  
  // Malaysia
  { name: "Kuala Lumpur International Airport", city: "Kuala Lumpur", country: "Malaysia", iata: "KUL", icao: "WMKK" },
  
  // Indonesia
  { name: "Jakarta Soekarno-Hatta International Airport", city: "Jakarta", country: "Indonesia", iata: "CGK", icao: "WIII" },
  { name: "Bali Ngurah Rai International Airport", city: "Denpasar", country: "Indonesia", iata: "DPS", icao: "WADD" },
  
  // Philippines
  { name: "Manila Ninoy Aquino International Airport", city: "Manila", country: "Philippines", iata: "MNL", icao: "RPLL" },
  { name: "Cebu Mactan-Cebu International Airport", city: "Cebu", country: "Philippines", iata: "CEB", icao: "RPVM" },
  
  // Vietnam
  { name: "Ho Chi Minh City Tan Son Nhat International Airport", city: "Ho Chi Minh City", country: "Vietnam", iata: "SGN", icao: "VVTS" },
  { name: "Hanoi Noi Bai International Airport", city: "Hanoi", country: "Vietnam", iata: "HAN", icao: "VVNB" },
  
  // Norway
  { name: "Oslo Gardermoen Airport", city: "Oslo", country: "Norway", iata: "OSL", icao: "ENGM" },
  
  // Sweden
  { name: "Stockholm Arlanda Airport", city: "Stockholm", country: "Sweden", iata: "ARN", icao: "ESSA" },
  
  // Denmark
  { name: "Copenhagen Airport", city: "Copenhagen", country: "Denmark", iata: "CPH", icao: "EKCH" },
  
  // Finland
  { name: "Helsinki-Vantaa Airport", city: "Helsinki", country: "Finland", iata: "HEL", icao: "EFHK" },
  
  // Poland
  { name: "Warsaw Chopin Airport", city: "Warsaw", country: "Poland", iata: "WAW", icao: "EPWA" },
  { name: "Krakow John Paul II International Airport", city: "Krakow", country: "Poland", iata: "KRK", icao: "EPKK" },
  
  // Czech Republic
  { name: "Prague Václav Havel Airport", city: "Prague", country: "Czech Republic", iata: "PRG", icao: "LKPR" },
  
  // Hungary
  { name: "Budapest Ferenc Liszt International Airport", city: "Budapest", country: "Hungary", iata: "BUD", icao: "LHBP" },
  
  // Greece
  { name: "Athens Eleftherios Venizelos International Airport", city: "Athens", country: "Greece", iata: "ATH", icao: "LGAV" },
  
  // Portugal
  { name: "Lisbon Portela Airport", city: "Lisbon", country: "Portugal", iata: "LIS", icao: "LPPT" },
  { name: "Porto Airport", city: "Porto", country: "Portugal", iata: "OPO", icao: "LPPR" },
  
  // Argentina
  { name: "Buenos Aires Ezeiza International Airport", city: "Buenos Aires", country: "Argentina", iata: "EZE", icao: "SAEZ" },
  
  // Chile
  { name: "Santiago Arturo Merino Benítez International Airport", city: "Santiago", country: "Chile", iata: "SCL", icao: "SCEL" },
  
  // Colombia
  { name: "Bogotá El Dorado International Airport", city: "Bogotá", country: "Colombia", iata: "BOG", icao: "SKBO" },
  
  // Peru
  { name: "Lima Jorge Chávez International Airport", city: "Lima", country: "Peru", iata: "LIM", icao: "SPJC" },
  
  // Kenya
  { name: "Nairobi Jomo Kenyatta International Airport", city: "Nairobi", country: "Kenya", iata: "NBO", icao: "HKJK" },
  
  // Nigeria
  { name: "Lagos Murtala Muhammed International Airport", city: "Lagos", country: "Nigeria", iata: "LOS", icao: "DNMM" },
  
  // Morocco
  { name: "Casablanca Mohammed V International Airport", city: "Casablanca", country: "Morocco", iata: "CMN", icao: "GMMN" },
];

export function FlightSelection() {
  const router = useRouter();
  const MAX_LEGS = 5;
  
  // Use transition for non-blocking updates
  const [isPending, startTransition] = useTransition();

  // Flight type
  const [flightType, setFlightType] = useState<
    "one-way" | "round-trip" | "multi-city"
  >("round-trip");

  // Single-leg inputs
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departDate, setDepartDate] = useState<Date | undefined>(undefined);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);

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
  const onFromChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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
  }, [findAirport, startTransition]);
  
  const onToChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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
  }, [findAirport, startTransition]);

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
  const handleSearch = () => {
    // Helper function to validate if an airport input matches our database
    const validateAirport = (input: string, suggestions: Airport[]): Airport | null => {
      if (!input.trim()) return null;
      
      // Check if the input matches any suggestion exactly
      const exactMatch = suggestions.find(airport => 
        `${airport.name}, ${airport.city}` === input ||
        `${airport.city}, ${airport.iata}` === input ||
        airport.iata === input.toUpperCase() ||
        airport.icao === input.toUpperCase()
      );
      
      if (exactMatch) return exactMatch;
      
      // Check if the input matches any airport in our database
      const dbMatch = airports.find(airport => 
        airport.iata.toLowerCase() === input.toLowerCase() ||
        airport.icao.toLowerCase() === input.toLowerCase() ||
        airport.name.toLowerCase() === input.toLowerCase() ||
        airport.city.toLowerCase() === input.toLowerCase() ||
        `${airport.city}, ${airport.iata}`.toLowerCase() === input.toLowerCase() ||
        `${airport.name}, ${airport.city}`.toLowerCase() === input.toLowerCase()
      );
      
      return dbMatch || null;
    };

    // Reset all errors
    setFromError({ isError: false, message: "" });
    setToError({ isError: false, message: "" });
    setDepartDateError({ isError: false, message: "" });
    setReturnDateError({ isError: false, message: "" });

    // Validate departure airport
    if (!from) {
      setFromError({ isError: true, message: "Please enter a departure city." });
      return;
    }
    
    const fromAirport = validateAirport(from, airportSuggestions);
    if (!fromAirport) {
      setFromError({ isError: true, message: "Please enter a valid departure city." });
      return;
    }

    // Validate destination airport
    if (!to) {
      setToError({ isError: true, message: "Please enter a destination city." });
      return;
    }
    
    const toAirport = validateAirport(to, toAirportSuggestions);
    if (!toAirport) {
      setToError({ isError: true, message: "Please enter a valid destination city." });
      return;
    }

    // Check if departure and destination are the same
    if (fromAirport.iata === toAirport.iata) {
      setToError({ isError: true, message: "Departure and destination cannot be the same." });
      return;
    }

    // Validate departure date
    if (!departDate) {
      setDepartDateError({ isError: true, message: "Please select a departure date." });
      return;
    }

    // Validate return date for round trips
    if (flightType === 'round-trip') {
      if (!returnDate) {
        setReturnDateError({ isError: true, message: "Please select a return date." });
        return;
      }
      
      // Check if return date is after departure date
      if (returnDate <= departDate) {
        setReturnDateError({ isError: true, message: "Return date must be after departure date." });
        return;
      }
    }

    // Validate multi-city legs
    if (flightType === 'multi-city') {
      for (let i = 0; i < legs.length; i++) {
        const leg = legs[i];
        
        if (!leg.from) {
          // Focus on the specific leg with error
          setFromError({ isError: true, message: `Please enter departure city for flight ${i + 1}.` });
          return;
        }
        
        if (!leg.to) {
          setToError({ isError: true, message: `Please enter destination city for flight ${i + 1}.` });
          return;
        }
        
        if (!leg.date) {
          setDepartDateError({ isError: true, message: `Please select date for flight ${i + 1}.` });
          return;
        }
        
        // Validate that leg airports exist in our database
        const legFromAirport = validateAirport(leg.from, legFromSuggestions[i] || []);
        const legToAirport = validateAirport(leg.to, legToSuggestions[i] || []);
        
        if (!legFromAirport) {
          setFromError({ isError: true, message: `Invalid departure city for flight ${i + 1}.` });
          return;
        }
        
        if (!legToAirport) {
          setToError({ isError: true, message: `Invalid destination city for flight ${i + 1}.` });
          return;
        }
        
        if (legFromAirport.iata === legToAirport.iata) {
          setToError({ isError: true, message: `Departure and destination cannot be the same for flight ${i + 1}.` });
          return;
        }
      }
    }

    // Format standardized airport names for URL
    const standardizedFrom = `${fromAirport.city}, ${fromAirport.iata}`;
    const standardizedTo = `${toAirport.city}, ${toAirport.iata}`;

    // Update the form fields with standardized values
    setFrom(standardizedFrom);
    setTo(standardizedTo);

    // Format the dates
    const ddate = departDate ? departDate.toISOString().split('T')[0] : "";
    const rdate = returnDate ? returnDate.toISOString().split('T')[0] : "";
    
    const params = new URLSearchParams({
      flightType,
      from: standardizedFrom,
      to: standardizedTo,
      departDate: ddate,
      returnDate: rdate,
      travelers: `${counts.adults} Adult${counts.adults > 1 ? "s" : ""}`,
      classType,
      legs: flightType === "multi-city" ? JSON.stringify(legs) : "",
    });
    
    router.push(`/flight-search?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 pt-6 sm:pt-10">
      {/* Flight Types */}
      <div className="mb-2">
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

          <div className="mb-2 flex flex-col sm:flex-row sm:items-end justify-center gap-10 w-full">

        {/* Adults */}
        <div
          data-testid="passenger-adults"
          role="group"
          aria-label="Adult passengers"
          className="mb-2 min-w-0"
        >
          <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2 justify-center sm:justify-start pt-10">
            <Users className="h-4 w-4 text-pink-500" /> Adults
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
          className="mb-2 min-w-0"
        >
          <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2 justify-center sm:justify-start">
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
        <div className="mb-2 min-w-0 justify-center sm:min-w-[250px]">
          <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <TicketsPlane className="h-4 w-4 text-pink-500" /> Class
          </Label>
          <select
            value={classType}
            onChange={(e) => setClassType(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-sm text-center"
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
  flightType === "one-way" ? (
    // —— ONE-WAY: 3-column flex layout ——
    <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row md:justify-center gap-4 items-end">
      {/* From */}
      <div className="flex-1 min-w-0 relative overflow-visible">
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
          <MapPin
            className={`absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 ${
              isPending ? "animate-pulse text-pink-500" : "text-gray-400"
            }`}
          />
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

      {/* To */}
      <div className="flex-1 min-w-0 relative overflow-visible">
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
          <MapPin
            className={`absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 ${
              isPending ? "animate-pulse text-pink-500" : "text-gray-400"
            }`}
          />
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

      {/* Departure */}
      <div className="flex-1 min-w-0">
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
              <p className="text-sm text-red-500">{departDateError.message}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  ) : (
    // —— ROUND-TRIP: 5-column grid layout ——
    <div className="border-t border-gray-200 pt-6 grid grid-cols-1 md:grid-cols-5 lg:grid-cols-12 gap-4 items-end">
      {/* From */}
      <div className="relative overflow-visible md:col-span-1 lg:col-span-3">
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
          <MapPin
            className={`absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 ${
              isPending ? "animate-pulse text-pink-500" : "text-gray-400"
            }`}
          />
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

      {/* Swap (desktop) */}
      <div className="hidden md:flex md:col-span-1 lg:col-span-1 justify-center">
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

      {/* Swap (mobile) */}
      <div className="md:hidden flex justify-center">
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

      {/* To */}
      <div className="relative overflow-visible md:col-span-1 lg:col-span-3">
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
          <MapPin
            className={`absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 ${
              isPending ? "animate-pulse text-pink-500" : "text-gray-400"
            }`}
          />
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

      {/* Departure */}
      <div className="md:col-span-1 lg:col-span-2">
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
                value={departDate ? departDate.toISOString().split("T")[0] : ""}
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
              <p className="text-sm text-red-500">{departDateError.message}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Return */}
      <div className="md:col-span-1 lg:col-span-2">
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
    </div>
  )
)}

{/* Multi-city Legs */}
{flightType === "multi-city" && (
  <div className="border-t border-gray-200 pt-6">
    {legs.map((leg, idx) => (
      <div
        key={idx}
        className="grid grid-cols-1 sm:grid-cols-5 lg:grid-cols-12 gap-4 items-end mb-4"
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
                      updateLeg(idx, { from: `${ap.city}, ${ap.iata}` });
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
                      updateLeg(idx, { to: `${ap.city}, ${ap.iata}` });
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
              ×
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
      <div 
      id="search-hotels-button"
      className="flex justify-center mt-8">
        <button
        id="search-hotels-button"
          className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-8 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
          onClick={() => {
            handleSearch();
          }}
        >
          Search Available Flights
        </button>
      </div>
    </div>
  );
}