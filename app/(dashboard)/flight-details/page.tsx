"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Plane, Users, Wifi, Coffee, Utensils, MapPin } from "lucide-react";
import { Flight } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";


const FlightDetailsPage = () => {
    const { token } = useAuth();

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

const handleBooking = async (flight: Flight, seat: string, tripId?: string) => {
  if (!token) {
    console.error("No auth token available.");
    return;
  }
  const bookingPayload = { ...flight, chosenSeat: seat };
  // Build URL with optional trip_id as query param
  let url = "http://localhost:8006/flights/book";
  if (tripId) {
    url += `?trip_id=${encodeURIComponent(tripId)}`;
  }
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
        "X-Client-ID": "test-client-id",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingPayload),
    });

    if (!response.ok) {
      throw new Error("Failed to book flight");
    }

    const data = await response.json();
    console.log("Flight booked successfully:", data);
  } catch (error) {
    console.error("Error booking flight:", error);
  }
};

  if (!flight) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center dark:bg-[rgb(20,25,30)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4 dark:border-blue-500"></div>
          <p className="text-gray-600 dark:text-brand-gray-300">Loading flight details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[rgb(20,25,30)]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b dark:bg-[rgb(25,30,36)] dark:border-brand-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2 bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-[rgb(40,47,54)] dark:text-brand-gray-200 dark:border-brand-gray-600 dark:hover:bg-[rgb(50,58,66)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Search
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Flight Details</h1>
              <p className="text-gray-600 dark:text-brand-gray-300">
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
            <Card className="bg-white border-brand-gray-200 dark:bg-[rgb(25,30,36)] dark:border-brand-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-brand-pink-100 rounded-lg flex items-center justify-center dark:bg-brand-pink-900">
                      <span className="text-blue-600 font-bold text-sm dark:text-blue-400">
                        {flight.airline.substring(0, 2)}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-lg text-gray-900 dark:text-white">{flight.airline}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-brand-gray-300">
                        Flight {flight.flightNumber}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-brand-gray-200">{flight.duration}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Departure */}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {flight.departureTime}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-brand-gray-300">Departure Date</div>
                    <div className="text-lg font-medium text-gray-900 mt-2 dark:text-white">
                      {flight.departureAirport}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-brand-gray-300">Departure</div>
                  </div>

                  {/* Route */}
                  <div className="flex items-center justify-center">
                    <div className="flex items-center gap-2 text-center">
                      <div className="w-8 h-8 bg-brand-pink-100 rounded-full flex items-center justify-center dark:bg-brand-pink-900">
                        <Plane className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                      <div className="text-xs text-gray-600 dark:text-brand-gray-300">
                        {flight.numberOfStops === 0
                          ? "Non-stop"
                          : `${flight.numberOfStops} stop${flight.numberOfStops > 1 ? "s" : ""}`}
                      </div>
                      <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                      <div className="w-8 h-8 bg-brand-success/20 rounded-full flex items-center justify-center dark:bg-brand-success-dark/20">
                        <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                  </div>

                  {/* Arrival */}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {flight.arrivalTime}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-brand-gray-300">Arrival Date</div>
                    <div className="text-lg font-medium text-gray-900 mt-2 dark:text-white">
                      {flight.destinationAirport}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-brand-gray-300">Arrival</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Aircraft & Amenities */}
            <Card className="bg-white border-brand-gray-200 dark:bg-[rgb(25,30,36)] dark:border-brand-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Aircraft & Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-gray-900 dark:text-brand-gray-200">
                  <div className="flex items-center gap-2 text-sm">
                    <Wifi className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    Wi-Fi Available
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Coffee className="h-4 w-4 text-brown-600 dark:text-brown-400" /> {/* Assuming brown-600 maps to a dark mode equivalent */}
                    Beverages
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Utensils className="h-4 w-4 text-green-600 dark:text-green-400" />
                    Meals
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    150 Seats
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-brand-gray-300">
                  <p><strong className="text-gray-900 dark:text-white">Aircraft:</strong> Boeing 737-800</p>
                  <p><strong className="text-gray-900 dark:text-white">Baggage:</strong> 1 carry-on bag and 1 personal item included</p>
                  <p><strong className="text-gray-900 dark:text-white">Checked Baggage:</strong> Additional fees may apply</p>
                </div>
              </CardContent>
            </Card>

            {/* Flight Rules */}
            <Card className="bg-white border-brand-gray-200 dark:bg-[rgb(25,30,36)] dark:border-brand-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Flight Rules & Policies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2 text-gray-900 dark:text-white">Cancellation Policy</h4>
                  <p className="text-sm text-gray-600 dark:text-brand-gray-300">
                    Free cancellation up to 24 hours before departure. Cancellation fees may apply after that.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2 text-gray-900 dark:text-white">Change Policy</h4>
                  <p className="text-sm text-gray-600 dark:text-brand-gray-300">
                    Changes allowed with applicable fare difference and change fees.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2 text-gray-900 dark:text-white">Check-in</h4>
                  <p className="text-sm text-gray-600 dark:text-brand-gray-300">
                    Online check-in opens 24 hours before departure. Airport check-in closes 45 minutes before domestic flights.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6 bg-white border-brand-gray-200 dark:bg-[rgb(25,30,36)] dark:border-brand-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Select Your Fare</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Fare Options */}
                {Object.entries(flight.prices).map(([className, price]) => (
                  <div
                    key={className}
                    className="border rounded-lg p-4 hover:border-blue-300 cursor-pointer transition-colors dark:border-brand-gray-600 dark:hover:border-blue-500 dark:bg-[rgb(40,47,54)]"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium capitalize text-gray-900 dark:text-white">{className}</h4>
                        <p className="text-sm text-gray-600 dark:text-brand-gray-300">
                          {className === 'economy' && 'Standard seating, basic amenities'}
                          {className === 'business' && 'Premium seating, priority boarding'}
                          {className === 'first' && 'Luxury seating, premium service'}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          ${price}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-brand-gray-400">per person</div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleBooking(flight, className)}
                      className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                    >
                      Select {className}
                    </Button>
                  </div>
                ))}

                {/* Additional Info */}
                <div className="pt-4 border-t border-gray-200 dark:border-brand-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2 dark:text-brand-gray-300">
                    <Clock className="h-4 w-4" />
                    Duration: {flight.duration}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-brand-gray-400">
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