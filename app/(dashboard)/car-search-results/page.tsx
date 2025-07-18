"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CarData, mockAvailableCars, carTypes } from "@/fake-data/car-rental-data";
import { Label } from "@/components/ui/label";
import { MapPin, Calendar, Filter, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AuthModal } from "@/components/ui/auth-modal";
import {useAuth} from "@/context/AuthContext"


export default function CarSearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [availableCars, setAvailableCars] = useState<CarData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const {token, isSignedIn} = useAuth()

  // Filter states
  const [minSeats, setMinSeats] = useState(searchParams ? Number(searchParams.get("minSeats") || 0) : 0);
  const [maxPrice, setMaxPrice] = useState(searchParams ? Number(searchParams.get("maxPrice") || 100) : 100);
  const [selectedType, setSelectedType] = useState(searchParams ? searchParams.get("vehicleType") || "All" : "All");

  // Location info
  const pickupLocation = searchParams ? searchParams.get("pickup") || "" : "";
  const dropoffLocation = searchParams ? searchParams.get("dropoff") || "" : "";
  const pickupDate = searchParams ? searchParams.get("pickupDate") || "" : "";
  const dropoffDate = searchParams ? searchParams.get("dropoffDate") || "" : "";

  // Animation style
  const animationStyles = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.3s ease-in-out;
    }
  `;

  // Filter function
  const filterCars = () => {
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const filtered = mockAvailableCars.filter((car) => {
        const matchesSeats = car.seats >= minSeats;
        const matchesPrice = car.pricePerDay <= maxPrice;
        const matchesType = selectedType === "All" || car.type === selectedType;

        return matchesSeats && matchesPrice && matchesType;
      });

      setAvailableCars(filtered);
      setIsLoading(false);
    }, 500);
  };

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

  const handleCarSelection = (carId:number) =>
  {
    if (!isSignedIn) {
      setShowAuthModal(true);
      return;
    }

    const queryParams = new URLSearchParams({
      pickup: pickupLocation,
      dropoff: dropoffLocation,
      ...(pickupDate && { pickupDate }),
      ...(dropoffDate && { dropoffDate }),
    }).toString();

    router.push(`/car-booking/${carId}?${queryParams}`);
  }
  // Function to build car booking URL (used for debugging if needed)
  const getBookingUrl = (carId: number): string => {
    const queryParams = new URLSearchParams();
    if (pickupLocation) queryParams.set("pickup", pickupLocation);
    if (dropoffLocation) queryParams.set("dropoff", dropoffLocation);
    if (pickupDate) queryParams.set("pickupDate", pickupDate);
    if (dropoffDate) queryParams.set("dropoffDate", dropoffDate);

    const queryString = queryParams.toString();
    return `/car-booking/${carId}${queryString ? `?${queryString}` : ''}`;
  };

  // Load cars based on search params
  useEffect(() => {
    filterCars();
  }, []);

  return (
    <div className="w-full mx-auto p-6 bg-white my-5 dark:bg-[rgb(25,30,36)] dark:text-brand-gray-200" id="car-search-results">
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />

      {/* Header with back button */}
      <div className="mb-6">
        <Link href="/" className="flex items-center text-gray-600 hover:text-pink-600 mb-4 transition-colors dark:text-brand-gray-400 dark:hover:text-brand-pink-400">
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span>Back to search</span>
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Car Rental Results</h1>
        <p className="text-gray-600 dark:text-brand-gray-300">
          {availableCars.length} vehicles found matching your criteria
        </p>
      </div>

      {/* Journey details card */}
      <div className="bg-gray-50 border border-brand-gray-200 rounded-lg p-4 mb-8 dark:bg-[rgb(40,47,54)] dark:border-brand-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-brand-gray-300">Pickup Location</p>
            <div className="flex items-center mt-1">
              <MapPin className="h-4 w-4 text-pink-500 mr-2 dark:text-brand-pink-400" />
              <p className="font-medium text-gray-900 dark:text-white">{pickupLocation}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-brand-gray-300">Dropoff Location</p>
            <div className="flex items-center mt-1">
              <MapPin className="h-4 w-4 text-pink-500 mr-2 dark:text-brand-pink-400" />
              <p className="font-medium text-gray-900 dark:text-white">{dropoffLocation}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-brand-gray-300">Pickup Date</p>
            <div className="flex items-center mt-1">
              <Calendar className="h-4 w-4 text-pink-500 mr-2 dark:text-brand-pink-400" />
              <p className="font-medium text-gray-900 dark:text-white">{pickupDate || "Not specified"}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-brand-gray-300">Dropoff Date</p>
            <div className="flex items-center mt-1">
              <Calendar className="h-4 w-4 text-pink-500 mr-2 dark:text-brand-pink-400" />
              <p className="font-medium text-gray-900 dark:text-white">{dropoffDate || "Not specified"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters sidebar */}
        <div className="w-full lg:w-1/4">
          <div className="border border-brand-gray-200 rounded-lg p-4 dark:border-brand-gray-700 dark:bg-[rgb(40,47,54)]">
            <div className="flex items-center mb-4">
              <Filter className="h-5 w-5 mr-2 text-gray-700 dark:text-brand-gray-200" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
            </div>

            <div className="space-y-6">
              {/* Vehicle Type Filter */}
              <div>
                <Label htmlFor="vehicleType" className="text-sm font-medium text-gray-700 mb-2 block dark:text-brand-gray-200">
                  Vehicle Type
                </Label>
                <select
                  id="vehicleType"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 dark:bg-[rgb(25,30,36)] dark:border-brand-gray-600 dark:text-brand-gray-200"
                >
                  <option value="All">All Types</option>
                  {carTypes.filter(type => type !== "All").map((type) => (
                    <option key={type} value={type} className="dark:bg-[rgb(25,30,36)]">
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <Label htmlFor="maxPrice" className="text-sm font-medium text-gray-700 mb-2 block dark:text-brand-gray-200">
                  Max Price (Per Day)
                </Label>
                <div className="flex items-center">
                  <span className="mr-2 text-gray-600 font-medium dark:text-brand-gray-300">$0</span>
                  <input
                    type="range"
                    id="maxPrice"
                    min={0}
                    max={200}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500 dark:bg-gray-700 dark:accent-pink-400"
                  />
                  <span className="ml-2 text-gray-600 font-medium dark:text-brand-gray-300">${maxPrice}</span>
                </div>
              </div>

              {/* Seats Filter */}
              <div>
                <Label htmlFor="minSeats" className="text-sm font-medium text-gray-700 mb-2 block dark:text-brand-gray-200">
                  Minimum Seats
                </Label>
                <select
                  id="minSeats"
                  value={minSeats}
                  onChange={(e) => setMinSeats(parseInt(e.target.value))}
                  className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 dark:bg-[rgb(25,30,36)] dark:border-brand-gray-600 dark:text-brand-gray-200"
                >
                  <option value={0}>Any</option>
                  <option value={2}>2+</option>
                  <option value={4}>4+</option>
                  <option value={6}>6+</option>
                  <option value={8}>8+</option>
                </select>
              </div>

              {/* Filter Button */}
              <button
                onClick={filterCars}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-md transition-colors focus:outline-none dark:bg-pink-400 dark:hover:bg-pink-500"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="w-full lg:w-3/4">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="border border-brand-gray-200 rounded-lg overflow-hidden dark:border-brand-gray-700 dark:bg-[rgb(40,47,54)]">
                  <div className="h-55 bg-gray-300 animate-pulse dark:bg-gray-600"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-6 bg-gray-300 rounded animate-pulse w-3/4 dark:bg-gray-600"></div>
                    <div className="h-4 bg-gray-300 rounded animate-pulse dark:bg-gray-600"></div>
                    <div className="flex space-x-2">
                      <div className="h-6 bg-gray-300 rounded-full animate-pulse w-20 dark:bg-gray-600"></div>
                      <div className="h-6 bg-gray-300 rounded-full animate-pulse w-20 dark:bg-gray-600"></div>
                    </div>
                    <div className="h-4 bg-gray-300 rounded animate-pulse dark:bg-gray-600"></div>
                    <div className="flex justify-between">
                      <div className="h-8 bg-gray-300 rounded animate-pulse w-20 dark:bg-gray-600"></div>
                      <div className="h-8 bg-gray-300 rounded animate-pulse w-20 dark:bg-gray-600"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : availableCars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {availableCars.map((car) => (
                <div
                  key={car.id}
                  className="border border-brand-gray-200 rounded-lg overflow-hidden shadow hover:shadow-lg transition animate-fadeIn dark:border-brand-gray-700 dark:bg-[rgb(40,47,54)] dark:shadow-brand-dark hover:dark:shadow-brand-dark-lg"
                >
                  <div className="relative bg-gray-50 h-48 flex items-center justify-center dark:bg-[rgb(48,56,64)]">
                    <div className="text-6xl">
                      {car.imageUrl}
                    </div>
                    <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-bold text-gray-700 dark:bg-[rgb(25,30,36)] dark:text-brand-gray-200">
                      {car.type}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg dark:text-white">
                          {car.year} {car.make} {car.model}
                        </h4>
                        <p className="text-sm text-gray-500 mb-1 dark:text-brand-gray-400">
                          {car.type}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{car.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center my-2 text-xs text-gray-600 dark:text-brand-gray-300">
                      <span className="mr-3 border border-brand-gray-200 rounded-full px-2 py-1 dark:border-brand-gray-600">
                        {car.transmission}
                      </span>
                      <span className="mr-3 border border-brand-gray-200 rounded-full px-2 py-1 dark:border-brand-gray-600">
                        {car.fuelType}
                      </span>
                      <span className="border border-brand-gray-200 rounded-full px-2 py-1 dark:border-brand-gray-600">
                        {car.seats} seats
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 mb-3 dark:text-brand-gray-300">{car.features}</p>

                    <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-brand-gray-700">
                      <p className="text-xl font-bold text-pink-500 dark:text-brand-pink-400">${car.pricePerDay}<span className="text-sm font-normal text-gray-500 dark:text-brand-gray-400">/day</span></p>
                      <button
                        onClick={() => handleCarSelection(car.id)}
                        className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded text-sm font-medium transition-colors cursor-pointer inline-block dark:bg-pink-400 dark:hover:bg-pink-500"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 bg-gray-50 rounded-lg border border-brand-gray-200 dark:bg-[rgb(40,47,54)] dark:border-brand-gray-700">
              <div className="rounded-full bg-gray-200 p-6 mb-4 dark:bg-gray-600">
                <Filter className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1 dark:text-white">No vehicles found</h3>
              <p className="text-gray-600 text-center mb-6 max-w-md dark:text-brand-gray-300">
                We couldn't find any vehicles matching your current filters. Try adjusting your filters or try a different location.
              </p>
              <button
                onClick={() => {
                  setMinSeats(0);
                  setMaxPrice(200);
                  setSelectedType("All");
                  setTimeout(filterCars, 0);
                }}
                className="text-pink-600 hover:text-pink-700 font-semibold flex items-center dark:text-pink-400 dark:hover:text-pink-500"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>
      </div>
      <AuthModal
        isOpen={showAuthModal}
        onClose={handleAuthModalClose}
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
      />
    </div>
  );
}
