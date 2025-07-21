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
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "./label";

import {
  Search,
  Users,
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
      setToError({
        isError: true,
        message: "Please enter a destination city.",
      });
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
      // legs: JSON.stringify(legs) , // Removed: 'legs' is not defined in this scope.
    });

    router.push(`/flight-search?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-white dark:bg-[rgb(25,30,36)] transition-all duration-300 p-0 sm:p-6 ">
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
        <div
          role="tablist" // Indicate that this is a tab list
          aria-label="Flight Type" // Label the tab list for screen readers
          className="inline-flex bg-brand-gray-100 dark:bg-[rgb(35,42,49)] rounded-lg p-1 shadow-sm dark:shadow-brand-dark"
        >
          {(["one-way", "round-trip"] as const).map((val) => (
            <button
              key={val}
              onClick={() => setFlightType(val)}
              // Add role="tab" to each button to indicate it's a tab
              role="tab"
              // Set aria-selected based on the current flightType state
              aria-selected={flightType === val}
              // Set aria-controls to link to the content controlled by this tab (if you had tab panels)
              // For this simple case, it might not be strictly necessary, but good practice.
              // aria-controls={`${val}-panel`}
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
      {/* Use a <form> tag to wrap your search inputs for better semantics */}
      <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="rounded-xl p-2 sm:p-6 mx-2 sm:mx-0 transition-all duration-300">
        {/* Switch to flex layout for horizontal row */}
        <div 
        className="flex flex-row flex-wrap gap-2 sm:gap-4 items-center w-full transition-all duration-500"
        >
          {/* From */}
          <div className="flex-1 min-w-[120px] relative transition-all duration-300" ref={fromDropdownRef}>
            <Label htmlFor="from-airport" className="sr-only">Departure Airport</Label> {/* Screen reader only label */}
            <div className="relative">
              <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10" aria-hidden="true"> {/* Add aria-hidden for decorative icons */}
                <PlaneTakeoff className="h-3 w-3 text-brand-pink-500" />
              </div>
              <input
                id="from-airport" // Link with label
                type="text"
                value={from}
                onFocus={() => {
                  setAirportSuggestions([]);
                  setFromError({ isError: false, message: "" });
                }}
                onChange={onFromChange}
                placeholder="From where?"
                className="w-full pl-8 pr-2 py-2 border border-brand-gray-200 dark:border-brand-gray-600 bg-white dark:bg-[rgb(25,30,36)] rounded-md focus:ring-2 focus:ring-brand-pink-500 focus:border-brand-pink-500 text-xs font-medium shadow-sm hover:shadow-md dark:hover:shadow-brand-dark transition-all duration-200 dark:text-white dark:placeholder-brand-gray-400"
                aria-autocomplete="list" // Indicate autocomplete functionality
                aria-controls="from-suggestions" // Link to the suggestions list
                aria-describedby={fromError.isError ? "from-error-message" : undefined} // Link to error message
              />
              {fromError.isError && (
                <p id="from-error-message" role="alert" className="text-xs text-brand-error mt-1"> {/* role="alert" for immediate announcement */}
                  {fromError.message}
                </p>
              )}
            </div>
            {airportSuggestions.length > 0 && from && (
              <div
                id="from-suggestions" // ID for aria-controls
                role="listbox" // Indicate this is a list of options
                className="absolute top-full left-0 w-full bg-white dark:bg-[rgb(25,30,36)] border border-brand-gray-200 dark:border-brand-gray-600 rounded-lg shadow-xl dark:shadow-brand-dark-lg mt-1 max-h-48 overflow-y-auto z-50"
              >
                {airportSuggestions.map((ap, i) => (
                  <div
                    key={i}
                    // Add role="option" for each suggestion
                    role="option"
                    // Set aria-selected if it's the currently focused/selected option (if you implement keyboard navigation)
                    // aria-selected={someCondition}
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
              aria-label="Swap departure and destination airports" // Descriptive label for screen readers
            >
              <ArrowLeftRight className="h-3 w-3 text-brand-pink-500 dark:text-brand-pink-400" aria-hidden="true" />
            </button>
          </div>

          {/* To */}
          <div className="flex-1 min-w-[120px] relative transition-all duration-300" ref={toDropdownRef}>
            <Label htmlFor="to-airport" className="sr-only">Destination Airport</Label> {/* Screen reader only label */}
            <div className="relative">
              <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10" aria-hidden="true">
                <PlaneLanding className="h-3 w-3 text-brand-pink-500" />
              </div>
              <input
                id="to-airport" // Link with label
                type="text"
                value={to}
                onFocus={() => {
                  setToAirportSuggestions([]);
                  setToError({ isError: false, message: "" });
                }}
                onChange={onToChange}
                placeholder="To where?"
                className="w-full pl-8 pr-2 py-2 border border-brand-gray-200 dark:border-brand-gray-600 bg-white dark:bg-[rgb(25,30,36)] rounded-md focus:ring-2 focus:ring-brand-pink-500 focus:border-brand-pink-500 text-xs font-medium shadow-sm hover:shadow-md dark:hover:shadow-brand-dark transition-all duration-200 dark:text-white dark:placeholder-brand-gray-400"
                aria-autocomplete="list"
                aria-controls="to-suggestions"
                aria-describedby={toError.isError ? "to-error-message" : undefined}
              />
              {toError.isError && (
                <p id="to-error-message" role="alert" className="text-xs text-brand-error mt-1">
                  {toError.message}
                </p>
              )}
            </div>
            {toAirportSuggestions.length > 0 && to && (
              <div
                id="to-suggestions"
                role="listbox"
                className="absolute top-full left-0 w-full bg-white border border-brand-gray-200 rounded-lg shadow-xl mt-1 max-h-48 overflow-y-auto z-50"
              >
                {toAirportSuggestions.map((ap, i) => (
                  <div
                    key={i}
                    role="option"
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
              <Label htmlFor="depart-date" className="sr-only">Departure Date</Label>
              {!departDate && (
                <span className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 pointer-events-none text-xs" aria-hidden="true"> {/* Decorative placeholder, hide from screen readers */}
                  Departure date
                </span>
              )}
              <input
                id="depart-date" // Link with label
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
                aria-describedby={departDateError.isError ? "depart-date-error-message" : undefined}
              />
              {departDateError.isError && (
                <p id="depart-date-error-message" role="alert" className="text-xs text-brand-error mt-1">
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
              {flightType === "round-trip" && (
                <>
                  <Label htmlFor="return-date" className="sr-only">Return Date</Label>
                  {!returnDate && (
                    <span className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 pointer-events-none text-xs" aria-hidden="true">
                      Return date
                    </span>
                  )}
                  <input
                    id="return-date" // Link with label
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
                    aria-describedby={returnDateError.isError ? "return-date-error-message" : undefined}
                  />
                  {returnDateError.isError && (
                    <p id="return-date-error-message" role="alert" className="text-xs text-brand-error mt-1">
                      {returnDateError.message}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Search Button - Desktop Only */}
          <div className="hidden lg:block flex-none" style={{ minWidth: 120 }}>
            <Button
              type="submit" // Set type to submit for form
              onClick={handleSearch}
              className="w-full max-w-sm bg-pink-500 hover:bg-pink-600 dark:bg-pink-400 dark:hover:bg-pink-500 text-white font-semibold py-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Search className="h-4 w-4 mr-2" aria-hidden="true" />
              Search
            </Button>
          </div>

          {/* Remove search button from round-trip inline position */}
        </div>

        <div className="flex flex-wrap justify-center gap-4 px-4 sm:px-0 items-baseline">
          {/* Adults */}
          <div
            data-testid="passenger-adults"
            role="group"
            aria-label="Adult passengers"
            className="flex flex-col items-center rounded-lg px-4 py-2 "
          >
            <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2 justify-center sm:justify-start pt-10">
              <Users className="h-4 w-4 text-pink-500" aria-hidden="true" /> Adults
            </Label>
            <div className="flex items-center rounded-lg px-4 py-2 ">
              {/* <span className="sr-only">Adults</span> Removed as the Label already provides context */}
              <button
                type="button"
                data-testid="adults-decrement"
                disabled={counts.adults <= 1}
                onClick={() => dec("adults")}
                className="size-8 rounded-full bg-white dark:bg-[rgb(25,30,36)] border border-brand-gray-300 dark:border-brand-gray-600 flex items-center justify-center text-xs hover:bg-brand-gray-100 dark:hover:bg-[rgb(35,42,49)] text-brand-gray-700 dark:text-brand-gray-300 transition-all duration-200 shadow-sm dark:shadow-brand-dark"
                aria-label="Decrease adult count"
              >
                −
              </button>
              <span
                data-testid="adults-count"
                className="w-8 text-center text-sm"
                aria-live="polite" // Announce changes to this number
                aria-atomic="true" // Announce the entire element content
              >
                {counts.adults}
              </span>
              <button
                type="button"
                data-testid="adults-increment"
                onClick={() => inc("adults")}
                className="size-8 rounded-full bg-white dark:bg-[rgb(25,30,36)] border border-brand-gray-300 dark:border-brand-gray-600 flex items-center justify-center text-xs hover:bg-brand-gray-100 dark:hover:bg-[rgb(35,42,49)] text-brand-gray-700 dark:text-brand-gray-300 transition-all duration-200 shadow-sm dark:shadow-brand-dark"
                aria-label="Increase adult count"
              >
                +
              </button>
              {/* <span className="sr-only">Adults</span> Removed */}
            </div>
          </div>

          {/* Children */}
          <div
            data-testid="passenger-children"
            role="group"
            aria-label="Child passengers"
            className="flex items-center rounded-lg px-4 py-2 flex-col"
          >
            <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2 justify-center sm:justify-start">
              <Users className="h-4 w-4 text-pink-500" aria-hidden="true" /> Children
            </Label>
            <div className="flex items-center justify-center sm:justify-start space-x-4">
              {/* <span className="sr-only">Children</span> Removed */}
              <button
                onClick={() => dec("children")} // Should be dec("children")
                disabled={counts.children <= 0} // Children can be 0
                className="size-8 rounded-full bg-white dark:bg-[rgb(25,30,36)] border border-brand-gray-300 dark:border-brand-gray-600 flex items-center justify-center text-xs hover:bg-brand-gray-100 dark:hover:bg-[rgb(35,42,49)] disabled:opacity-50 text-brand-gray-700 dark:text-brand-gray-300 transition-all duration-200 shadow-sm dark:shadow-brand-dark"
                aria-label="Decrease child count"
              >
                −
              </button>
              <span
                className="text-sm font-medium px-2 text-brand-gray-700 dark:text-brand-gray-300"
                aria-live="polite"
                aria-atomic="true"
              >
                {counts.children} {/* Changed to counts.children */}
              </span>
              <button
                onClick={() => inc("children")} // Should be inc("children")
                className="size-8 rounded-full bg-white dark:bg-[rgb(25,30,36)] border border-brand-gray-300 dark:border-brand-gray-600 flex items-center justify-center text-xs hover:bg-brand-gray-100 dark:hover:bg-[rgb(35,42,49)] text-brand-gray-700 dark:text-brand-gray-300 transition-all duration-200 shadow-sm dark:shadow-brand-dark"
                aria-label="Increase child count"
              >
                +
              </button>
              {/* <span className="sr-only">Children</span> Removed */}
            </div>
          </div>

          {/* Class */}
          <div className="flex items-center rounded-lg px-4 py-2 flex-col">
            <Label htmlFor="class-type" className="text-sm font-medium mr-3 text-brand-gray-700 dark:text-brand-gray-300 sm:self-start">
              Class:
            </Label>
            <div className="relative">
              <select
                id="class-type" // Link with label
                value={classType}
                onChange={(e) => setClassType(e.target.value)}
                className="bg-white dark:bg-[rgb(25,30,36)] border border-brand-gray-200 dark:border-brand-gray-600 rounded-md px-3 py-1.5 text-sm font-medium text-pink-600 dark:text-pink-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none appearance-none pr-8 min-w-[120px] shadow-sm dark:shadow-brand-dark transition-all duration-200"
                aria-describedby="class-type-description" // Optional: add a description if needed
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
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
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
          </div>
        </div>
      </form> {/* Close the form tag here */}

      {/* Search Button for All Flight Types - Mobile Only (After Passenger Controls) */}
      <div className="lg:hidden px-4 sm:px-0 flex justify-center">
        <Button
          type="submit" // Set type to submit for form
          onClick={handleSearch}
          className="w-full max-w-sm bg-pink-500 hover:bg-pink-600 dark:bg-pink-400 dark:hover:bg-pink-500 text-white font-semibold py-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Search className="h-4 w-4 mr-2" aria-hidden="true" />
          {flightType === "one-way"
            ? "Search Flights"
            : "Search Round-Trip Flights"}
        </Button>
      </div>
    </div>
  );
}