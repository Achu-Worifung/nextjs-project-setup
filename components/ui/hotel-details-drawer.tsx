"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { HotelData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AuthModal } from "@/components/ui/auth-modal";
import { HotelBookingSuccessModal } from "@/components/ui/hotel-booking-success-modal";
import { bookingService, HotelBookingRequest, HotelBooking } from "@/lib/booking-service";
import { useAuth } from "@/context/AuthContext";
import {
  Star,
  MapPin,
  X,
  Wifi,
  Car,
  Utensils,
  Dumbbell,
  Waves,
  Coffee,
  Shield,
  Users,
  Phone,
  Mail,
  Bed,
  CheckCircle,
  CarTaxiFront,
  Building2,
  Camera,
  Loader2
} from "lucide-react";
import Image from "next/image";

interface HotelDetailsDrawerProps {
  hotel: HotelData | null;
  isOpen: boolean;
  onClose: () => void;
  checkInDate: Date | undefined;
  checkOutDate: Date | undefined;
  guests: number;
}

const mockAmenities = [
  { name: "Free WiFi", icon: Wifi, available: true },
  { name: "Free Parking", icon: Car, available: true },
  { name: "Restaurant", icon: Utensils, available: true },
  { name: "Fitness Center", icon: Dumbbell, available: true },
  { name: "Swimming Pool", icon: Waves, available: true },
  { name: "Coffee Shop", icon: Coffee, available: true },
  { name: "Airport Shuttle", icon: CarTaxiFront, available: false },
  { name: "Business Center", icon: Building2, available: true },
  { name: "24/7 Security", icon: Shield, available: true }
];

