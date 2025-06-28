"use client";
import React, { useState } from "react";
import { hotel_type } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Star,
  MapPin,
  Heart,
  X,
  Wifi,
  Car,
  Utensils,
  Dumbbell,
  Waves,
  Coffee,
  Shield,
  Users,
  Clock,
  Phone,
  Mail,
  Bed,
  Maximize,
  CheckCircle,
  CarTaxiFront,
  Building2,
  Camera
} from "lucide-react";
import Image from "next/image";

interface HotelDetailsDrawerProps {
  hotel: hotel_type | null;
  isOpen: boolean;
  onClose: () => void;
  checkInDate: Date | undefined;
  checkOutDate: Date | undefined;
  guests: number;
}

// Mock room data based on hotel - in a real app this would come from an API
const generateRoomData = (hotel: hotel_type) => {
  const basePrice = hotel.property.priceBreakdown.grossPrice.value;
  const nights = Math.ceil((new Date(hotel.property.checkoutDate).getTime() - new Date(hotel.property.checkinDate).getTime()) / (1000 * 60 * 60 * 24));
  const pricePerNight = Math.round(basePrice / Math.max(nights, 1));

  return [
    {
      id: 1,
      type: "Standard Room",
      description: "Comfortable room with modern amenities and city view",
      pricePerNight: pricePerNight,
      originalPrice: Math.round(pricePerNight * 1.2),
      size: "320 sq ft",
      bedType: "1 Queen Bed",
      maxOccupancy: 2,
      amenities: ["Free WiFi", "Coffee Maker", "Air Conditioning", "Flat-screen TV"],
      images: ["/des1.jpg", "/des2.jpg"],
      availableRooms: 3,
      mostPopular: false,
      breakfast: false
    },
    {
      id: 2,
      type: "Deluxe Room",
      description: "Spacious room with premium amenities and partial ocean view",
      pricePerNight: Math.round(pricePerNight * 1.3),
      originalPrice: Math.round(pricePerNight * 1.5),
      size: "450 sq ft",
      bedType: "1 King Bed or 2 Queen Beds",
      maxOccupancy: 4,
      amenities: ["Free WiFi", "Coffee Maker", "Mini Fridge", "Premium TV", "Balcony"],
      images: ["/des4.jpg", "/des5.webp"],
      availableRooms: 2,
      mostPopular: true,
      breakfast: true
    },
    {
      id: 3,
      type: "Executive Suite",
      description: "Luxurious suite with separate living area and premium services",
      pricePerNight: Math.round(pricePerNight * 2),
      originalPrice: Math.round(pricePerNight * 2.4),
      size: "650 sq ft",
      bedType: "1 King Bed + Sofa Bed",
      maxOccupancy: 4,
      amenities: ["Free WiFi", "Full Kitchen", "Living Room", "Premium TV", "Balcony", "Business Center Access"],
      images: ["/des6.png", "/des7.webp"],
      availableRooms: 1,
      mostPopular: false,
      breakfast: true
    }
  ];
};

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

const mockPolicies = [
  { title: "Check-in", content: "3:00 PM - 12:00 AM", icon: Clock },
  { title: "Check-out", content: "12:00 PM", icon: Clock },
  { title: "Cancellation", content: "Free cancellation up to 24 hours before check-in", icon: Shield },
  { title: "Pet Policy", content: "Pets not allowed", icon: Heart },
  { title: "Children", content: "Children up to 12 stay free with existing bedding", icon: Users }
];

export function HotelDetailsDrawer({
  hotel,
  isOpen,
  onClose,
  checkInDate,
  checkOutDate,
  guests
}: HotelDetailsDrawerProps) {
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!hotel) return null;

  const rooms = generateRoomData(hotel);
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

  const handleBookRoom = (roomId: number) => {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      // In a real app, this would navigate to booking flow or open booking modal
      alert(`Booking ${room.type} for ${nights} night(s). Total: $${room.pricePerNight * nights}`);
    }
  };

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
                {hotel.property.name}
              </h2>
              <Button variant="ghost" size="icon" className="rounded-full" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                {renderStars(hotel.property.reviewScore)}
                <span className="ml-2 text-sm font-medium">{hotel.property.reviewScore}</span>
                <span className="text-sm text-gray-500">({hotel.property.reviewCount} reviews)</span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                {hotel.property.reviewScoreWord}
              </Badge>
            </div>
            
            <div className="flex items-center gap-1 text-gray-600 mt-1">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Downtown • 0.5 km from city center</span>
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
                        src={hotel.property.photoUrls[currentImageIndex] || '/des1.jpg'}
                        alt={hotel.property.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
                        <span className="text-white text-sm flex items-center gap-1">
                          <Camera className="w-4 h-4" />
                          {currentImageIndex + 1} / {hotel.property.photoUrls.length}
                        </span>
                      </div>
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        {hotel.property.photoUrls.map((_, index) => (
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
                      Experience luxury and comfort at {hotel.property.name}. Located in the heart of the city, 
                      our hotel offers modern accommodations with stunning views and exceptional service. 
                      Perfect for both business and leisure travelers, featuring elegant rooms, world-class amenities, 
                      and convenient access to major attractions.
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

                {/* Policies */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Policies & Information</h3>
                    <div className="space-y-4">
                      {mockPolicies.map((policy) => (
                        <div key={policy.title} className="flex items-start gap-3">
                          <policy.icon className="w-5 h-5 text-gray-600 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-900">{policy.title}</div>
                            <div className="text-sm text-gray-600">{policy.content}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Room Selection */}
              <div className="space-y-4">
                <Card className="sticky top-4">
                  <CardContent className="p-6">
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
                      {rooms.map((room) => (
                        <Card 
                          key={room.id} 
                          className={`cursor-pointer transition-all ${
                            selectedRoom === room.id ? 'ring-2 ring-blue-500 border-blue-500' : 'hover:shadow-md'
                          }`}
                          onClick={() => setSelectedRoom(room.id)}
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
                                <p className="text-sm text-gray-600 mb-2">{room.description}</p>
                                
                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                                  <span className="flex items-center gap-1">
                                    <Maximize className="w-3 h-3" />
                                    {room.size}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Bed className="w-3 h-3" />
                                    {room.bedType}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    Up to {room.maxOccupancy}
                                  </span>
                                </div>

                                <div className="flex flex-wrap gap-1 mb-2">
                                  {room.amenities.slice(0, 3).map((amenity) => (
                                    <Badge key={amenity} variant="outline" className="text-xs">
                                      {amenity}
                                    </Badge>
                                  ))}
                                  {room.amenities.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{room.amenities.length - 3} more
                                    </Badge>
                                  )}
                                </div>

                                {room.breakfast && (
                                  <div className="flex items-center gap-1 text-green-600 text-xs">
                                    <Coffee className="w-3 h-3" />
                                    Free Breakfast Included
                                  </div>
                                )}
                              </div>

                              <div className="text-right ml-4">
                                <div className="text-right mb-1">
                                  {room.originalPrice > room.pricePerNight && (
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
                                    handleBookRoom(room.id);
                                  }}
                                >
                                  Book Now
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

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
    </div>
  );
}
