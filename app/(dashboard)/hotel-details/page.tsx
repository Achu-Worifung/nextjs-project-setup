"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Users, Bed, Star, Wifi, Car, Coffee, Utensils, Waves, Dumbbell, Calendar, ThumbsUp, MessageCircle } from "lucide-react";
import { HotelData } from "@/lib/types";
import { format } from "date-fns";

const HotelDetailsPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [hotel, setHotel] = useState<HotelData | null>(null);
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState<number>(1);

  useEffect(() => {
    // Get hotel data from URL parameters
    const hotelData = searchParams?.get("hotel");
    const checkIn = searchParams?.get("checkIn");
    const checkOut = searchParams?.get("checkOut");
    const guestCount = searchParams?.get("guests");

    if (hotelData) {
      try {
        const parsedHotel = JSON.parse(decodeURIComponent(hotelData));
        setHotel(parsedHotel);
        
        if (checkIn) setCheckInDate(new Date(checkIn));
        if (checkOut) setCheckOutDate(new Date(checkOut));
        if (guestCount) setGuests(parseInt(guestCount));
      } catch (error) {
        console.error("Error parsing hotel data:", error);
        router.push("/hotel-search");
      }
    } else {
      router.push("/hotel-search");
    }
  }, [searchParams, router]);

  if (!hotel) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading hotel details...</p>
        </div>
      </div>
    );
  }

  const nights = checkInDate && checkOutDate 
    ? Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
    : 1;

  const handleBookRoom = (room: any) => {
    // Navigate to booking page with hotel and room details
    const bookingParams = new URLSearchParams({
      hotel: encodeURIComponent(JSON.stringify(hotel)),
      room: encodeURIComponent(JSON.stringify(room)),
      checkIn: checkInDate?.toISOString() || "",
      checkOut: checkOutDate?.toISOString() || "",
      guests: guests.toString(),
      nights: nights.toString(),
    });
    router.push(`/hotel-booking?${bookingParams.toString()}`);
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'free wifi':
        return <Wifi className="h-4 w-4" />;
      case 'free parking':
        return <Car className="h-4 w-4" />;
      case 'swimming pool':
        return <Waves className="h-4 w-4" />;
      case 'fitness center':
        return <Dumbbell className="h-4 w-4" />;
      case 'restaurant':
        return <Utensils className="h-4 w-4" />;
      case 'coffee maker':
        return <Coffee className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Search
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{hotel.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="h-4 w-4 text-gray-500" />
                <p className="text-gray-600">{hotel.address}</p>
                <div className="flex items-center gap-1 ml-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{hotel.reviewSummary.averageRating.toFixed(1)}</span>
                  <span className="text-sm text-gray-500">({hotel.reviewSummary.totalReviews} reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Hotel Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hotel Images */}
            <Card>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4">
                  {/* Use placeholder divs since images property doesn't exist */}
                  {[1].map((index) => (
                    <div key={index} className={`relative ${index === 1 ? 'md:row-span-2' : ''}`}>
                      <div
                        className={`w-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center ${
                          index === 1 ? 'h-[300px]' : 'h-48 md:h-32'
                        }`}
                      >
                        <div className="text-center text-gray-500">
                          <div className="text-2xl mb-2">🏨</div>
                          <p className="text-sm font-medium">{hotel.name}</p>
                          <p className="text-xs">Photo {index}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Hotel Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Property</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  {hotel.description || `Experience comfort and luxury at ${hotel.name}. Our property offers exceptional service and modern amenities in ${hotel.address}.`}
                </p>
                
                {/* Amenities */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Popular Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['Free WiFi', 'Free Parking', 'Swimming Pool', 'Fitness Center', 'Restaurant', 'Coffee Maker'].map((amenity) => (
                      <div key={amenity} className="flex items-center gap-2 text-sm">
                        {getAmenityIcon(amenity)}
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Policies */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Hotel Policies</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>Check-in:</strong> {hotel.policies.checkIn.startTime} - {hotel.policies.checkIn.endTime}</p>
                    <p><strong>Check-out:</strong> {hotel.policies.checkOut.time}</p>
                    <p><strong>Pets:</strong> {hotel.policies.petsAllowed ? 'Allowed' : 'Not allowed'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Available Rooms */}
            <Card>
              <CardHeader>
                <CardTitle>Available Rooms</CardTitle>
                {checkInDate && checkOutDate && (
                  <p className="text-sm text-gray-600">
                    {format(checkInDate, "MMM dd")} - {format(checkOutDate, "MMM dd")} • {nights} night{nights > 1 ? 's' : ''} • {guests} guest{guests > 1 ? 's' : ''}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hotel.rooms.map((room, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-lg">{room.type}</h4>
                          <p className="text-sm text-gray-600">Comfortable room with modern amenities</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>Up to 4 guests</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Bed className="h-4 w-4" />
                              <span>{room.bedCount} bed{room.bedCount > 1 ? 's' : ''}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">
                            ${room.pricePerNight}
                          </div>
                          <div className="text-xs text-gray-500">per night</div>
                          {nights > 1 && (
                            <div className="text-sm text-gray-600 mt-1">
                              ${(room.pricePerNight * nights).toFixed(2)} total
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Room Features */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {room.accessibleFeatures.slice(0, 4).map((feature: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {room.accessibleFeatures.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{room.accessibleFeatures.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Includes */}
                      <div className="mb-4 text-sm">
                        <div className="flex flex-wrap gap-4 text-green-600">
                          {room.includes.breakfast && <span>✓ Breakfast included</span>}
                          {room.includes.lunch && <span>✓ Lunch included</span>}
                          <span>✓ Free WiFi</span>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleBookRoom(room)}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        Select This Room
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Guest Reviews */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Guest Reviews
                </CardTitle>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-600 text-white w-12 h-12 rounded-lg flex items-center justify-center">
                      <span className="text-lg font-bold">
                        {hotel.reviewSummary.averageRating.toFixed(1)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">
                        {hotel.reviewSummary.averageRating >= 4.5 ? 'Excellent' : 
                         hotel.reviewSummary.averageRating >= 4.0 ? 'Very Good' :
                         hotel.reviewSummary.averageRating >= 3.5 ? 'Good' : 'Fair'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Based on {hotel.reviewSummary.totalReviews} reviews
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Sample Reviews */}
                  {[
                    {
                      name: "Sarah M.",
                      rating: 5,
                      date: "2 weeks ago",
                      comment: "Absolutely fantastic stay! The room was spacious and clean, and the staff went above and beyond to make our stay comfortable. The location is perfect for exploring the city.",
                      helpful: 12
                    },
                    {
                      name: "Mike R.",
                      rating: 4,
                      date: "1 month ago", 
                      comment: "Great hotel with excellent amenities. The breakfast was delicious and the fitness center was well-equipped. Only minor issue was the WiFi speed in some areas.",
                      helpful: 8
                    },
                    {
                      name: "Jennifer L.",
                      rating: 5,
                      date: "1 month ago",
                      comment: "Perfect for a business trip. The rooms are modern and comfortable, and the business center has everything you need. Highly recommend!",
                      helpful: 15
                    }
                  ].map((review, index) => (
                    <div key={index} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{review.name}</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? 'text-yellow-500 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{review.comment}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{review.date}</span>
                            <button className="flex items-center gap-1 hover:text-blue-600">
                              <ThumbsUp className="w-3 h-3" />
                              Helpful ({review.helpful})
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full mt-4">
                    View All Reviews ({hotel.reviewSummary.totalReviews})
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Frequently Asked Questions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      question: "Is parking available at the hotel?",
                      answer: "Yes, we offer complimentary self-parking for all guests. Valet parking is also available for an additional fee."
                    },
                    {
                      question: "What time is check-in and check-out?",
                      answer: `Check-in is available from ${hotel.policies.checkIn.startTime} to ${hotel.policies.checkIn.endTime}. Check-out is at ${hotel.policies.checkOut.time}. Early check-in and late check-out may be available upon request.`
                    },
                    {
                      question: "Does the hotel offer airport transportation?",
                      answer: "We provide a complimentary shuttle service to and from the airport. The shuttle runs every 30 minutes during peak hours. Please contact the front desk to arrange pickup."
                    },
                    {
                      question: "Are pets allowed at the hotel?",
                      answer: hotel.policies.petsAllowed 
                        ? "Yes, we welcome pets! There is a pet fee of $25 per night. Please inform us in advance if you'll be traveling with pets."
                        : "Unfortunately, pets are not allowed at our property, with the exception of service animals."
                    },
                    {
                      question: "What dining options are available?",
                      answer: "Our hotel features an on-site restaurant serving breakfast, lunch, and dinner. We also have a 24-hour room service menu and a lobby bar open until midnight."
                    },
                    {
                      question: "Is WiFi included?",
                      answer: "Yes, complimentary high-speed WiFi is available throughout the hotel, including all guest rooms and public areas."
                    }
                  ].map((faq, index) => (
                    <div key={index} className="border-b pb-4 last:border-b-0">
                      <h4 className="font-medium text-gray-900 mb-2">{faq.question}</h4>
                      <p className="text-sm text-gray-600">{faq.answer}</p>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full mt-4">
                    Contact Hotel for More Questions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Your Stay</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Check-in</span>
                    <span className="font-medium">
                      {checkInDate ? format(checkInDate, "MMM dd, yyyy") : "Select date"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Check-out</span>
                    <span className="font-medium">
                      {checkOutDate ? format(checkOutDate, "MMM dd, yyyy") : "Select date"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Guests</span>
                    <span className="font-medium">{guests}</span>
                  </div>
                  {nights > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Nights</span>
                      <span className="font-medium">{nights}</span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="text-center text-sm text-gray-600">
                    Select a room above to see pricing details
                  </div>
                </div>

                {/* Hotel Contact Info */}
                <div className="border-t pt-4 text-sm text-gray-600">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{hotel.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Check-in: {hotel.policies.checkIn.startTime}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetailsPage;
