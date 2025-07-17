"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Plane, Users, Wifi, Coffee, Utensils, MapPin } from "lucide-react";
import { Flight } from "@/lib/types";

const FlightDetailsPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [flight, setFlight] = useState<Flight | null>(null);

  useEffect(() => {
    // Get flight data from URL parameters
    const flightData = searchParams?.get("flight");
    console.log("Raw flight data from URL:", flightData);
    
    if (flightData) {
      try {
        const parsedFlight = JSON.parse(decodeURIComponent(flightData));
        console.log("Parsed flight data:", parsedFlight);
        setFlight(parsedFlight);
      } catch (error) {
        console.error("Error parsing flight data:", error);
        router.push("/flight-search");
      }
    } else {
      console.log("No flight data found in URL, redirecting to flight search");
      router.push("/flight-search");
    }
  }, [searchParams, router]);

  if (!flight) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading flight details...</p>
        </div>
      </div>
    );
  }

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
              <h1 className="text-2xl font-bold text-gray-900">Flight Details</h1>
              <p className="text-gray-600">
                {flight.departureAirport} → {flight.destinationAirport}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Flight Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Flight Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-brand-pink-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">
                        {flight.airline.substring(0, 2)}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{flight.airline}</CardTitle>
                      <p className="text-sm text-gray-600">
                        Flight {flight.flightNumber}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">{flight.duration}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Departure */}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {flight.departureTime}
                    </div>
                    <div className="text-sm text-gray-600">Departure Date</div>
                    <div className="text-lg font-medium text-gray-900 mt-2">
                      {flight.departureAirport}
                    </div>
                    <div className="text-sm text-gray-600">Departure</div>
                  </div>

                  {/* Route */}
                  <div className="flex items-center justify-center">
                    <div className="flex items-center gap-2 text-center">
                      <div className="w-8 h-8 bg-brand-pink-100 rounded-full flex items-center justify-center">
                        <Plane className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 h-px bg-gray-300"></div>
                      <div className="text-xs text-gray-600">
                        {flight.numberOfStops === 0
                          ? "Non-stop"
                          : `${flight.numberOfStops} stop${flight.numberOfStops > 1 ? "s" : ""}`}
                      </div>
                      <div className="flex-1 h-px bg-gray-300"></div>
                      <div className="w-8 h-8 bg-brand-success/20 rounded-full flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                  </div>

                  {/* Arrival */}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {flight.arrivalTime}
                    </div>
                    <div className="text-sm text-gray-600">Arrival Date</div>
                    <div className="text-lg font-medium text-gray-900 mt-2">
                      {flight.destinationAirport}
                    </div>
                    <div className="text-sm text-gray-600">Arrival</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Aircraft & Amenities */}
            <Card>
              <CardHeader>
                <CardTitle>Aircraft & Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Wifi className="h-4 w-4 text-blue-600" />
                    Wi-Fi Available
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Coffee className="h-4 w-4 text-brown-600" />
                    Beverages
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Utensils className="h-4 w-4 text-green-600" />
                    Meals
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-purple-600" />
                    150 Seats
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p><strong>Aircraft:</strong> Boeing 737-800</p>
                  <p><strong>Baggage:</strong> 1 carry-on bag and 1 personal item included</p>
                  <p><strong>Checked Baggage:</strong> Additional fees may apply</p>
                </div>
              </CardContent>
            </Card>

            {/* Flight Rules */}
            <Card>
              <CardHeader>
                <CardTitle>Flight Rules & Policies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Cancellation Policy</h4>
                  <p className="text-sm text-gray-600">
                    Free cancellation up to 24 hours before departure. Cancellation fees may apply after that.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">Change Policy</h4>
                  <p className="text-sm text-gray-600">
                    Changes allowed with applicable fare difference and change fees.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">Check-in</h4>
                  <p className="text-sm text-gray-600">
                    Online check-in opens 24 hours before departure. Airport check-in closes 45 minutes before domestic flights.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Select Your Fare</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Fare Options */}
                {Object.entries(flight.prices).map(([className, price]) => (
                  <div
                    key={className}
                    className="border rounded-lg p-4 hover:border-blue-300 cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium capitalize">{className}</h4>
                        <p className="text-sm text-gray-600">
                          {className === 'economy' && 'Standard seating, basic amenities'}
                          {className === 'business' && 'Premium seating, priority boarding'}
                          {className === 'first' && 'Luxury seating, premium service'}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">
                          ${price}
                        </div>
                        <div className="text-xs text-gray-500">per person</div>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        const bookingParams = new URLSearchParams({
                          flight: encodeURIComponent(JSON.stringify(flight)),
                          class: className,
                        });
                        router.push(`/booking?${bookingParams.toString()}`);
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Select {className}
                    </Button>
                  </div>
                ))}

                {/* Additional Info */}
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Clock className="h-4 w-4" />
                    Duration: {flight.duration}
                  </div>
                  <div className="text-xs text-gray-500">
                    Prices include taxes and fees. Additional baggage charges may apply.
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

export default FlightDetailsPage;

