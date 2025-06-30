"use client";
import { HotelData } from "@/lib/types";
import { Star, MapPin, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface HotelCardProps {
  hotel: HotelData;
  onHotelClick?: (hotel: HotelData) => void;
}

export function HotelCard({ hotel, onHotelClick }: HotelCardProps) {
  
  // Calculate nights (assume 1 night if not provided)
  const diffDays = 1; // Since we removed the mapping, we'll use 1 night for display
  
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

  // Get the first room for pricing
  const firstRoom = hotel.rooms[0];
  const hasOriginalPrice = firstRoom?.originalPrice && firstRoom.originalPrice > firstRoom.pricePerNight;

  return (
    <div 
      className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-50 hover:border-gray-100"
      onClick={handleClick}
    >
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src="/des1.jpg" // Use a default image since HotelData doesn't have photo URLs
          alt={hotel.name}
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
        {hasOriginalPrice && (
          <div className="absolute top-4 left-4">
            <div className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              SAVE {Math.round(((firstRoom.originalPrice! - firstRoom.pricePerNight) / firstRoom.originalPrice!) * 100)}%
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Hotel Name & Location */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {hotel.name}
          </h3>
          
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <MapPin className="w-4 h-4 mr-1.5" />
            <span>{hotel.address}</span>
          </div>
          
          {/* Star Rating */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {renderStars(Math.round(hotel.reviewSummary.averageRating))}
            </div>
            <span className="text-sm text-gray-500 ml-1">
              ({hotel.reviewSummary.totalReviews?.toLocaleString()})
            </span>
          </div>
        </div>

        {/* Reviews */}
        <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">
                {hotel.reviewSummary.averageRating.toFixed(1)}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {hotel.reviewSummary.averageRating >= 4.5 ? 'Excellent' : 
                 hotel.reviewSummary.averageRating >= 4.0 ? 'Very Good' :
                 hotel.reviewSummary.averageRating >= 3.5 ? 'Good' : 'Fair'}
              </p>
              <p className="text-xs text-gray-500">
                Based on {hotel.reviewSummary.totalReviews?.toLocaleString()} reviews
              </p>
            </div>
          </div>
        </div>

        {/* Price Section */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-end justify-between">
            <div>
              {hasOriginalPrice && (
                <p className="text-sm text-gray-400 line-through">
                  $
                  {firstRoom.originalPrice!.toLocaleString()}
                  <span className="text-xs"> per night</span>
                </p>
              )}
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-bold text-gray-900">
                  $
                  {firstRoom.pricePerNight.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500">per night</span>
              </div>
              
              <p className="text-sm text-gray-600">
                $
                {(firstRoom.pricePerNight * diffDays).toLocaleString()}{" "}
                total ({diffDays} night{diffDays > 1 ? 's' : ''})
              </p>
              <p className="text-xs text-gray-500">
                Excludes taxes & fees
              </p>
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
