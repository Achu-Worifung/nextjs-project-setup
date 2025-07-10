"use client";
import { useRouter } from "next/navigation";
import { hotel_type } from "@/lib/types";
import { Star, MapPin, Wifi, Heart, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-yellow-200 text-yellow-400" />);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }
    
    return stars;
  };

  return (
    <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer bg-white"
          onClick={handleClick}>
      <div data-testid="hotel-card" className="relative">
        {/* Hotel Image Section with Overlay */}
        <div className="relative h-64 w-full overflow-hidden">
          <Image
            src={hotel.property.photoUrls[0] || '/des1.jpg'}
            alt={hotel.property.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Top-right badges */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-8 w-8 bg-white/90 hover:bg-white shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <Heart className="h-4 w-4 text-gray-600" />
            </Button>
            
            {hotel.property.priceBreakdown.strikethroughPrice && (
              <Badge className="bg-red-500 hover:bg-red-600 text-white font-semibold">
                Save $
                {(
                  hotel.property.priceBreakdown.strikethroughPrice.value -
                  hotel.property.priceBreakdown.grossPrice.value
                ).toLocaleString()}
              </Badge>
            )}
          </div>

          {/* Bottom overlay with location */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center text-white mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">
                {hotel.property.wishlistName || 'City Center'}
              </span>
            </div>
          </div>
        </div>

        {/* Additional hover animations and responsive improvements */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/0 to-blue-600/0 group-hover:from-blue-600/10 group-hover:to-transparent transition-all duration-300" />

        <CardContent className="p-6">
          {/* Hotel Name and Rating */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {hotel.property.name}
              </h3>
              
              {/* Star Rating */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {renderStars(hotel.property.propertyClass || 4)}
                </div>
                <span className="text-sm text-gray-500">
                  {hotel.property.propertyClass || 4} Star Hotel
                </span>
              </div>
            </div>
          </div>

          {/* Review Score Section */}
          {hotel.property.reviewScore && (
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center bg-blue-600 text-white px-3 py-2 rounded-lg">
                <span className="text-lg font-bold">
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
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
              <Wifi className="w-3 h-3 mr-1" />
              Free WiFi
            </Badge>
            {hotel.property.priceBreakdown.benefitBadges
              ?.slice(0, 2)
              .map((badge, index) => (
                <Badge key={index} variant="outline" className="text-gray-600">
                  {badge.text}
                </Badge>
              ))}
            <Badge variant="outline" className="text-blue-600">
              {diffDays} night{diffDays > 1 ? 's' : ''}
            </Badge>
          </div>

          {/* Price Section */}
          <div className="flex justify-between items-end">
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                {hotel.property.priceBreakdown.strikethroughPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    $
                    {Math.round(
                      hotel.property.priceBreakdown.strikethroughPrice.value / diffDays
                    ).toLocaleString()}
                  </span>
                )}
                <span className="text-3xl font-bold text-gray-900">
                  $
                  {Math.round(
                    hotel.property.priceBreakdown.grossPrice.value / diffDays
                  ).toLocaleString()}
                </span>
                <span className="text-sm text-gray-600">/ night</span>
              </div>
              
              <div className="text-sm text-gray-600 mt-1">
                <span className="font-semibold">
                  $
                  {hotel.property.priceBreakdown.grossPrice.value.toLocaleString()}{" "}
                  total
                </span>
                {hotel.property.priceBreakdown.excludedPrice && (
                  <span className="ml-2">
                    +$
                    {hotel.property.priceBreakdown.excludedPrice.value.toLocaleString()}{" "}
                    taxes
                  </span>
                )}
              </div>
            </div>

            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={handleClick}
            >
              View Deal
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
