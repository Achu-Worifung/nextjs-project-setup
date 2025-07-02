"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Bed, 
  CreditCard, 
  User, 
  Shield,
  CheckCircle,
  Users,
  Calendar,
  MapPin
} from "lucide-react";
import { HotelData, RoomDetails } from "@/lib/types";
import { tokenManager } from "@/lib/token-manager";
import { format } from "date-fns";

class HotelBookingService {
  getAuthHeaders() {
    const token = tokenManager.get();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async bookHotel(bookingData: {
    token: string;
    checkInDate: string;
    checkOutDate: string;
    guests: number;
    totalPrice: number;
    hotelDetails: {
      hotelName: string;
      hotelAddress: string;
      hotelCity: string;
      hotelCountry: string;
      hotelRating?: number;
      roomType: string;
      roomDescription?: string;
      maxOccupancy: number;
      nights: number;
      basePrice: number;
      discounts?: number;
      tax: number;
      amenities?: string[];
      checkInTime?: string;
      checkOutTime?: string;
    };
  }) {
    try {
      const headers = this.getAuthHeaders();
      
      const response = await fetch('/api/bookings/hotel', {
        method: 'POST',
        headers,
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Booking failed');
      }

      return data;
    } catch (error) {
      console.error('Hotel booking error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}

const hotelBookingService = new HotelBookingService();

const HotelBookingPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [hotel, setHotel] = useState<HotelData | null>(null);
  const [room, setRoom] = useState<RoomDetails | null>(null);
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState<number>(1);
  const [nights, setNights] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);

  // Passenger Information
  const [guestInfo, setGuestInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: "",
  });

  // Payment Information
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    billingAddress: "",
    city: "",
    zipCode: "",
    country: "",
  });

  useEffect(() => {
    // Get booking data from URL parameters
    const hotelData = searchParams?.get("hotel");
    const roomData = searchParams?.get("room");
    const checkIn = searchParams?.get("checkIn");
    const checkOut = searchParams?.get("checkOut");
    const guestCount = searchParams?.get("guests");
    const nightCount = searchParams?.get("nights");

    if (hotelData && roomData) {
      try {
        const parsedHotel = JSON.parse(decodeURIComponent(hotelData));
        const parsedRoom = JSON.parse(decodeURIComponent(roomData));
        
        setHotel(parsedHotel);
        setRoom(parsedRoom);
        
        if (checkIn) setCheckInDate(new Date(checkIn));
        if (checkOut) setCheckOutDate(new Date(checkOut));
        if (guestCount) setGuests(parseInt(guestCount));
        if (nightCount) setNights(parseInt(nightCount));
      } catch (error) {
        console.error("Error parsing booking data:", error);
        router.push("/hotel-search");
      }
    } else {
      router.push("/hotel-search");
    }
  }, [searchParams, router]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if hotel and room data are available
      if (!hotel || !room || !checkInDate || !checkOutDate) {
        throw new Error('Booking data not available');
      }

      // Validate form data
      if (!guestInfo.firstName || !guestInfo.lastName || !guestInfo.email || !guestInfo.phone) {
        throw new Error('Please fill in all required guest information');
      }

      if (!paymentInfo.cardNumber || !paymentInfo.expiryDate || !paymentInfo.cvv || !paymentInfo.cardholderName) {
        throw new Error('Please fill in all required payment information');
      }

      // Get the token
      const token = tokenManager.get();
      if (!token) {
        throw new Error('Please log in to complete your booking');
      }

      // Calculate total price
      const basePrice = room.pricePerNight * nights;
      const tax = basePrice * 0.12; // 12% tax
      const totalPrice = basePrice + tax;

      // Prepare booking data
      const bookingData = {
        token,
        checkInDate: checkInDate.toISOString().split('T')[0],
        checkOutDate: checkOutDate.toISOString().split('T')[0],
        guests,
        totalPrice,
        hotelDetails: {
          hotelName: hotel.name,
          hotelAddress: hotel.address,
          hotelCity: hotel.address.split(',')[1]?.trim() || 'Unknown',
          hotelCountry: 'USA', // Default for now
          hotelRating: hotel.reviewSummary.averageRating,
          roomType: room.type,
          roomDescription: `Comfortable ${room.type} with modern amenities`,
          maxOccupancy: 4, // Default max occupancy
          nights,
          basePrice: room.pricePerNight,
          tax,
          amenities: room.accessibleFeatures,
          checkInTime: hotel.policies.checkIn.startTime,
          checkOutTime: hotel.policies.checkOut.time,
        },
      };

      // Call the booking API
      const result = await hotelBookingService.bookHotel(bookingData);

      if (result.success) {
        setBookingComplete(true);
      } else {
        throw new Error(result.error || 'Booking failed');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert(error instanceof Error ? error.message : 'Booking failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (section: 'guest' | 'payment', field: string, value: string) => {
    if (section === 'guest') {
      setGuestInfo(prev => ({ ...prev, [field]: value }));
    } else {
      setPaymentInfo(prev => ({ ...prev, [field]: value }));
    }
  };

  if (!hotel || !room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-4">
              Your hotel reservation has been successfully booked. You will receive a confirmation email shortly.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium text-gray-700">Booking Reference</p>
              <p className="text-lg font-bold text-blue-600">HB{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            </div>
            <div className="space-y-3">
              <Button 
                onClick={() => router.push("/mybookings")}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                View My Bookings
              </Button>
              <Button 
                onClick={() => router.push("/hotel-search")}
                variant="outline"
                className="w-full"
              >
                Book Another Hotel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const basePrice = room.pricePerNight * nights;
  const tax = basePrice * 0.12;
  const totalPrice = basePrice + tax;

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
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Complete Your Booking</h1>
              <p className="text-gray-600">
                {hotel.name} • {room.type}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleBookingSubmit}>
              {/* Guest Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Guest Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        required
                        value={guestInfo.firstName}
                        onChange={(e) => handleInputChange('guest', 'firstName', e.target.value)}
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        required
                        value={guestInfo.lastName}
                        onChange={(e) => handleInputChange('guest', 'lastName', e.target.value)}
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={guestInfo.email}
                        onChange={(e) => handleInputChange('guest', 'email', e.target.value)}
                        placeholder="john.doe@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={guestInfo.phone}
                        onChange={(e) => handleInputChange('guest', 'phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="specialRequests">Special Requests</Label>
                    <Input
                      id="specialRequests"
                      value={guestInfo.specialRequests}
                      onChange={(e) => handleInputChange('guest', 'specialRequests', e.target.value)}
                      placeholder="Any special accommodations needed..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      required
                      value={paymentInfo.cardNumber}
                      onChange={(e) => handleInputChange('payment', 'cardNumber', e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                      <Label htmlFor="expiryDate">Expiry Date *</Label>
                      <Input
                        id="expiryDate"
                        required
                        value={paymentInfo.expiryDate}
                        onChange={(e) => handleInputChange('payment', 'expiryDate', e.target.value)}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div className="md:col-span-1">
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        required
                        value={paymentInfo.cvv}
                        onChange={(e) => handleInputChange('payment', 'cvv', e.target.value)}
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                    <div className="md:col-span-1">
                      <Label htmlFor="cardholderName">Cardholder Name *</Label>
                      <Input
                        id="cardholderName"
                        required
                        value={paymentInfo.cardholderName}
                        onChange={(e) => handleInputChange('payment', 'cardholderName', e.target.value)}
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <h4 className="font-medium">Billing Address</h4>
                    <div>
                      <Label htmlFor="billingAddress">Address *</Label>
                      <Input
                        id="billingAddress"
                        required
                        value={paymentInfo.billingAddress}
                        onChange={(e) => handleInputChange('payment', 'billingAddress', e.target.value)}
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          required
                          value={paymentInfo.city}
                          onChange={(e) => handleInputChange('payment', 'city', e.target.value)}
                          placeholder="New York"
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP Code *</Label>
                        <Input
                          id="zipCode"
                          required
                          value={paymentInfo.zipCode}
                          onChange={(e) => handleInputChange('payment', 'zipCode', e.target.value)}
                          placeholder="10001"
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">Country *</Label>
                        <Input
                          id="country"
                          required
                          value={paymentInfo.country}
                          onChange={(e) => handleInputChange('payment', 'country', e.target.value)}
                          placeholder="United States"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Shield className="h-5 w-5 mr-2" />
                    Complete Booking - ${totalPrice.toFixed(2)}
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Hotel Details */}
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-lg">{hotel.name}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{hotel.address}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Bed className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{room.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{guests} guest{guests > 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          {checkInDate && format(checkInDate, "MMM dd")} - {checkOutDate && format(checkOutDate, "MMM dd")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Pricing Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">${room.pricePerNight} x {nights} night{nights > 1 ? 's' : ''}</span>
                    <span className="text-sm">${basePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Taxes & Fees</span>
                    <span className="text-sm">${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                {/* Security Notice */}
                <div className="text-xs text-gray-500 text-center">
                  <Shield className="h-4 w-4 mx-auto mb-1" />
                  Your payment is secured with 256-bit SSL encryption
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelBookingPage;
