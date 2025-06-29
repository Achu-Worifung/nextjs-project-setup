"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Flight, FlightClass } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AuthModal } from "@/components/ui/auth-modal";
import { bookingService, FlightBookingRequest } from "@/lib/booking-service";
import { getCurrentUser } from "@/lib/auth-utils";
import {
  X,
  Plane,
  Clock,
  Users,
  Utensils,
  Wifi,
  Luggage,
  Coffee,
  Tv,
  Shield,
  CheckCircle,
  MapPin,
  Calendar,
  Loader2
} from "lucide-react";

interface FlightDetailsDrawerProps {
  flight: Flight | null;
  isOpen: boolean;
  onClose: () => void;
}

export function FlightDetailsDrawer({
  flight,
  isOpen,
  onClose,
}: FlightDetailsDrawerProps) {
  const router = useRouter();
  const [selectedClass, setSelectedClass] = useState<FlightClass>("Economy");
  const [numberOfSeats, setNumberOfSeats] = useState(1);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingResult, setBookingResult] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (!flight) return null;

  const handleBookFlight = async () => {
    const { isAuthenticated } = getCurrentUser();
    
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    const price = flight.prices[selectedClass];
    const availableSeats = flight.availableSeats[selectedClass];
    
    if (availableSeats === 0) {
      setBookingResult("Sorry, no seats available in this class");
      return;
    }

    if (numberOfSeats > availableSeats) {
      setBookingResult(`Sorry, only ${availableSeats} seats available in this class`);
      return;
    }

    setIsBooking(true);
    setBookingResult(null);

    try {
      const bookingData: FlightBookingRequest = {
        flightNumber: flight.flightNumber,
        airline: flight.airline,
        departureAirport: flight.departureAirport,
        destinationAirport: flight.destinationAirport,
        departureTime: flight.departureTime,
        arrivalTime: flight.arrivalTime,
        flightClass: selectedClass,
        price: price,
        numberOfSeats: numberOfSeats,
      };

      const response = await bookingService.bookFlight(bookingData);
      
      if (response.success) {
        setBookingResult(`✅ Flight booked successfully! Booking ID: ${response.booking?.bookingId}`);
        // Auto-close drawer after successful booking
        setTimeout(() => {
          onClose();
          setBookingResult(null);
        }, 3000);
      } else {
        setBookingResult(`❌ Booking failed: ${response.error}`);
      }
    } catch (error) {
      setBookingResult(`❌ Booking failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsBooking(false);
    }
  };

  const getClassFeatures = (flightClass: FlightClass) => {
    switch (flightClass) {
      case "First":
        return [
          { icon: Utensils, text: "Gourmet dining" },
          { icon: Coffee, text: "Premium beverages" },
          { icon: Users, text: "Personal service" },
          { icon: Tv, text: "Large entertainment screen" },
          { icon: Luggage, text: "3 checked bags included" },
          { icon: Wifi, text: "Complimentary Wi-Fi" },
        ];
      case "Business":
        return [
          { icon: Utensils, text: "Business class meals" },
          { icon: Coffee, text: "Complimentary drinks" },
          { icon: Tv, text: "Personal entertainment" },
          { icon: Luggage, text: "2 checked bags included" },
          { icon: Wifi, text: "Complimentary Wi-Fi" },
        ];
      default: // Economy
        return [
          { icon: Utensils, text: "Snacks & beverages" },
          { icon: Tv, text: "Seatback entertainment" },
          { icon: Luggage, text: "1 checked bag ($35)" },
          { icon: Wifi, text: "Wi-Fi available ($8)" },
        ];
    }
  };

  const formatStops = (stops: number) => {
    if (stops === 0) return "Non-stop";
    return `${stops} stop${stops > 1 ? 's' : ''}`;
  };

  const classOptions: FlightClass[] = ["Economy", "Business", "First"];

  const handleSignIn = () => {
    setShowAuthModal(false);
    // Navigate to sign in page
    router.push('/signin');
  };

  const handleSignUp = () => {
    setShowAuthModal(false);
    // Navigate to sign up page  
    router.push('/signup');
  };

  const handleAuthModalClose = () => {
    setShowAuthModal(false);
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
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {flight.airline} {flight.flightNumber}
                </h2>
                <p className="text-gray-600">{flight.departureAirport} → {flight.destinationAirport}</p>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex items-center gap-4 mt-2">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                {flight.status}
              </Badge>
              <div className="flex items-center gap-1 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Gate {flight.gate} • Terminal {flight.terminal}</span>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6 max-h-[75vh] overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Flight Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Flight Timeline */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Flight Details</h3>
                    <div className="space-y-4">
                      {/* Departure */}
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                          <div className="w-0.5 h-12 bg-gray-300"></div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-lg">{flight.departureTime}</div>
                              <div className="text-gray-600">{flight.departureAirport}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-500">Departure</div>
                              <div className="text-sm text-gray-600">Gate {flight.gate}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Flight Duration */}
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center">
                          <Plane className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="flex-1 flex items-center justify-between">
                          <div className="text-gray-600">
                            <Clock className="w-4 h-4 inline mr-1" />
                            {flight.duration} • {formatStops(flight.numberOfStops)}
                          </div>
                          <div className="text-sm text-gray-500">{flight.aircraft}</div>
                        </div>
                      </div>

                      {/* Arrival */}
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-lg">{flight.arrivalTime}</div>
                              <div className="text-gray-600">{flight.destinationAirport}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-500">Arrival</div>
                              <div className="text-sm text-gray-600">Terminal {flight.terminal}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Stops Information */}
                {flight.numberOfStops > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Layover Information</h3>
                      <div className="space-y-3">
                        {flight.stops.map((stop, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <div className="font-medium">{stop.airport}</div>
                              <div className="text-sm text-gray-600">
                                {stop.arrivalTime} - {stop.departureTime}
                              </div>
                            </div>
                            <Badge variant="outline">
                              {stop.layoverDuration}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Class Features */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">{selectedClass} Class Features</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {getClassFeatures(selectedClass).map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <feature.icon className="w-5 h-5 text-blue-600" />
                          <span className="text-sm text-gray-900">{feature.text}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Booking Options */}
              <div className="space-y-4">
                <Card className="sticky top-4">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Select Class</h3>
                    
                    {/* Class Selection */}
                    <div className="space-y-3 mb-6">
                      {classOptions.map((classType) => {
                        const price = flight.prices[classType];
                        const availableSeats = flight.availableSeats[classType];
                        const isSelected = selectedClass === classType;
                        const isAvailable = availableSeats > 0;
                        
                        return (
                          <div
                            key={classType}
                            className={`p-4 border rounded-lg cursor-pointer transition-all ${
                              isSelected 
                                ? 'border-blue-500 bg-blue-50' 
                                : isAvailable
                                ? 'border-gray-200 hover:border-gray-300'
                                : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                            }`}
                            onClick={() => isAvailable && setSelectedClass(classType)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-gray-900">{classType}</div>
                                <div className="text-sm text-gray-600">
                                  {isAvailable ? `${availableSeats} seats left` : 'Sold out'}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-gray-900">
                                  ${price}
                                </div>
                                {isSelected && <CheckCircle className="w-4 h-4 text-blue-600 mt-1" />}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Seat Selection */}
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-3">Number of Seats</h4>
                      <div className="flex items-center gap-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setNumberOfSeats(Math.max(1, numberOfSeats - 1))}
                          disabled={numberOfSeats <= 1}
                          className="h-8 w-8 p-0"
                        >
                          -
                        </Button>
                        <span className="text-lg font-medium w-8 text-center">{numberOfSeats}</span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setNumberOfSeats(Math.min(flight.availableSeats[selectedClass], numberOfSeats + 1))}
                          disabled={numberOfSeats >= flight.availableSeats[selectedClass]}
                          className="h-8 w-8 p-0"
                        >
                          +
                        </Button>
                        <span className="text-sm text-gray-500 ml-2">
                          (Max: {flight.availableSeats[selectedClass]} available)
                        </span>
                      </div>
                    </div>

                    {/* Booking Summary */}
                    <div className="border-t pt-4 mb-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Flight:</span>
                          <span className="font-medium">{flight.airline} {flight.flightNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Class:</span>
                          <span className="font-medium">{selectedClass}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Seats:</span>
                          <span className="font-medium">{numberOfSeats} × ${flight.prices[selectedClass]}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span className="font-medium">{flight.duration}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-base pt-2 border-t">
                          <span>Total:</span>
                          <span>${(flight.prices[selectedClass] * numberOfSeats).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Book Button */}
                    <Button 
                      onClick={handleBookFlight}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={flight.availableSeats[selectedClass] === 0 || isBooking}
                    >
                      {isBooking ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Booking...
                        </>
                      ) : flight.availableSeats[selectedClass] > 0 ? (
                        'Book Flight'
                      ) : (
                        'Sold Out'
                      )}
                    </Button>

                    {/* Booking Result Message */}
                    {bookingResult && (
                      <div className={`mt-3 p-3 rounded-lg text-sm ${
                        bookingResult.includes('successfully') 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {bookingResult}
                      </div>
                    )}

                    {/* Features */}
                    <div className="mt-6 pt-4 border-t">
                      <h4 className="font-medium text-gray-900 mb-3">Included</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-green-600" />
                          <span>Free cancellation 24h</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-green-600" />
                          <span>Change flight (fees may apply)</span>
                        </div>
                        {flight.meal && (
                          <div className="flex items-center gap-2">
                            <Utensils className="w-4 h-4 text-green-600" />
                            <span>In-flight meal included</span>
                          </div>
                        )}
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
    </div>
  );
}