export function HotelDetailsDrawer({
  hotel,
  isOpen,
  onClose,
  checkInDate,
  checkOutDate,
  guests
}: HotelDetailsDrawerProps) {
  const router = useRouter();
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingResult, setBookingResult] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successBooking, setSuccessBooking] = useState<HotelBooking | null>(null);
  const { token, isSignedIn } = useAuth();

  if (!hotel) return null;

  const nights = checkInDate && checkOutDate 
    ? Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
    : 1;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const handleBookRoom = async (roomId: number) => {
    console.log("User authenticated:", isSignedIn);

    if (!isSignedIn || !token) {
      setShowAuthModal(true);
      return;
    }

    if (!checkInDate || !checkOutDate) {
      setBookingResult("Please select check-in and check-out dates");
      return;
    }

    const room = hotel.rooms.find(r => r.type === hotel.rooms[roomId]?.type);
    if (!room) {
      setBookingResult("Selected room is not available");
      return;
    }

    setIsBooking(true);
    setBookingResult(null);

    try {
      const totalPrice = room.pricePerNight * nights;
      const taxRate = 0.12; // 12% tax
      const tax = totalPrice * taxRate;
      const finalTotal = totalPrice + tax;

      const bookingData: HotelBookingRequest = {
        checkInDate: checkInDate.toISOString().split('T')[0],
        checkOutDate: checkOutDate.toISOString().split('T')[0],
        guests: guests,
        totalPrice: finalTotal,
        hotelDetails: {
          hotelName: hotel.name,
          hotelAddress: hotel.address,
          hotelCity: hotel.address.split(',')[0]?.trim() || 'Unknown',
          hotelCountry: hotel.address.split(',')[1]?.trim() || 'Unknown',
          hotelRating: hotel.reviewSummary.averageRating,
          roomType: room.type,
          roomDescription: `Comfortable ${room.type} room with modern amenities`,
          maxOccupancy: room.bedCount * 2 || guests,
          nights: nights,
          basePrice: totalPrice,
          tax: tax,
          amenities: mockAmenities.filter(a => a.available).map(a => a.name),
          images: ['/des1.jpg', '/des2.jpg', '/des4.jpg', '/des5.webp'],
          checkInTime: '3:00 PM',
          checkOutTime: '11:00 AM',
        },
      };

      const response = await bookingService.bookHotel(bookingData);
      
      if (response.success && response.booking) {
        // Set booking data for success modal - ensure it's a hotel booking
        if ('hotelBookingId' in response.booking) {
          setSuccessBooking(response.booking as HotelBooking);
          setShowSuccessModal(true);
          setBookingResult(null); // Clear any previous error messages
        } else {
          setBookingResult("❌ Invalid booking response received");
        }
      } else {
        setBookingResult(`❌ Booking failed: ${response.error}`);
      }
    } catch (error) {
      setBookingResult(`❌ Booking failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsBooking(false);
    }
  };

  const handleSignIn = () => {
    setShowAuthModal(false);
    router.push('/signin');
  };

  const handleSignUp = () => {
    setShowAuthModal(false);
    router.push('/signup');
  };

  const handleAuthModalClose = () => {
    setShowAuthModal(false);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setSuccessBooking(null);
    onClose();
  };

  // Get only the first 3 reviews and FAQs with defensive checks
  const displayReviews = (hotel.reviews || []).slice(0, 3);
  const displayFaqs = (hotel.faqs || []).slice(0, 3);

  // Mock photo URLs for demo - in real app these would come from hotel data
  const mockPhotoUrls = ['/des1.jpg', '/des2.jpg', '/des4.jpg', '/des5.webp'];

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/80" onClick={onClose} />
      
      {/* Drawer Content */}
      <div className="fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] bg-white max-h-[90vh] overflow-hidden">
        <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-gray-300" />
        
        <div className="mx-auto w-full max-w-6xl">
          <div className="pb-2 px-6 pt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {hotel.name}
              </h2>
              <Button variant="ghost" size="icon" className="rounded-full" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                {renderStars(hotel.reviewSummary.averageRating)}
                <span className="ml-2 text-sm font-medium">{hotel.reviewSummary.averageRating}</span>
                <span className="text-sm text-gray-500">({hotel.reviewSummary.totalReviews} reviews)</span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                {hotel.reviewSummary.averageRating >= 4.5 ? 'Excellent' : 
                 hotel.reviewSummary.averageRating >= 4.0 ? 'Very Good' : 
                 hotel.reviewSummary.averageRating >= 3.5 ? 'Good' : 'Fair'}
              </Badge>
            </div>
            
            <div className="flex items-center gap-1 text-gray-600 mt-1">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{hotel.address}</span>
            </div>
          </div>

          <div className="px-6 pb-6 max-h-[75vh] overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Hotel Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Image Gallery */}
                <Card>
                  <CardContent className="p-0">
                    <div className="relative h-64 rounded-lg overflow-hidden">
                      <Image
                        src={mockPhotoUrls[currentImageIndex] || '/des1.jpg'}
                        alt={hotel.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
                        <span className="text-white text-sm flex items-center gap-1">
                          <Camera className="w-4 h-4" />
                          {currentImageIndex + 1} / {mockPhotoUrls.length}
                        </span>
                      </div>
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        {mockPhotoUrls.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Description */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-3">About this hotel</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {hotel.description}
                    </p>
                  </CardContent>
                </Card>

                {/* Amenities */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Hotel Amenities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {mockAmenities.map((amenity) => (
                        <div key={amenity.name} className="flex items-center gap-3">
                          <amenity.icon className={`w-5 h-5 ${amenity.available ? 'text-green-600' : 'text-gray-400'}`} />
                          <span className={`text-sm ${amenity.available ? 'text-gray-900' : 'text-gray-400'}`}>
                            {amenity.name}
                          </span>
                          {amenity.available && <CheckCircle className="w-4 h-4 text-green-600" />}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Reviews */}
                {displayReviews.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Guest Reviews</h3>
                      <div className="space-y-4">
                        {displayReviews.map((review, index) => (
                          <div key={index} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex items-center gap-1">
                                {renderStars(typeof review.rating === 'number' ? review.rating : 0)}
                              </div>
                              <span className="font-medium text-gray-900">
                                {typeof review.username === 'string' ? review.username : 'Anonymous'}
                              </span>
                              <span className="text-sm text-gray-500">
                                {typeof review.date === 'string' ? review.date : 'Date not available'}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {typeof review.comment === 'string' ? review.comment : 'Review not available'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* FAQs */}
                {displayFaqs.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Frequently Asked Questions</h3>
                      <div className="space-y-4">
                        {displayFaqs.map((faq, index) => (
                          <div key={index} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                            <h4 className="font-medium text-gray-900 mb-2">
                              {typeof faq.question === 'string' ? faq.question : 'Question not available'}
                            </h4>
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {typeof faq.answer === 'string' ? faq.answer : 'Answer not available'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Policies */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Policies & Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-gray-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-gray-900">Check-in</div>
                          <div className="text-sm text-gray-600">
                            {hotel.policies?.checkIn?.startTime || '3:00 PM'} - {hotel.policies?.checkIn?.endTime || '12:00 AM'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-gray-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-gray-900">Check-out</div>
                          <div className="text-sm text-gray-600">
                            {hotel.policies?.checkOut?.time || '12:00 PM'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-gray-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-gray-900">Pet Policy</div>
                          <div className="text-sm text-gray-600">
                            {hotel.policies?.petsAllowed ? 'Pets allowed' : 'Pets not allowed'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-gray-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-gray-900">Children</div>
                          <div className="text-sm text-gray-600">
                            {hotel.policies?.childrenPolicy || 'Children up to 12 stay free with existing bedding'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Room Selection */}
              <div className="space-y-4">
                <Card className="top-4">
                  <CardContent className="p-3">
                    <h3 className="text-lg font-semibold mb-4">Choose your room</h3>
                    
                    {/* Booking Summary */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex justify-between">
                          <span>Check-in:</span>
                          <span className="font-medium">{checkInDate?.toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Check-out:</span>
                          <span className="font-medium">{checkOutDate?.toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Guests:</span>
                          <span className="font-medium">{guests} guest{guests > 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Nights:</span>
                          <span className="font-medium">{nights}</span>
                        </div>
                      </div>
                    </div>

                    {/* Room Options */}
                    <div className="space-y-4">
                      {hotel.rooms.map((room, index) => (
                        <Card 
                          key={index} 
                          className={`cursor-pointer transition-all ${
                            selectedRoom === index ? 'ring-2 ring-blue-500 border-blue-500' : 'hover:shadow-md'
                          }`}
                          onClick={() => setSelectedRoom(index)}
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold text-gray-900">{room.type}</h4>
                                  {room.mostPopular && (
                                    <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs">
                                      Most Popular
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mb-2">Comfortable accommodation with modern amenities</p>
                                
                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                                  <span className="flex items-center gap-1">
                                    <Bed className="w-3 h-3" />
                                    {room.bedCount} bed{room.bedCount > 1 ? 's' : ''}
                                  </span>
                                </div>

                                <div className="flex flex-wrap gap-1 mb-2">
                                  {room.accessibleFeatures.slice(0, 3).map((feature) => (
                                    <Badge key={feature} variant="outline" className="text-xs">
                                      {feature}
                                    </Badge>
                                  ))}
                                  {room.accessibleFeatures.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{room.accessibleFeatures.length - 3} more
                                    </Badge>
                                  )}
                                </div>

                                {room.includes.breakfast && (
                                  <div className="flex items-center gap-1 text-green-600 text-xs">
                                    <Coffee className="w-3 h-3" />
                                    Free Breakfast Included
                                  </div>
                                )}
                              </div>

                              <div className="text-right ml-4">
                                <div className="text-right mb-1">
                                  {room.originalPrice && room.originalPrice > room.pricePerNight && (
                                    <div className="text-xs text-gray-400 line-through">
                                      ${room.originalPrice}/night
                                    </div>
                                  )}
                                  <div className="text-lg font-bold text-gray-900">
                                    ${room.pricePerNight}
                                    <span className="text-sm font-normal text-gray-500">/night</span>
                                  </div>
                                </div>
                                <div className="text-sm text-gray-600 mb-2">
                                  Total: ${room.pricePerNight * nights}
                                </div>
                                <div className="text-xs text-gray-500 mb-3">
                                  {room.availableRooms} room{room.availableRooms > 1 ? 's' : ''} left
                                </div>
                                
                                <Button 
                                  size="sm" 
                                  className="w-full"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleBookRoom(index);
                                  }}
                                  disabled={isBooking || room.availableRooms === 0}
                                >
                                  {isBooking ? (
                                    <>
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                      Booking...
                                    </>
                                  ) : room.availableRooms > 0 ? (
                                    'Book Now'
                                  ) : (
                                    'Sold Out'
                                  )}
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Error Message */}
                    {bookingResult && (
                      <div className="mt-3 p-3 rounded-lg text-sm bg-red-100 text-red-800 border border-red-200">
                        {bookingResult}
                      </div>
                    )}

                    <div className="border-t my-4 pt-4">
                      {/* Contact Info */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900">Need help?</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span>+1 (555) 123-4567</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span>reservations@hotel.com</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={handleAuthModalClose}
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
      />

      {/* Success Modal */}
      <HotelBookingSuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        booking={successBooking}
      />
    </div>
  );
}
