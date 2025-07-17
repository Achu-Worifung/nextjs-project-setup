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
  Plane, 
  CreditCard, 
  User, 
  Shield,
  CheckCircle
} from "lucide-react";
import { Flight } from "@/lib/types";
import { tokenManager } from "@/lib/token-manager";

class BookingService {
  getAuthHeaders() {
    const token = tokenManager.get();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async bookFlight(bookingData: {
    token: string;
    flightNumber: string;
    airline: string;
    departureAirport: string;
    destinationAirport: string;
    departureTime: string;
    arrivalTime: string;
    flightClass: 'Economy' | 'Business' | 'First';
    price: number;
    numberOfSeats: number;
    flightDetails?: object;
  }) {
    try {
      const headers = this.getAuthHeaders();
      
      const response = await fetch('/api/bookings/flight', {
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
      console.error('Flight booking error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}

const bookingService = new BookingService();

const BookingPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>("Economy");
  const [isLoading, setIsLoading] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);

  // Passenger Information
  const [passengerInfo, setPassengerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    passportNumber: "",
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
    // Get flight data from URL parameters
    const flightData = searchParams?.get("flight");
    const flightClass = searchParams?.get("class") || "Economy";

    console.log("Flight Data:", flightData);
    console.log("Flight Class:", flightClass);
    
    if (flightData) {
      try {
        const parsedFlight = JSON.parse(decodeURIComponent(flightData));
        setFlight(parsedFlight);
        setSelectedClass(flightClass);
      } catch (error) {
        console.error("Error parsing flight data:", error);
        router.push("/flight-search");
      }
    } else {
      router.push("/flight-search");
    }
  }, [searchParams, router]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if flight data is available
      if (!flight) {
        throw new Error('Flight data not available');
      }

      // Validate form data
      if (!passengerInfo.firstName || !passengerInfo.lastName || !passengerInfo.email || !passengerInfo.phone) {
        throw new Error('Please fill in all required passenger information');
      }

      if (!paymentInfo.cardNumber || !paymentInfo.expiryDate || !paymentInfo.cvv || !paymentInfo.cardholderName) {
        throw new Error('Please fill in all required payment information');
      }

      // Get the token
      const token = tokenManager.get();
      if (!token) {
        throw new Error('Please log in to complete your booking');
      }

      // Prepare booking data
      const bookingData = {
        token,
        flightNumber: flight.flightNumber,
        airline: flight.airline,
        departureAirport: flight.departureAirport,
        destinationAirport: flight.destinationAirport,
        departureTime: flight.departureTime,
        arrivalTime: flight.arrivalTime,
        flightClass: selectedClass as 'Economy' | 'Business' | 'First',
        price: flight.prices[selectedClass as keyof typeof flight.prices],
        numberOfSeats: 1, // Assuming 1 passenger for now
        flightDetails: {
          duration: flight.duration,
          aircraft: flight.aircraft,
          gate: flight.gate,
          terminal: flight.terminal,
          numberOfStops: flight.numberOfStops,
          stops: flight.stops,
          status: flight.status,
          meal: flight.meal,
          availableSeats: flight.availableSeats,
          prices: flight.prices,
        },
      };

      // Call the booking API
      const result = await bookingService.bookFlight(bookingData);

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

  const handleInputChange = (section: 'passenger' | 'payment', field: string, value: string) => {
    if (section === 'passenger') {
      setPassengerInfo(prev => ({ ...prev, [field]: value }));
    } else {
      setPaymentInfo(prev => ({ ...prev, [field]: value }));
    }
  };

  if (!flight) {
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
              Your flight has been successfully booked. You will receive a confirmation email shortly.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium text-gray-700">Booking Reference</p>
              <p className="text-lg font-bold text-blue-600">BK{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            </div>
            <div className="space-y-3">
              <Button 
                onClick={() => router.push("/mybookings")}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                View My Bookings
              </Button>
              <Button 
                onClick={() => router.push("/flight-search")}
                variant="outline"
                className="w-full"
              >
                Book Another Flight
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const selectedPrice = flight.prices[selectedClass as keyof typeof flight.prices];

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
                {flight.departureAirport} → {flight.destinationAirport} • {selectedClass}
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
              {/* Passenger Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Passenger Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        required
                        value={passengerInfo.firstName}
                        onChange={(e) => handleInputChange('passenger', 'firstName', e.target.value)}
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        required
                        value={passengerInfo.lastName}
                        onChange={(e) => handleInputChange('passenger', 'lastName', e.target.value)}
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
                        value={passengerInfo.email}
                        onChange={(e) => handleInputChange('passenger', 'email', e.target.value)}
                        placeholder="john.doe@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={passengerInfo.phone}
                        onChange={(e) => handleInputChange('passenger', 'phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        required
                        value={passengerInfo.dateOfBirth}
                        onChange={(e) => handleInputChange('passenger', 'dateOfBirth', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="passportNumber">Passport Number</Label>
                      <Input
                        id="passportNumber"
                        value={passengerInfo.passportNumber}
                        onChange={(e) => handleInputChange('passenger', 'passportNumber', e.target.value)}
                        placeholder="A12345678"
                      />
                    </div>
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
                    Complete Booking - ${selectedPrice}
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
                {/* Flight Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-pink-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-xs">
                        {flight.airline.substring(0, 2)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{flight.airline}</p>
                      <p className="text-sm text-gray-600">Flight {flight.flightNumber}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Departure</span>
                      <span className="text-sm text-gray-600">Arrival</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-center">
                        <p className="font-bold">{flight.departureTime}</p>
                        <p className="text-sm text-gray-600">{flight.departureAirport}</p>
                      </div>
                      <div className="flex-1 text-center">
                        <Plane className="h-4 w-4 mx-auto text-gray-400" />
                        <p className="text-xs text-gray-500">{flight.duration}</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold">{flight.arrivalTime}</p>
                        <p className="text-sm text-gray-600">{flight.destinationAirport}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Pricing Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Flight ({selectedClass})</span>
                    <span className="text-sm">${selectedPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Taxes & Fees</span>
                    <span className="text-sm">$45</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">${selectedPrice + 45}</span>
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

export default BookingPage;

