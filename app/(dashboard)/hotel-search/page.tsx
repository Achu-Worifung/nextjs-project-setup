"use client";
import { HotelData } from "@/lib/types";
import { useState, useEffect, useCallback } from "react";
import HotelFilterSidebar, {
  initialFilterState,
  type FilterState,
} from "@/components/ui/hotel-filter-sidebar";
import { useSearchParams, useRouter } from "next/navigation";
import { generateHotels } from "@/lib/hotel-generator";
import { HotelCard } from "@/components/ui/hotel-card-v3";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays, MapPin, Users, Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { HotelSortBy } from "@/components/ui/hotel-sort-by";

export default function HotelSearchPage() {
  const [filteredHotels, setFilteredHotels] = useState<HotelData[] | null>([]);
  const [allHotels, setAllHotels] = useState<HotelData[] | null>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<
    "price" | "rating" | "review" | "popularity"
  >("popularity");

  const searchparams = useSearchParams();
  const router = useRouter();

  // Search form state
  const [searchCity, setSearchCity] = useState(
    searchparams?.get("city") || "New York City"
  );
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(
    searchparams?.get("startDate")
      ? new Date(searchparams.get("startDate")!)
      : new Date(new Date().setDate(new Date().getDate() + 7))
  );
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(
    searchparams?.get("endDate")
      ? new Date(searchparams.get("endDate")!)
      : new Date(new Date().setDate(new Date().getDate() + 14))
  );
  const [searchGuests, setSearchGuests] = useState(
    searchparams?.get("guests") || "1"
  );
  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  const searchRooms = searchparams?.get("rooms") || "1";

  // Calculate nights
  const nights =
    checkInDate && checkOutDate
      ? Math.ceil(
          (checkOutDate.getTime() - checkInDate.getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 1;

  useEffect(() => {
    //do checks for empty values
    async function fetchHotels() {
      try {
        setLoading(true);
        setError(null);
        
        // Generate mock hotel data using the hotel generator
        const generatedHotels = generateHotels(15); // Generate 15 hotels
        
        console.log("Generated hotels:", generatedHotels);
        setAllHotels(generatedHotels);
        setFilteredHotels(generatedHotels);
      } catch (error) {
        console.error("Error generating hotels:", error);
        setError(
          error instanceof Error ? error.message : "Failed to generate hotels"
        );
        setAllHotels([]);
        setFilteredHotels([]);
      } finally {
        setLoading(false);
      }
    }

    fetchHotels();
  }, [searchparams]);

  const getPerNightPrice = useCallback((hotel: HotelData) => {
    return hotel.rooms[0]?.pricePerNight || 150;
  }, []);
  // Apply filters to hotels
  useEffect(() => {
    if (!allHotels) return;

    let result = allHotels;

    // Star filter - use a simple rating for HotelData
    if (filters.starRating.length > 0) {
      result = result.filter((hotel) => {
        // Use review average rating as a proxy for star rating (convert to 1-5 scale)
        const stars = Math.round(hotel.reviewSummary.averageRating);
        return filters.starRating.includes(stars);
      });
    }

    // Price filter - only filter if range is not default [0, 1000]
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) {
      result = result.filter((hotel) => {
        const price = getPerNightPrice(hotel);
        return price >= filters.priceRange[0] && price <= filters.priceRange[1];
      });
    }

    // Distance filter - only if not at maximum (20km)
    if (filters.distanceFromCenter < 20) {
      result = result.filter((hotel) => {
        const distanceMatch = hotel.accessibilityLabel?.match(/([\d.]+)\s*km/i);
        if (!distanceMatch) return true; // If no distance info, include it

        const distance = parseFloat(distanceMatch[1]);
        return distance <= filters.distanceFromCenter;
      });
    }

    // Vendor filter
    if (filters.vendors.length > 0) {
      result = result.filter((hotel) => {
        return filters.vendors.some((vendor) => {
          return hotel.vendor.toLowerCase() === vendor.toLowerCase();
        });
      });
    }

    // Amenities filter (check based on hotel policies and room features)
    if (filters.amenities.length > 0) {
      result = result.filter((hotel) => {
        const hotelName = hotel.name.toLowerCase();
        const policies = hotel.policies;
        const roomFeatures = hotel.rooms.flatMap(room => room.accessibleFeatures).join(' ').toLowerCase();
        
        return filters.amenities.some((amenity) => {
          const amenityToCheck = amenity.toLowerCase();
          
          // Basic name matching for common amenities
          switch (amenityToCheck) {
            case "free wifi":
              return policies.safetyFeatures.some(feature => feature.toLowerCase().includes('wifi')) ||
                     hotelName.includes('wifi');
            case "free parking":
              return policies.accessMethods.some(method => method.toLowerCase().includes('parking')) ||
                     hotelName.includes('parking');
            case "swimming pool":
              return hotelName.includes('aqua') || hotelName.includes('resort') || hotelName.includes('beach');
            case "fitness center":
              return hotelName.includes('fitness') || hotelName.includes('gym');
            case "restaurant":
              return hotelName.includes('grand') || hotelName.includes('resort');
            case "coffee maker":
              return roomFeatures.includes('coffee') || hotelName.includes('coffee');
            case "airport shuttle":
              return policies.accessMethods.some(method => method.toLowerCase().includes('shuttle'));
            default:
              return false;
          }
        });
      });
    }

    // Accessibility features filter
    if (filters.accessibilityFeatures.length > 0) {
      result = result.filter((hotel) => {
        const accessibilityFeatures = hotel.rooms.flatMap(room => room.accessibleFeatures).join(' ').toLowerCase();
        
        return filters.accessibilityFeatures.some((feature) => {
          const featureToCheck = feature.toLowerCase();
          
          switch (featureToCheck) {
            case "wheelchair accessible":
              return accessibilityFeatures.includes('wheelchair') || accessibilityFeatures.includes('accessible');
            case "elevator access":
              return accessibilityFeatures.includes('elevator');
            case "roll-in showers":
              return accessibilityFeatures.includes('roll-in') || accessibilityFeatures.includes('shower');
            case "accessible parking":
              return accessibilityFeatures.includes('parking');
            case "visual alarms":
              return accessibilityFeatures.includes('visual') || accessibilityFeatures.includes('alarm');
            case "grab bars":
              return accessibilityFeatures.includes('grab') || accessibilityFeatures.includes('bar');
            default:
              return accessibilityFeatures.includes(featureToCheck);
          }
        });
      });
    }

    // Special features filters
    if (filters.petsAllowed) {
      result = result.filter((hotel) => {
        return hotel.policies.petsAllowed;
      });
    }

    if (filters.breakfastIncluded) {
      result = result.filter((hotel) => {
        return hotel.rooms.some(room => room.includes.breakfast);
      });
    }

    if (filters.instantBook) {
      result = result.filter((hotel) => {
        // For now, randomly assign some hotels as instant book available
        // In a real app, this would be a property of the hotel data
        return hotel.id % 3 === 0; // Every 3rd hotel has instant booking
      });
    }

    // Review score filter
    if (filters.reviewScore > 0) {
      result = result.filter((hotel) => {
        return hotel.reviewSummary.averageRating >= filters.reviewScore;
      });
    }

    // Apply sorting to the filtered results
    const sortedResult = [...result].sort((a, b) => {
      switch (sortBy) {
        case "price":
          return getPerNightPrice(a) - getPerNightPrice(b);
        case "rating":
          return b.reviewSummary.averageRating - a.reviewSummary.averageRating;
        case "review":
          return b.reviewSummary.totalReviews - a.reviewSummary.totalReviews;
        case "popularity":
          return a.id - b.id; // Use ID as a proxy for popularity
        default:
          return 0;
      }
    });

    // console.log("Filter and sort applied:", {
    //   originalCount: allHotels.length,
    //   filteredCount: result.length,
    //   finalCount: sortedResult.length,
    //   activeFilters: filters,
    //   sortBy: sortBy,
    // });

    setFilteredHotels(sortedResult);
  }, [allHotels, filters, sortBy, getPerNightPrice]);

  //change sorting function
  const sortByfunction = (value: string) => {
    setSortBy(value as "price" | "rating" | "review" | "popularity");
  };

  // Handle new search
  const handleSearch = () => {
    const searchUrl = new URL(window.location.href);
    searchUrl.searchParams.set("city", searchCity);
    searchUrl.searchParams.set(
      "startDate",
      checkInDate?.toISOString().split("T")[0] || ""
    );
    searchUrl.searchParams.set(
      "endDate",
      checkOutDate?.toISOString().split("T")[0] || ""
    );
    searchUrl.searchParams.set("guests", searchGuests);
    searchUrl.searchParams.set("rooms", searchRooms);

    router.push(`/hotel-search?${searchUrl.searchParams.toString()}`);
  };
  if (loading) {
    return (
      <div data-testid="hotel-card" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Enhanced Search Form */}
        <div className="bg-white shadow-lg border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto p-6">
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Find Your Perfect Stay
              </h1>
              <p className="text-gray-600">
                Search and compare hotels from hundreds of travel sites
              </p>
            </div>

            <Card className="border-2 border-brand-pink-200 bg-blue-50/30">
              <CardContent className="p-6">
                <div className="grid gap-4 md:grid-cols-6 items-end">
                  <div className="md:col-span-2">
                    <Label
                      htmlFor="city"
                      className="text-sm font-semibold text-gray-700"
                    >
                      <MapPin className="inline w-4 h-4 mr-1" />
                      Destination
                    </Label>
                    <Input
                      id="city"
                      value={searchCity}
                      onChange={(e) => setSearchCity(e.target.value)}
                      placeholder="Where are you going?"
                      className="mt-2 h-12 text-lg border-2 border-brand-gray-200 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="checkin"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Check-in
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal h-12 mt-2 border-2 border-brand-gray-200 hover:border-blue-500",
                            !checkInDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarDays className="mr-2 h-4 w-4" />
                          {checkInDate
                            ? format(checkInDate, "MMM dd")
                            : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={checkInDate}
                          onSelect={setCheckInDate}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label
                      htmlFor="checkout"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Check-out
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal h-12 mt-2 border-2 border-brand-gray-200 hover:border-blue-500",
                            !checkOutDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarDays className="mr-2 h-4 w-4" />
                          {checkOutDate
                            ? format(checkOutDate, "MMM dd")
                            : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={checkOutDate}
                          onSelect={setCheckOutDate}
                          initialFocus
                          disabled={(date) =>
                            date < (checkInDate || new Date())
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label
                      htmlFor="guests"
                      className="text-sm font-semibold text-gray-700"
                    >
                      <Users className="inline w-4 h-4 mr-1" />
                      Guests
                    </Label>
                    <Input
                      id="guests"
                      type="number"
                      min="1"
                      max="10"
                      value={searchGuests}
                      onChange={(e) => setSearchGuests(e.target.value)}
                      className="mt-2 h-12 border-2 border-brand-gray-200 focus:border-blue-500"
                    />
                  </div>

                  <Button
                    onClick={handleSearch}
                    className="h-12 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Search className="mr-2 h-5 w-5" />
                    Search
                  </Button>
                </div>

                {nights > 0 && (
                  <div className="mt-4 text-center">
                    <Badge
                      variant="secondary"
                      className="bg-brand-pink-100 text-blue-700 px-3 py-1"
                    >
                      {nights} night{nights > 1 ? "s" : ""} • {searchGuests}{" "}
                      guest{parseInt(searchGuests) > 1 ? "s" : ""}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Loading Content */}
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-16">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-brand-pink-200 border-t-blue-600 mx-auto mb-6"></div>
                <div className="absolute inset-0 rounded-full bg-brand-pink-100 animate-pulse mx-auto h-16 w-16 opacity-20"></div>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Generating hotel options...
              </h2>
              <p className="text-gray-600 mb-4">
                We&apos;re creating personalized hotel recommendations for you in {searchCity}
              </p>
              <div className="flex justify-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
    id="hotel-search" className="min-h-screen bg-gray-50">
      {/* Search Form */}
      <div className="bg-white shadow-sm border-b p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-4 md:grid-cols-5 items-end">
            <div>
              <Label htmlFor="city">Destination</Label>
              <Input
                id="city"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                placeholder="Enter city name"
              />
            </div>
            <div>
              <Label htmlFor="checkin">Check-in</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !checkInDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {checkInDate ? format(checkInDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={checkInDate}
                    onSelect={setCheckInDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="checkout">Check-out</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !checkOutDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {checkOutDate ? format(checkOutDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={checkOutDate}
                    onSelect={setCheckOutDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="guests">Guests</Label>
              <Input
                id="guests"
                type="number"
                min="1"
                max="10"
                value={searchGuests}
                onChange={(e) => setSearchGuests(e.target.value)}
              />
            </div>
            <Button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Search className="mr-2 h-4 w-4" />
              Search Hotels
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div 
      id="hotel-card" 
      data-testid="hotel-card"
      className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Results Header */}
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Hotels in {searchparams?.get("city") || "New York City"}
              </h1>
              <p className="text-gray-600">
                {filteredHotels?.length || 0} hotel
                {(filteredHotels?.length || 0) !== 1 ? "s" : ""} found
              </p>
            </div>
            <div>
              <HotelSortBy sortByfunction={sortByfunction} />
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-brand-error/30 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="flex gap-8">
            {/* Filter Sidebar */}
            <div className="w-72 flex-shrink-0">
              <HotelFilterSidebar filters={filters} setFilters={setFilters} />
            </div>

            {/* Hotels List */}
            <div
            id="hotel-card" 
            data-testid="hotel-card"
            className="flex-1">
              {filteredHotels && filteredHotels.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredHotels.map((hotel, idx) => (
                    <HotelCard 
                      key={idx} 
                      hotel={hotel} 
                      onHotelClick={(selectedHotel) => {
                        // Navigate to hotel details page with hotel data
                        const hotelParams = new URLSearchParams({
                          hotel: encodeURIComponent(JSON.stringify(selectedHotel)),
                          checkIn: checkInDate?.toISOString() || "",
                          checkOut: checkOutDate?.toISOString() || "",
                          guests: searchGuests,
                        });
                        router.push(`/hotel-details?${hotelParams.toString()}`);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-xl text-gray-600 mb-2">No hotels found</p>
                  <p className="text-gray-500">
                    Try adjusting your search criteria or filters
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

