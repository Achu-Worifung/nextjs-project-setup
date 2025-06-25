import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Star, 
  X, 
  Filter, 
  RotateCcw, 
  Wifi, 
  Car, 
  Waves, 
  Dumbbell,   UtensilsCrossed, 
  Heart, 
  Coffee,
  PawPrint,
  Snowflake,
  MapPin,
  Shield
} from "lucide-react";

interface HotelFilters {
  priceRange: [number, number];
  starRating: number[];
  reviewScore: number;
  amenities: string[];
  sortBy: 'price' | 'rating' | 'reviews' | 'distance';
  propertyType: string[];
  mealPlan: string[];
  cancellationPolicy: 'free' | 'paid' | 'non-refundable' | 'any';
  distanceFromCenter: number;
  instantBook: boolean;
}

interface AmenityItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'essential' | 'leisure' | 'business' | 'family';
}

const AMENITY_CATEGORIES: Record<string, AmenityItem[]> = {
  essential: [
    { id: 'wifi', name: 'Free WiFi', icon: Wifi, category: 'essential' },
    { id: 'parking', name: 'Parking', icon: Car, category: 'essential' },
    { id: 'ac', name: 'Air Conditioning', icon: Snowflake, category: 'essential' },
    { id: 'breakfast', name: 'Breakfast Included', icon: Coffee, category: 'essential' },
  ],
  leisure: [
    { id: 'pool', name: 'Swimming Pool', icon: Waves, category: 'leisure' },
    { id: 'fitness', name: 'Fitness Center', icon: Dumbbell, category: 'leisure' },
    { id: 'spa', name: 'Spa & Wellness', icon: Heart, category: 'leisure' },
  ],
  business: [
    { id: 'restaurant', name: 'Restaurant', icon: UtensilsCrossed, category: 'business' },
    { id: 'room-service', name: 'Room Service', icon: Shield, category: 'business' },
    { id: 'concierge', name: 'Concierge', icon: MapPin, category: 'business' },
  ],
  family: [
    { id: 'pet-friendly', name: 'Pet Friendly', icon: PawPrint, category: 'family' },
  ]
};

