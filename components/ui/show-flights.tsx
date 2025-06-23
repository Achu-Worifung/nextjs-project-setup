'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import FlightSearchFormCompact from './flight-search-form-compact';
import FlightFilters from './flight-filters';
import FlightsList from './flights-list';
import { Flight, tempFlightData } from '@/lib/flight-data';
const FlightSearchPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Original search parameters from URL
  const originalFlightType = searchParams?.get('flightType') || 'round-trip';
  const originalFrom = searchParams?.get('from') || 'New York';
  const originalTo = searchParams?.get('to') || 'Los Angeles';
  const originalDepartDate = searchParams?.get('departDate') || '';
  const originalReturnDate = searchParams?.get('returnDate') || '';
  const originalTravelers = searchParams?.get('travelers') || '1 adult, Economy';
  
  // Editable search state (always editable)
  const [editFlightType, setEditFlightType] = useState(originalFlightType);
  const [editFrom, setEditFrom] = useState(originalFrom);
  const [editTo, setEditTo] = useState(originalTo);
  const [editDepartDate, setEditDepartDate] = useState<Date | undefined>(
    originalDepartDate ? new Date(originalDepartDate) : undefined
  );
  const [editReturnDate, setEditReturnDate] = useState<Date | undefined>(
    originalReturnDate ? new Date(originalReturnDate) : undefined
  );
  const [editTravelers, setEditTravelers] = useState(originalTravelers);
  
  // Filter states
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [selectedStops, setSelectedStops] = useState<string[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>(tempFlightData);
  const [sortBy, setSortBy] = useState('price');
  
  // Get unique values for filters
  const airlines = [...new Set(tempFlightData.map(flight => flight.airline))];
  const classes = [...new Set(tempFlightData.map(flight => flight.class))];

  // Handle search with new parameters
  const handleNewSearch = () => {
    const params = new URLSearchParams({
      flightType: editFlightType,
      from: editFrom,
      to: editTo,
      departDate: editDepartDate ? editDepartDate.toISOString().split('T')[0] : '',
      returnDate: editReturnDate ? editReturnDate.toISOString().split('T')[0] : '',
      travelers: editTravelers,
    });    
    router.push(`/flight-search?${params.toString()}`);
  };

  // Handle swap locations
  const handleSwapLocations = () => {
    const temp = editFrom;
    setEditFrom(editTo);
    setEditTo(temp);
  };

  // Handle flight selection
  const handleSelectFlight = (flightId: string) => {
    console.log('Selected flight:', flightId);
    // Add your flight selection logic here
  };

  // Handle filter changes
  const handleAirlineChange = (airline: string, checked: boolean) => {
    if (checked) {
      setSelectedAirlines([...selectedAirlines, airline]);
    } else {
      setSelectedAirlines(selectedAirlines.filter(a => a !== airline));
    }
  };

  const handleStopsChange = (stops: string, checked: boolean) => {
    if (checked) {
      setSelectedStops([...selectedStops, stops]);
    } else {
      setSelectedStops(selectedStops.filter(s => s !== stops));
    }
  };

  const handleClassChange = (flightClass: string, checked: boolean) => {
    if (checked) {
      setSelectedClasses([...selectedClasses, flightClass]);
    } else {
      setSelectedClasses(selectedClasses.filter(c => c !== flightClass));
    }
  };

  const handleClearFilters = () => {
    setPriceRange([0, 1000]);
    setSelectedAirlines([]);
    setSelectedStops([]);
    setSelectedClasses([]);
  };

  useEffect(() => {
    console.log('Flight Search Params:', {
      flightType: originalFlightType,
      from: originalFrom,
      to: originalTo,
      departDate: originalDepartDate,
      returnDate: originalReturnDate,
      travelers: originalTravelers,
    });
  }, [originalFlightType, originalFrom, originalTo, originalDepartDate, originalReturnDate, originalTravelers]);

  // Filter flights based on selected criteria
  useEffect(() => {
    const filtered = tempFlightData.filter(flight => {
      const priceInRange = flight.price >= priceRange[0] && flight.price <= priceRange[1];
      const airlineMatch = selectedAirlines.length === 0 || selectedAirlines.includes(flight.airline);
      const stopsMatch = selectedStops.length === 0 || selectedStops.includes(flight.stops.toString());
      const classMatch = selectedClasses.length === 0 || selectedClasses.includes(flight.class);
      
      return priceInRange && airlineMatch && stopsMatch && classMatch;
    });

    //get the flights from amadeus


    // Sort flights
    switch (sortBy) {
      case 'price':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'duration':
        filtered.sort((a, b) => a.duration.localeCompare(b.duration));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'departure':
        filtered.sort((a, b) => a.departure.time.localeCompare(b.departure.time));
        break;
    }

    setFilteredFlights(filtered);
  }, [priceRange, selectedAirlines, selectedStops, selectedClasses, sortBy]);  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Search Summary */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Flight Search Results</h1>
            <Badge className="bg-blue-100 text-blue-800">
              {filteredFlights.length} flights found
            </Badge>
          </div>
            {/* Search Form Component */}
          <FlightSearchFormCompact
            flightType={editFlightType}
            setFlightType={setEditFlightType}
            from={editFrom}
            setFrom={setEditFrom}
            to={editTo}
            setTo={setEditTo}
            departDate={editDepartDate}
            setDepartDate={setEditDepartDate}
            returnDate={editReturnDate}
            setReturnDate={setEditReturnDate}
            travelers={editTravelers}
            setTravelers={setEditTravelers}
            onSearch={handleNewSearch}
            onSwapLocations={handleSwapLocations}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <FlightFilters
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedAirlines={selectedAirlines}
              selectedStops={selectedStops}
              selectedClasses={selectedClasses}
              airlines={airlines}
              classes={classes}
              onAirlineChange={handleAirlineChange}
              onStopsChange={handleStopsChange}
              onClassChange={handleClassChange}
            />
          </div>

          {/* Flight Results */}
          <FlightsList
            flights={filteredFlights}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onSelectFlight={handleSelectFlight}
            onClearFilters={handleClearFilters}
          />
        </div>
      </div>
    </div>
  );
};

export default FlightSearchPage;
