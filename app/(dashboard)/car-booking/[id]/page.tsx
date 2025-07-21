"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { CarData, fetchAvailableCars } from "@/fake-data/car-rental-data";
import {
  Calendar,
  MapPin,
  Check,
  CreditCard,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { bookingService, CarBookingRequest } from "@/lib/booking-service";

// Form states interface
interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  nameOnCard: string;
  agreeToTerms: boolean;
}

export default function CarBookingPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const carId =
    params && typeof params.id === "string" ? parseInt(params.id, 10) : 0;
  const [car, setCar] = useState<CarData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingStep, setBookingStep] = useState(1); // 1: details, 2: payment, 3: confirmation
  const [insuranceOption, setInsuranceOption] = useState("basic");
  const [totalPrice, setTotalPrice] = useState(0);
  const [daysCount, setDaysCount] = useState(1);

  // Get location, date, and filter params
  const pickupLocation = searchParams ? searchParams.get("pickup") || "" : "";
  const dropoffLocation = searchParams ? searchParams.get("dropoff") || "" : "";
  const pickupDate = searchParams ? searchParams.get("pickupDate") || "" : "";
  const dropoffDate = searchParams ? searchParams.get("dropoffDate") || "" : "";
  const minSeats = searchParams ? Number(searchParams.get("minSeats") || 0) : 0;
  const maxPrice = searchParams
    ? Number(searchParams.get("maxPrice") || 100)
    : 100;
  const vehicleType = searchParams
    ? searchParams.get("vehicleType") || "All"
    : "All";
  // Get carData from query param if present
  const carDataParam = searchParams ? searchParams.get("carData") : null;

  // Form state
  const [formData, setFormData] = useState<BookingFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    nameOnCard: "",
    agreeToTerms: false,
  });

  // Handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Load car details and calculate pricing
  useEffect(() => {
    setIsLoading(true);
    (async () => {
      let selectedCar: CarData | null = null;
      if (carDataParam) {
        try {
          selectedCar = JSON.parse(decodeURIComponent(carDataParam));
        } catch (e) {
          selectedCar = null;
        }
      }
      if (!selectedCar) {
        const cars = await fetchAvailableCars();
        // Apply filters from search params
        const filteredCars = cars.filter((car) => {
          const matchesSeats = car.seats >= minSeats;
          const matchesPrice = car.pricePerDay <= maxPrice;
          const matchesType = vehicleType === "All" || car.type === vehicleType;
          return matchesSeats && matchesPrice && matchesType;
        });
        console.log("DEBUG: carId from URL:", carId);
        console.log(
          "DEBUG: available cars:",
          filteredCars.map((c) => c.id)
        );
        selectedCar = filteredCars.find((c) => c.id === carId) || null;
        if (!selectedCar) {
          console.warn(
            "DEBUG: No car found for carId",
            carId,
            "in",
            filteredCars.map((c) => c.id)
          );
        }
      }
      if (selectedCar) {
        setCar(selectedCar);
        // Calculate number of rental days
        let days = 1;
        if (pickupDate && dropoffDate) {
          const start = new Date(pickupDate);
          const end = new Date(dropoffDate);
          const diffTime = Math.abs(end.getTime() - start.getTime());
          days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          days = days < 1 ? 1 : days;
        }
        setDaysCount(days);
        // Calculate base price
        const basePrice = selectedCar.pricePerDay * days;
        // Initial total is base price (insurance will be added when selected)
        setTotalPrice(basePrice);
      }
      setIsLoading(false);
    })();
  }, [carId, pickupDate, dropoffDate]);

  // Calculate total price when insurance option changes
  useEffect(() => {
    if (!car) return;

    const basePrice = car.pricePerDay * daysCount;
    let insurancePrice = 0;

    // Add insurance cost
    if (insuranceOption === "basic") {
      insurancePrice = 10 * daysCount; // $10/day for basic coverage
    } else if (insuranceOption === "premium") {
      insurancePrice = 25 * daysCount; // $25/day for premium coverage
    } else if (insuranceOption === "full") {
      insurancePrice = 40 * daysCount; // $40/day for full coverage
    }

    setTotalPrice(basePrice + insurancePrice);
  }, [car, insuranceOption, daysCount]);

  // Handle booking submission
  // Use AuthContext for JWT token retrieval
  const { token: authToken } = require("@/context/AuthContext").useAuth();
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (bookingStep === 1) {
      // Validate first step
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.phone
      ) {
        alert("Please fill in all required fields");
        return;
      }
      setBookingStep(2);
    } else if (bookingStep === 2) {
      // Validate payment step
      if (
        !formData.cardNumber ||
        !formData.cardExpiry ||
        !formData.cardCvc ||
        !formData.nameOnCard
      ) {
        alert("Please fill in all payment details");
        return;
      }
      if (!formData.agreeToTerms) {
        alert("Please agree to the terms and conditions");
        return;
      }

      // Get JWT token for authentication
      let token = authToken;
      if (!token && typeof window !== "undefined") {
        token =
          localStorage.getItem("jwtToken") || localStorage.getItem("token");
      }
      if (!token) {
        alert("Please log in to complete your booking");
        return;
      }

      // Ensure car is not null
      if (!car) {
        alert("Car details missing. Please reload the page and try again.");
        return;
      }
      // Prepare flat CarBookingRequest object
      const carBookingRequest = {
        id: car.id,
        name: `${car.year} ${car.make} ${car.model}`,
        make: car.make,
        model: car.model,
        year: car.year,
        imageUrl: car.imageUrl,
        seats: car.seats,
        type: car.type,
        pricePerDay: car.pricePerDay,
        features: car.features,
        transmission: car.transmission,
        fuelType: car.fuelType,
        rating: car.rating,
        pickupLocation,
        dropoffLocation,
        pickupDate,
        dropoffDate,
        totalPrice: totalPrice,
      };

      try {
        const result = await bookingService.bookCar(carBookingRequest);
        if (result.success) {
          setBookingStep(3);
        } else {
          throw new Error(result.error || "Booking failed");
        }
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : "Booking failed. Please try again."
        );
      }
    } else {
      // Final step, redirect to confirmation or dashboard
      router.push("/");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center">
        <div className="animate-pulse w-full max-w-4xl">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
          <div className="h-64 bg-gray-300 rounded mb-6"></div>
          <div className="h-8 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-6"></div>
          <div className="h-32 bg-gray-300 rounded mb-6"></div>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold">Vehicle not found</h3>
            <p className="mt-1">
              We couldn't find the vehicle you're looking for. Please go back
              and try again.
            </p>
            <Link
              href="/car-search-results"
              className="mt-4 inline-flex items-center text-sm font-medium text-red-700 hover:text-red-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to search results
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Booking steps
  const renderBookingStep = () => {
    switch (bookingStep) {
      case 1:
        return (
          <div>
            <h2 className="text-xl font-bold mb-6">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="mb-1 block">
                  First Name*
                </Label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <Label htmlFor="lastName" className="mb-1 block">
                  Last Name*
                </Label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email" className="mb-1 block">
                  Email*
                </Label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone" className="mb-1 block">
                  Phone Number*
                </Label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="address" className="mb-1 block">
                  Address
                </Label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <Label htmlFor="city" className="mb-1 block">
                  City
                </Label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <Label htmlFor="zipCode" className="mb-1 block">
                  ZIP/Postal Code
                </Label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <Label htmlFor="country" className="mb-1 block">
                  Country
                </Label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-xl font-bold mb-6">Payment Details</h2>
            <div className="mb-6">
              <Label htmlFor="nameOnCard" className="mb-1 block">
                Name on Card*
              </Label>
              <input
                type="text"
                id="nameOnCard"
                name="nameOnCard"
                value={formData.nameOnCard}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="mb-6">
              <Label htmlFor="cardNumber" className="mb-1 block">
                Card Number*
              </Label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                placeholder="XXXX XXXX XXXX XXXX"
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <Label htmlFor="cardExpiry" className="mb-1 block">
                  Expiry Date*
                </Label>
                <input
                  type="text"
                  id="cardExpiry"
                  name="cardExpiry"
                  value={formData.cardExpiry}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <Label htmlFor="cardCvc" className="mb-1 block">
                  CVC*
                </Label>
                <input
                  type="text"
                  id="cardCvc"
                  name="cardCvc"
                  value={formData.cardCvc}
                  onChange={handleInputChange}
                  placeholder="XXX"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="mr-2"
                  required
                />
                <span className="text-sm text-gray-600">
                  I agree to the{" "}
                  <a href="#" className="text-pink-600 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-pink-600 hover:underline">
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Booking Confirmed!
            </h2>
            <p className="mb-6 text-gray-600">
              Thank you for your booking. We've sent a confirmation to your
              email address.
            </p>
            <div className="p-4 bg-gray-50 rounded-lg text-left mb-6">
              <h3 className="font-semibold text-lg mb-2">Booking Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-gray-600">Booking Reference:</span>
                <span className="font-medium">
                  BK-{Math.floor(Math.random() * 1000000)}
                </span>
                <span className="text-gray-600">Vehicle:</span>
                <span className="font-medium">
                  {car.year} {car.make} {car.model}
                </span>
                <span className="text-gray-600">Pickup:</span>
                <span className="font-medium">
                  {pickupLocation} - {formatDate(pickupDate)}
                </span>
                <span className="text-gray-600">Return:</span>
                <span className="font-medium">
                  {dropoffLocation} - {formatDate(dropoffDate)}
                </span>
                <span className="text-gray-600">Total:</span>
                <span className="font-medium">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleSubmitBooking}
              className="bg-pink-500 hover:bg-pink-600 text-white py-3 px-8 rounded-md text-lg font-semibold transition-colors"
            >
              Return to Homepage
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not specified";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Link
        href="/car-search-results"
        className="flex items-center text-gray-600 hover:text-pink-600 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        <span>Back to search results</span>
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Car Summary and Insurance Options */}
        <div className="w-full lg:w-2/5">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="relative">
              {car.imageUrl && car.imageUrl.trim() !== "" ? (
                <img
                  src={car.imageUrl}
                  alt={`${car.year} ${car.make} ${car.model}`}
                  className="w-full h-60 object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-60 bg-gray-100 text-6xl">
                  <span role="img" aria-label="car">
                    🚗
                  </span>
                </div>
              )}
              <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-bold text-gray-700">
                {car.type}
              </div>
            </div>

            <div className="p-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {car.year} {car.make} {car.model}
              </h2>
              <div className="flex items-center mb-4">
                <span className="text-yellow-500 mr-1">★</span>
                <span className="text-sm font-medium">{car.rating}</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Pickup Location</p>
                    <p className="text-gray-600">
                      {pickupLocation || "Not specified"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(pickupDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Dropoff Location</p>
                    <p className="text-gray-600">
                      {dropoffLocation || "Not specified"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(dropoffDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Rental Duration</p>
                    <p className="text-gray-600">
                      {daysCount} {daysCount === 1 ? "day" : "days"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Insurance Options */}
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Insurance Options
                </h3>

                <div className="space-y-3">
                  <label
                    className={`block border rounded-lg p-3 cursor-pointer transition-colors ${
                      insuranceOption === "basic"
                        ? "border-pink-500 bg-pink-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start">
                      <input
                        type="radio"
                        name="insuranceOption"
                        value="basic"
                        checked={insuranceOption === "basic"}
                        onChange={() => setInsuranceOption("basic")}
                        className="mt-1 mr-3"
                      />
                      <div>
                        <span className="font-medium">Basic Coverage</span>
                        <p className="text-sm text-gray-600 mt-1">
                          Includes liability insurance and collision damage
                          waiver with a $1,000 deductible.
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          $10/day
                        </p>
                      </div>
                    </div>
                  </label>

                  <label
                    className={`block border rounded-lg p-3 cursor-pointer transition-colors ${
                      insuranceOption === "premium"
                        ? "border-pink-500 bg-pink-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start">
                      <input
                        type="radio"
                        name="insuranceOption"
                        value="premium"
                        checked={insuranceOption === "premium"}
                        onChange={() => setInsuranceOption("premium")}
                        className="mt-1 mr-3"
                      />
                      <div>
                        <span className="font-medium">Premium Coverage</span>
                        <p className="text-sm text-gray-600 mt-1">
                          Includes liability insurance, collision damage waiver
                          with a $500 deductible, and tire & windshield
                          protection.
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          $25/day
                        </p>
                      </div>
                    </div>
                  </label>

                  <label
                    className={`block border rounded-lg p-3 cursor-pointer transition-colors ${
                      insuranceOption === "full"
                        ? "border-pink-500 bg-pink-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start">
                      <input
                        type="radio"
                        name="insuranceOption"
                        value="full"
                        checked={insuranceOption === "full"}
                        onChange={() => setInsuranceOption("full")}
                        className="mt-1 mr-3"
                      />
                      <div>
                        <span className="font-medium">Full Coverage</span>
                        <p className="text-sm text-gray-600 mt-1">
                          Comprehensive coverage with no deductible, includes
                          all protections and roadside assistance.
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          $40/day
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Pricing Summary */}
              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">
                    Car Rental ({daysCount} {daysCount === 1 ? "day" : "days"})
                  </span>
                  <span>${(car.pricePerDay * daysCount).toFixed(2)}</span>
                </div>

                {insuranceOption === "basic" && (
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Basic Insurance</span>
                    <span>${(10 * daysCount).toFixed(2)}</span>
                  </div>
                )}

                {insuranceOption === "premium" && (
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Premium Insurance</span>
                    <span>${(25 * daysCount).toFixed(2)}</span>
                  </div>
                )}

                {insuranceOption === "full" && (
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">
                      Full Coverage Insurance
                    </span>
                    <span>${(40 * daysCount).toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="w-full lg:w-3/5">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex mb-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex-1 flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                      bookingStep >= step
                        ? "bg-pink-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step}
                  </div>
                  <span
                    className={`text-xs ${
                      bookingStep >= step
                        ? "text-pink-500 font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    {step === 1
                      ? "Details"
                      : step === 2
                      ? "Payment"
                      : "Confirmation"}
                  </span>
                  {step < 3 && (
                    <div
                      className={`h-px w-full mt-4 ${
                        bookingStep > step ? "bg-pink-500" : "bg-gray-200"
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmitBooking}>
              {renderBookingStep()}

              <div className="mt-8 flex justify-between">
                {bookingStep > 1 && bookingStep < 3 && (
                  <button
                    type="button"
                    onClick={() => setBookingStep(bookingStep - 1)}
                    className="border border-gray-300 bg-white text-gray-700 py-2 px-6 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  className={`bg-pink-500 hover:bg-pink-600 text-white py-2 px-6 rounded-md transition-colors ml-auto ${
                    bookingStep === 3 ? "mx-auto" : ""
                  }`}
                >
                  {bookingStep === 1
                    ? "Continue to Payment"
                    : bookingStep === 2
                    ? "Complete Booking"
                    : "Return to Homepage"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
