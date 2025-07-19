"use client";
import { useRouter } from "next/navigation";
import { hotel_type } from "@/lib/types";
import { Star, MapPin, Wifi, Heart, Clock, Users, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function HotelCard({ hotel }: { hotel: hotel_type }) {
  const router = useRouter();
  
  //getting the difference between the days
  const checkinDate = new Date(hotel.property.checkinDate);
  const checkoutDate = new Date(hotel.property.checkoutDate);
  const diffTime = Math.abs(checkoutDate.getTime() - checkinDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const handleClick = () => {
    router.push(
      `/hotel?hotel_id=${hotel.hotel_id}&start_date=${hotel.property.checkinDate}&end_date=${hotel.property.checkoutDate}&room_qty=1&adults=1`
    );
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />);
    }
    
    const emptyStars = 5 - fullStars;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-3 h-3 text-gray-300" />);
    }
    
    return stars;
  };

  return (
    <div data-testid="hotel-card"
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden hover:border-gray-200"
      onClick={handleClick}
    >
      <div className="flex h-72">
        {/* Image Section */}
        <div className="relative w-80 flex-shrink-0 overflow-hidden">
          <Image
            src={hotel.property.photoUrls[0] || '/des1.jpg'}
            alt={hotel.property.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Heart button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4 h-9 w-9 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full shadow-md"
            onClick={(e) => e.stopPropagation()}
          >
            <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors" />
          </Button>

          {/* Savings badge */}
          {hotel.property.priceBreakdown.strikethroughPrice && (
            <div className="absolute top-4 left-4">
              <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-3 py-1 rounded-full">
                {Math.round(((hotel.property.priceBreakdown.strikethroughPrice.value - hotel.property.priceBreakdown.grossPrice.value) / hotel.property.priceBreakdown.strikethroughPrice.value) * 100)}% OFF
              </Badge>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          {/* Top Section */}
          <div className="space-y-4">
            {/* Hotel Name & Location */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 flex-1">
                  {hotel.property.name}
                </h3>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all ml-2 flex-shrink-0" />
              </div>
              
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                <span>{hotel.property.wishlistName || 'City Center'}</span>
              </div>
              
              {/* Star Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {renderStars(hotel.property.propertyClass || 4)}
                </div>
                <span className="text-sm text-gray-500 font-medium">
                  {hotel.property.propertyClass || 4} Star Hotel
                </span>
              </div>
            </div>

            {/* Reviews */}
            {hotel.property.reviewScore && (
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 text-white px-3 py-1.5 rounded-lg">
                  <span className="text-sm font-bold">
                    {hotel.property.reviewScore.toFixed(1)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {hotel.property.reviewScoreWord}
                  </p>
                  <p className="text-xs text-gray-500">
                    {hotel.property.reviewCount?.toLocaleString()} reviews
                  </p>
                </div>
              </div>
            )}

            {/* Amenities */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200 rounded-full">
                <Wifi className="w-3 h-3 mr-1" />
                Free WiFi
              </Badge>
              <Badge variant="outline" className="text-xs rounded-full">
                <Clock className="w-3 h-3 mr-1" />
                {diffDays} nights
              </Badge>
              <Badge variant="outline" className="text-xs rounded-full">
                <Users className="w-3 h-3 mr-1" />
                Free cancellation
              </Badge>
            </div>
          </div>

          {/* Bottom Section - Pricing */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-end justify-between">
              <div>
                {hotel.property.priceBreakdown.strikethroughPrice && (
                  <p className="text-sm text-gray-400 line-through mb-1">
                    $
                    {Math.round(
                      hotel.property.priceBreakdown.strikethroughPrice.value / diffDays
                    ).toLocaleString()}
                    <span className="text-xs"> / night</span>
                  </p>
                )}
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-2xl font-bold text-gray-900">
                    $
                    {Math.round(
                      hotel.property.priceBreakdown.grossPrice.value / diffDays
                    ).toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">/ night</span>
                </div>
                
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">
                    $
                    {hotel.property.priceBreakdown.grossPrice.value.toLocaleString()}{" "}
                    total
                  </span>
                  {hotel.property.priceBreakdown.excludedPrice && (
                    <span className="text-xs text-gray-500 block">
                      +$
                      {hotel.property.priceBreakdown.excludedPrice.value.toLocaleString()}{" "}
                      taxes & fees
                    </span>
                  )}
                </p>
              </div>

              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group-hover:scale-105"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
              >
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
