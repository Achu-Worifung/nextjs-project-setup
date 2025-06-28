"use client";
import { hotel_type } from "@/lib/types";
import { Star, MapPin, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface HotelCardProps {
  hotel: hotel_type;
  onHotelClick?: (hotel: hotel_type) => void;
}

export function HotelCard({ hotel, onHotelClick }: HotelCardProps) {
  
  //getting the difference between the days
  const checkinDate = new Date(hotel.property.checkinDate);
  const checkoutDate = new Date(hotel.property.checkoutDate);
  const diffTime = Math.abs(checkoutDate.getTime() - checkinDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const handleClick = () => {
    if (onHotelClick) {
      onHotelClick(hotel);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />);
    }
    
    const emptyStars = 5 - fullStars;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-3.5 h-3.5 text-gray-300" />);
    }
    
    return stars;
  };

  return (
    <div 
      className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-50 hover:border-gray-100"
      onClick={handleClick}
    >
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src={hotel.property.photoUrls[0] || '/des1.jpg'}
          alt={hotel.property.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Simple overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
        
        {/* Heart button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 right-4 h-10 w-10 bg-white/95 hover:bg-white backdrop-blur-sm rounded-full shadow-lg border border-white/20"
          onClick={(e) => e.stopPropagation()}
        >
          <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors" />
        </Button>

        {/* Savings badge */}
        {hotel.property.priceBreakdown.strikethroughPrice && (
          <div className="absolute top-4 left-4">
            <div className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              SAVE {Math.round(((hotel.property.priceBreakdown.strikethroughPrice.value - hotel.property.priceBreakdown.grossPrice.value) / hotel.property.priceBreakdown.strikethroughPrice.value) * 100)}%
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Hotel Name & Location */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {hotel.property.name}
          </h3>
          
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <MapPin className="w-4 h-4 mr-1.5" />
            <span>{hotel.property.wishlistName || 'City Center'}</span>
          </div>
          
          {/* Star Rating */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {renderStars(hotel.property.propertyClass || 4)}
            </div>
            <span className="text-sm text-gray-500 ml-1">
              ({hotel.property.reviewCount?.toLocaleString()})
            </span>
          </div>
        </div>

        {/* Reviews */}
        {hotel.property.reviewScore && (
          <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">
                  {hotel.property.reviewScore.toFixed(1)}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {hotel.property.reviewScoreWord}
                </p>
                <p className="text-xs text-gray-500">
                  Based on {hotel.property.reviewCount?.toLocaleString()} reviews
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Price Section */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-end justify-between">
            <div>
              {hotel.property.priceBreakdown.strikethroughPrice && (
                <p className="text-sm text-gray-400 line-through">
                  $
                  {Math.round(
                    hotel.property.priceBreakdown.strikethroughPrice.value / diffDays
                  ).toLocaleString()}
                  <span className="text-xs"> per night</span>
                </p>
              )}
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-bold text-gray-900">
                  $
                  {Math.round(
                    hotel.property.priceBreakdown.grossPrice.value / diffDays
                  ).toLocaleString()}
                </span>
                <span className="text-sm text-gray-500">per night</span>
              </div>
              
              <p className="text-sm text-gray-600">
                $
                {hotel.property.priceBreakdown.grossPrice.value.toLocaleString()}{" "}
                total ({diffDays} nights)
              </p>
              {hotel.property.priceBreakdown.excludedPrice && (
                <p className="text-xs text-gray-500">
                  Excludes $
                  {hotel.property.priceBreakdown.excludedPrice.value.toLocaleString()}{" "}
                  in taxes & fees
                </p>
              )}
            </div>

            <Button 
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
            >
              Book
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
