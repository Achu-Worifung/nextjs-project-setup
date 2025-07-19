"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { MapPin, Star, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Hotel {
  id: string;
  name: string;
  vendor: string;
  address: string;
  city: string;
  state: string;
  country: string;
  description: string;
  postalCode: string;
  phoneNumber: string;
  email: string;
  website: string;
  rating: number;
  amenities: string[];
  roomDetails: any[];
  reviews: any[];
  nearbyAttractions: any[];
  policies: any;
  faq: any[];
}

export default function HotelSearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [count, setCount] = useState(5);
  const [city, setCity] = useState(searchParams?.get("city") || "New York");
  const [state, setState] = useState(searchParams?.get("state") || "NY");
  const { isSignedIn } = useAuth();

  useEffect(() => {
    const fetchHotels = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/hotels?count=${count}&city=${city}&state=${state}`
        );
        const data = await res.json();
        setHotels(data);
      } catch (err) {
        setHotels([]);
      }
      setIsLoading(false);
    };
    fetchHotels();
  }, [count, city, state]);

  // Pass only hotelId and roomId, not full objects
  const handleRoomSelection = (hotelId: string, roomId: string) => {
    if (!isSignedIn) {
      alert("Please sign in to book a hotel.");
      router.push("/signin");
      return;
    }
    const queryParams = new URLSearchParams({
      city,
      state,
      roomId,
    }).toString();
    router.push(`/hotel-booking/${hotelId}?${queryParams}`);
  };

  return (
    <div className="w-full mx-auto p-6 bg-white my-5" id="hotel-search-results">
      <div className="mb-6">
        <Link
          href="/hotel-rental"
          className="flex items-center text-gray-600 hover:text-pink-600 mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span>Back to search</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Hotel Results</h1>
        <p className="text-gray-600">
          {hotels.length} hotels found in {city}, {state}
        </p>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            <div className="space-y-6">
              <div>
                <Label
                  htmlFor="city"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  City
                </Label>
                <input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                />
              </div>
              <div>
                <Label
                  htmlFor="state"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  State
                </Label>
                <input
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                />
              </div>
              <div>
                <Label
                  htmlFor="count"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  Number of Hotels
                </Label>
                <input
                  type="number"
                  id="count"
                  min={1}
                  max={20}
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-3/4">
          {isLoading ? (
            <div>Loading hotels...</div>
          ) : hotels.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {hotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="border border-gray-200 rounded-lg overflow-hidden shadow hover:shadow-lg transition"
                >
                  <div className="relative">
                    <div className="flex items-center justify-center w-full h-60 bg-gray-100 text-6xl">
                      <span role="img" aria-label="hotel">
                        🏨
                      </span>
                    </div>
                    <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-bold text-gray-700">
                      {hotel.vendor}
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 text-lg">
                      {hotel.name}
                    </h4>
                    <p className="text-sm text-gray-500 mb-1">
                      {hotel.address}
                    </p>
                    <div className="flex items-center mb-2">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium">
                        {hotel.rating}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-3">
                      {hotel.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {hotel.amenities.slice(0, 4).map((a, i) => (
                        <span
                          key={i}
                          className="border border-gray-200 rounded-full px-2 py-1 text-xs"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                    {/* Room selection buttons */}
                    {hotel.roomDetails && hotel.roomDetails.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {hotel.roomDetails.map((room: any) => (
                          <button
                            key={room.id || room.type}
                            onClick={() =>
                              handleRoomSelection(
                                hotel.id,
                                room.id || room.type
                              )
                            }
                            className="bg-pink-500 hover:bg-pink-600 text-white py-1 px-3 rounded text-xs font-medium transition-colors cursor-pointer"
                          >
                            Book {room.type || room.name}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          handleRoomSelection(hotel.id, "standard")
                        }
                        className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded text-sm font-medium transition-colors cursor-pointer inline-block"
                      >
                        Book
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>No hotels found for your criteria.</div>
          )}
        </div>
      </div>
    </div>
  );
}