export function HotelFilterSidebar() {
  const [filters, setFilters] = useState<HotelFilters>({
    priceRange: [0, 1000],
    starRating: [],
    reviewScore: 0,
    amenities: [],
    sortBy: 'price',
    propertyType: [],
    mealPlan: [],
    cancellationPolicy: 'any',
    distanceFromCenter: 10,
    instantBook: false
  });

  const [expandedSections, setExpandedSections] = useState({
    amenities: false,
    advanced: false
  });

  const resetFilters = () => {
    setFilters({
      priceRange: [0, 1000],
      starRating: [],
      reviewScore: 0,
      amenities: [],
      sortBy: 'price',
      propertyType: [],
      mealPlan: [],
      cancellationPolicy: 'any',
      distanceFromCenter: 10,
      instantBook: false
    });
  };
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.starRating.length > 0) count++;
    if (filters.amenities.length > 0) count++;
    if (filters.reviewScore > 0) count++;
    if (filters.propertyType.length > 0) count++;
    if (filters.mealPlan.length > 0) count++;
    if (filters.cancellationPolicy !== 'any') count++;
    if (filters.instantBook) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) count++;
    return count;
  }, [filters]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };
  return (
    <Card className=" top-6 shadow-lg border-0 bg-white/95 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-lg text-gray-900">Filters</h3>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={resetFilters}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        </div>

        {/* Price Range Filter */}
        <div className="mb-6">
          <Label className="text-sm font-semibold text-gray-700 mb-3 block">Price per night</Label>
          <div className="bg-gray-50 p-4 rounded-lg">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value as [number, number] }))}
              max={20}
              min={0}
              step={1}
              className="w-full"
            />
             <div className="flex justify-center items-center text-sm text-gray-600 mt-3">
              <div className="bg-white px-3 py-1 rounded-md border font-medium">
                ${filters.priceRange[0]}
              </div>
              
            </div>
          </div>
        </div>

        {/* Star Rating Filter */}
        <div className="mb-6">
          <Label className="text-sm font-semibold text-gray-700 mb-3 block">Star Rating</Label>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((stars) => (
              <div key={stars} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <Checkbox
                  id={`stars-${stars}`}
                  checked={filters.starRating.includes(stars)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFilters(prev => ({ 
                        ...prev, 
                        starRating: [...prev.starRating, stars] 
                      }));
                    } else {
                      setFilters(prev => ({ 
                        ...prev, 
                        starRating: prev.starRating.filter(s => s !== stars) 
                      }));
                    }
                  }}
                  className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <label htmlFor={`stars-${stars}`} className="flex items-center text-sm cursor-pointer flex-1">
                  <div className="flex mr-2">
                    {renderStars(stars)}
                  </div>
                  <span className="font-medium">{stars} Star{stars > 1 ? 's' : ''}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Review Score Filter */}
        {/* <div className="mb-6">
          <Label className="text-sm font-semibold text-gray-700 mb-3 block">Guest Review Score</Label>
          <div className="bg-gray-50 p-4 rounded-lg">
            <Slider
              value={[filters.reviewScore]}
              onValueChange={(value) => setFilters(prev => ({ ...prev, reviewScore: value[0] }))}
              max={10}
              min={0}
              step={0.5}
              className="w-full"
            />
            <div className="text-center mt-3">
              <div className="bg-white px-3 py-1 rounded-md border inline-block font-medium text-sm">
                {filters.reviewScore === 0 ? 'Any rating' : `${filters.reviewScore}/10 and above`}
              </div>
            </div>
          </div>
        </div> */}

        {/* Property Type Filter */}
        <div className="mb-6">
          <Label className="text-sm font-semibold text-gray-700 mb-3 block">Property Type</Label>
          <div className="grid grid-cols-2 gap-2">
            {['Hotel', 'Private Suite', 'Apartment', 'Villa', 'Hostel', 'B&B'].map((type) => (
              <Button
                key={type}
                variant={filters.propertyType.includes(type) ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  if (filters.propertyType.includes(type)) {
                    setFilters(prev => ({ 
                      ...prev, 
                      propertyType: prev.propertyType.filter(t => t !== type) 
                    }));
                  } else {
                    setFilters(prev => ({ 
                      ...prev, 
                      propertyType: [...prev.propertyType, type] 
                    }));
                  }
                }}
                className={`h-9 text-xs ${
                  filters.propertyType.includes(type) 
                    ? "bg-blue-600 hover:bg-blue-700" 
                    : "hover:bg-gray-100"
                }`}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        {/* Amenities Filter */}
        {/* <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm font-semibold text-gray-700">Popular Amenities</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpandedSections(prev => ({ ...prev, amenities: !prev.amenities }))}
              className="text-xs text-blue-600 hover:text-blue-700 p-0 h-auto"
            >
              {expandedSections.amenities ? 'Show Less' : 'Show More'}
            </Button>
          </div>
          <div className="space-y-2">
            {Object.entries(AMENITY_CATEGORIES).map(([category, amenities]) => (
              <div key={category}>
                {(expandedSections.amenities || category === 'essential') && (
                  <>
                    {expandedSections.amenities && (
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 mt-4 first:mt-0">
                        {category}
                      </div>
                    )}
                    <div className="grid grid-cols-1 gap-2">
                      {amenities.map((amenity) => {
                        const Icon = amenity.icon;
                        return (
                          <div key={amenity.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                            <Checkbox
                              id={`amenity-${amenity.id}`}
                              checked={filters.amenities.includes(amenity.name)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFilters(prev => ({ 
                                    ...prev, 
                                    amenities: [...prev.amenities, amenity.name] 
                                  }));
                                } else {
                                  setFilters(prev => ({ 
                                    ...prev, 
                                    amenities: prev.amenities.filter(a => a !== amenity.name) 
                                  }));
                                }
                              }}
                              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                            />
                            <Icon className="w-4 h-4 text-gray-500" />
                            <label htmlFor={`amenity-${amenity.id}`} className="text-sm cursor-pointer font-medium flex-1">
                              {amenity.name}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div> */}

                {/* Instant Book & Cancellation Policy */}
        {/* <div className="mb-6">
          <Label className="text-sm font-semibold text-gray-700 mb-3 block">Booking Options</Label>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">Instant Book</span>
              </div>
              <Switch
                checked={filters.instantBook}
                onCheckedChange={(checked) => setFilters(prev => ({ ...prev, instantBook: checked }))}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-600">Cancellation Policy</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'free', label: 'Free' },
                  { value: 'paid', label: 'Paid' },
                  { value: 'non-refundable', label: 'Non-refundable' },
                  { value: 'any', label: 'Any' }
                ].map((option) => (
                  <Button
                    key={option.value}
                    variant={filters.cancellationPolicy === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilters(prev => ({ ...prev, cancellationPolicy: option.value as 'free' | 'paid' | 'non-refundable' | 'any' }))}
                    className={`h-8 text-xs ${
                      filters.cancellationPolicy === option.value 
                        ? "bg-blue-600 hover:bg-blue-700" 
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div> */}

        {/* Distance from Center */}
        <div className="mb-6">
          <Label className="text-sm font-semibold text-gray-700 mb-3 block">Distance from City Center</Label>
          <div className="bg-gray-50 p-4 rounded-lg">
            <Slider
              value={[filters.distanceFromCenter]}
              onValueChange={(value) => setFilters(prev => ({ ...prev, distanceFromCenter: value[0] }))}
              max={20}
              min={0}
              step={1}
              className="w-full"
            />
            <div className="text-center mt-3">
              <div className="bg-white px-3 py-1 rounded-md border inline-block font-medium text-sm">
                {filters.distanceFromCenter === 20 ? '20+ km' : `${filters.distanceFromCenter} km`}
              </div>
            </div>
          </div>
        </div>


        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <div className="mb-6">
            <Label className="text-sm font-semibold text-gray-700 mb-3 block">Active Filters</Label>
            <div className="flex flex-wrap gap-2">
              {filters.starRating.map((stars) => (
                <Badge key={`star-${stars}`} variant="secondary" className="flex items-center gap-1 bg-blue-100 text-blue-700 hover:bg-blue-200">
                  {stars} Star{stars > 1 ? 's' : ''}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-blue-900" 
                    onClick={() => setFilters(prev => ({ 
                      ...prev, 
                      starRating: prev.starRating.filter(s => s !== stars) 
                    }))}
                  />
                </Badge>
              ))}
              {filters.propertyType.map((type) => (
                <Badge key={`type-${type}`} variant="secondary" className="flex items-center gap-1 bg-green-100 text-green-700 hover:bg-green-200">
                  {type}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-green-900" 
                    onClick={() => setFilters(prev => ({ 
                      ...prev, 
                      propertyType: prev.propertyType.filter(t => t !== type) 
                    }))}
                  />
                </Badge>
              ))}
              {filters.amenities.slice(0, 3).map((amenity) => (
                <Badge key={`amenity-${amenity}`} variant="secondary" className="flex items-center gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200">
                  {amenity}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-purple-900" 
                    onClick={() => setFilters(prev => ({ 
                      ...prev, 
                      amenities: prev.amenities.filter(a => a !== amenity) 
                    }))}
                  />
                </Badge>
              ))}
              {filters.amenities.length > 3 && (
                <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                  +{filters.amenities.length - 3} more
                </Badge>
              )}
              {filters.reviewScore > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-orange-100 text-orange-700 hover:bg-orange-200">
                  {filters.reviewScore}+ rating
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-orange-900" 
                    onClick={() => setFilters(prev => ({ ...prev, reviewScore: 0 }))}
                  />
                </Badge>
              )}
              {filters.instantBook && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-teal-100 text-teal-700 hover:bg-teal-200">
                  Instant Book
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-teal-900" 
                    onClick={() => setFilters(prev => ({ ...prev, instantBook: false }))}
                  />
                </Badge>
              )}
            </div>
          </div>
        )}

        
      </CardContent>
    </Card>
  );
}