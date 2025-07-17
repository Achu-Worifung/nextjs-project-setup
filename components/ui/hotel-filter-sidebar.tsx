import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  X, 
  Filter, 
  RotateCcw,
  Wifi,
  Car,
  Waves,
  Dumbbell,
  Coffee,
  Shield,
  Users,
  Heart,
  Utensils,
  CarTaxiFront,
  Building2
} from "lucide-react";

// Define the filter state type
export const initialFilterState = {
  priceRange: [0, 1000] as [number, number],
  starRating: [] as number[],
  reviewScore: 0,
  amenities: [] as string[],
  sortBy: 'price' as string,
  vendors: [] as string[],
  accessibilityFeatures: [] as string[],
  cancellationPolicy: 'any' as string,
  distanceFromCenter: 20,
  instantBook: false,
  petsAllowed: false,
  breakfastIncluded: false
};

export type FilterState = typeof initialFilterState;

interface HotelFilterSidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

export default function HotelFilterSidebar({
  filters,
  setFilters,
}: HotelFilterSidebarProps) {
  const resetFilters = () => {
    setFilters({
      priceRange: [0, 1000],
      starRating: [],
      reviewScore: 0,
      amenities: [],
      sortBy: 'price',
      vendors: [],
      accessibilityFeatures: [],
      cancellationPolicy: 'any',
      distanceFromCenter: 20,
      instantBook: false,
      petsAllowed: false,
      breakfastIncluded: false
    });
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.starRating.length > 0) count++;
    if (filters.amenities.length > 0) count++;
    if (filters.reviewScore > 0) count++;
    if (filters.vendors.length > 0) count++;
    if (filters.accessibilityFeatures.length > 0) count++;
    if (filters.cancellationPolicy !== 'any') count++;
    if (filters.instantBook) count++;
    if (filters.petsAllowed) count++;
    if (filters.breakfastIncluded) count++;
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
    <Card className="top-6 shadow-lg border-0 bg-white/95 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-brand-pink-600" />
            <h3 className="font-semibold text-lg text-brand-gray-900">Filters</h3>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="bg-brand-pink-100 text-blue-700 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={resetFilters}
            className="text-brand-gray-500 hover:text-brand-gray-700 hover:bg-brand-gray-100"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        </div>

        {/* Price Range Filter */}
        <div className="mb-6">
          <Label className="text-sm font-semibold text-brand-gray-700 mb-3 block">Price per night</Label>
          <div className="bg-brand-gray-50 p-4 rounded-lg">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value as [number, number] }))}
              max={1000}
              min={0}
              step={50}
              className="w-full"
            />
            <div className="flex justify-between items-center text-sm text-brand-gray-600 mt-3">
              <div className="bg-white px-3 py-1 rounded-md border font-medium">
                ${filters.priceRange[0]}
              </div>
              <div className="bg-white px-3 py-1 rounded-md border font-medium">
                ${filters.priceRange[1] === 1000 ? '1000+' : filters.priceRange[1]}
              </div>
            </div>
          </div>
        </div>

        {/* Star Rating Filter */}
        <div className="mb-6">
          <Label className="text-sm font-semibold text-brand-gray-700 mb-3 block">Star Rating</Label>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((stars) => (
              <div key={stars} className="flex items-center space-x-3 p-2 hover:bg-brand-gray-50 rounded-lg transition-colors">
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

        {/* Hotel Vendors Filter */}
        <div className="mb-6">
          <Label className="text-sm font-semibold text-brand-gray-700 mb-3 block">Hotel Chain</Label>
          <div className="space-y-2  overflow-y-auto">
            {['Hilton', 'Marriott', 'Hyatt', 'Wyndham', 'Choice Hotels', 'InterContinental', 'Best Western Hotels & Resorts', 'IHG Hotels & Resorts'].map((vendor) => (
              <div key={vendor} className="flex items-center space-x-3 p-2 hover:bg-brand-gray-50 rounded-lg transition-colors">
                <Checkbox
                  id={`vendor-${vendor}`}
                  checked={filters.vendors.includes(vendor)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFilters(prev => ({ 
                        ...prev, 
                        vendors: [...prev.vendors, vendor] 
                      }));
                    } else {
                      setFilters(prev => ({ 
                        ...prev, 
                        vendors: prev.vendors.filter(v => v !== vendor) 
                      }));
                    }
                  }}
                  className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <label htmlFor={`vendor-${vendor}`} className="text-sm cursor-pointer flex-1 font-medium">
                  <Building2 className="w-4 h-4 inline-block mr-2 text-brand-gray-500" />
                  {vendor}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Amenities Filter */}
        <div className="mb-6">
          <Label className="text-sm font-semibold text-brand-gray-700 mb-3 block">Amenities</Label>
          <div className="space-y-2">
            {[
              { name: 'Free WiFi', icon: Wifi },
              { name: 'Free Parking', icon: Car },
              { name: 'Swimming Pool', icon: Waves },
              { name: 'Fitness Center', icon: Dumbbell },
              { name: 'Restaurant', icon: Utensils },
              { name: 'Coffee Maker', icon: Coffee },
              { name: 'Airport Shuttle', icon: CarTaxiFront }
            ].map(({ name, icon: Icon }) => (
              <div key={name} className="flex items-center space-x-3 p-2 hover:bg-brand-gray-50 rounded-lg transition-colors">
                <Checkbox
                  id={`amenity-${name}`}
                  checked={filters.amenities.includes(name)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFilters(prev => ({ 
                        ...prev, 
                        amenities: [...prev.amenities, name] 
                      }));
                    } else {
                      setFilters(prev => ({ 
                        ...prev, 
                        amenities: prev.amenities.filter(a => a !== name) 
                      }));
                    }
                  }}
                  className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <label htmlFor={`amenity-${name}`} className="text-sm cursor-pointer flex-1 font-medium">
                  <Icon className="w-4 h-4 inline-block mr-2 text-brand-gray-500" />
                  {name}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Special Features Filter */}
        <div className="mb-6">
          <Label className="text-sm font-semibold text-brand-gray-700 mb-3 block">Special Features</Label>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-2 hover:bg-brand-gray-50 rounded-lg transition-colors">
              <Checkbox
                id="pets-allowed"
                checked={filters.petsAllowed}
                onCheckedChange={(checked) => {
                  setFilters(prev => ({ ...prev, petsAllowed: checked as boolean }));
                }}
                className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              <label htmlFor="pets-allowed" className="text-sm cursor-pointer flex-1 font-medium">
                <Heart className="w-4 h-4 inline-block mr-2 text-brand-gray-500" />
                Pet Friendly
              </label>
            </div>
            <div className="flex items-center space-x-3 p-2 hover:bg-brand-gray-50 rounded-lg transition-colors">
              <Checkbox
                id="breakfast-included"
                checked={filters.breakfastIncluded}
                onCheckedChange={(checked) => {
                  setFilters(prev => ({ ...prev, breakfastIncluded: checked as boolean }));
                }}
                className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              <label htmlFor="breakfast-included" className="text-sm cursor-pointer flex-1 font-medium">
                <Coffee className="w-4 h-4 inline-block mr-2 text-brand-gray-500" />
                Free Breakfast
              </label>
            </div>
            <div className="flex items-center space-x-3 p-2 hover:bg-brand-gray-50 rounded-lg transition-colors">
              <Checkbox
                id="instant-book"
                checked={filters.instantBook}
                onCheckedChange={(checked) => {
                  setFilters(prev => ({ ...prev, instantBook: checked as boolean }));
                }}
                className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              <label htmlFor="instant-book" className="text-sm cursor-pointer flex-1 font-medium">
                <Shield className="w-4 h-4 inline-block mr-2 text-brand-gray-500" />
                Instant Booking
              </label>
            </div>
          </div>
        </div>

        {/* Accessibility Features Filter */}
        <div className="mb-6">
          <Label className="text-sm font-semibold text-brand-gray-700 mb-3 block">Accessibility</Label>
          <div className="space-y-2">
            {['Wheelchair Accessible', 'Elevator Access', 'Roll-in Showers', 'Accessible Parking', 'Visual Alarms', 'Grab Bars'].map((feature) => (
              <div key={feature} className="flex items-center space-x-3 p-2 hover:bg-brand-gray-50 rounded-lg transition-colors">
                <Checkbox
                  id={`accessibility-${feature}`}
                  checked={filters.accessibilityFeatures.includes(feature)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFilters(prev => ({ 
                        ...prev, 
                        accessibilityFeatures: [...prev.accessibilityFeatures, feature] 
                      }));
                    } else {
                      setFilters(prev => ({ 
                        ...prev, 
                        accessibilityFeatures: prev.accessibilityFeatures.filter(f => f !== feature) 
                      }));
                    }
                  }}
                  className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <label htmlFor={`accessibility-${feature}`} className="text-sm cursor-pointer flex-1 font-medium">
                  <Users className="w-4 h-4 inline-block mr-2 text-brand-gray-500" />
                  {feature}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Distance from Center */}
        <div className="mb-6">
          <Label className="text-sm font-semibold text-brand-gray-700 mb-3 block">Distance from City Center</Label>
          <div className="bg-brand-gray-50 p-4 rounded-lg">
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
            <Label className="text-sm font-semibold text-brand-gray-700 mb-3 block">Active Filters</Label>
            <div className="flex flex-wrap gap-2">
              {filters.starRating.map((stars) => (
                <Badge key={`star-${stars}`} variant="secondary" className="flex items-center gap-1 bg-brand-pink-100 text-blue-700 hover:bg-blue-200">
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
              {filters.vendors.map((vendor) => (
                <Badge key={`vendor-${vendor}`} variant="secondary" className="flex items-center gap-1 bg-green-100 text-green-700 hover:bg-green-200">
                  {vendor}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-green-900" 
                    onClick={() => setFilters(prev => ({ 
                      ...prev, 
                      vendors: prev.vendors.filter(v => v !== vendor) 
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
                <Badge variant="secondary" className="bg-brand-gray-100 text-brand-gray-600">
                  +{filters.amenities.length - 3} more amenities
                </Badge>
              )}
              {filters.accessibilityFeatures.slice(0, 2).map((feature) => (
                <Badge key={`access-${feature}`} variant="secondary" className="flex items-center gap-1 bg-indigo-100 text-indigo-700 hover:bg-indigo-200">
                  {feature}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-indigo-900" 
                    onClick={() => setFilters(prev => ({ 
                      ...prev, 
                      accessibilityFeatures: prev.accessibilityFeatures.filter(f => f !== feature) 
                    }))}
                  />
                </Badge>
              ))}
              {filters.accessibilityFeatures.length > 2 && (
                <Badge variant="secondary" className="bg-brand-gray-100 text-brand-gray-600">
                  +{filters.accessibilityFeatures.length - 2} more accessibility
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
              {filters.petsAllowed && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-pink-100 text-pink-700 hover:bg-pink-200">
                  Pet Friendly
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-pink-900" 
                    onClick={() => setFilters(prev => ({ ...prev, petsAllowed: false }))}
                  />
                </Badge>
              )}
              {filters.breakfastIncluded && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-yellow-100 text-yellow-700 hover:bg-yellow-200">
                  Free Breakfast
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-yellow-900" 
                    onClick={() => setFilters(prev => ({ ...prev, breakfastIncluded: false }))}
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

