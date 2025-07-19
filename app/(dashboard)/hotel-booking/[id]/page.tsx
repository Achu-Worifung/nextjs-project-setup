"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { MapPin, Star, ArrowLeft, Check } from "lucide-react";

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

export default function HotelBookingPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const hotelId = params && typeof params.id === "string" ? params.id : "";
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingStep, setBookingStep] = useState(1);
  const [insuranceOption, setInsuranceOption] = useState("basic");
  const [totalPrice, setTotalPrice] = useState(0);
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

  // Get hotelData from query param if present
  useEffect(() => {
    setIsLoading(true);
    const fetchHotel = async () => {
      try {
        const res = await fetch(`/api/hotels/${hotelId}`);
        if (!res.ok) {
          setHotel(null);
          setIsLoading(false);
          return;
        }
        const selectedHotel = await res.json();
        setHotel(selectedHotel);
        // Set initial price from most popular room
        if (
          selectedHotel &&
          selectedHotel.roomDetails &&
          selectedHotel.roomDetails.length > 0
        ) {
          const popularRoom =
            selectedHotel.roomDetails.find((r: any) => r.mostPopular) ||
            selectedHotel.roomDetails[0];
          setTotalPrice(popularRoom.pricePerNight);
        }
      } catch (e) {
        setHotel(null);
      }
      setIsLoading(false);
    };
    fetchHotel();
  }, [hotelId]);

  // Handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle booking submission
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bookingStep === 1) {
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
      let token = null;
      try {
        token =
          typeof window !== "undefined"
            ? localStorage.getItem("jwtToken")
            : null;
      } catch (err) {
        token = null;
      }
      if (!token) {
        alert("Please log in to complete your booking");
        return;
      }
      // Prepare booking request data
      const requestData = {
        hotel,
        insurance: { insType: insuranceOption, insTotal: 0 },
        total: totalPrice,
      };
      try {
        const res = await fetch("/api/hotel-booking", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
        });
        // Handle rate limiting (HTTP 429)
        if (res.status === 429) {
          alert("Too many requests. Please wait a moment and try again.");
          return;
        }
        const result = await res.json();
        if (!res.ok || !result.booking_id) {
          alert(result.detail || "Booking failed");
        } else {
          setBookingStep(3);
        }
      } catch (err) {
        // Remove debug logs for production
        // console.error("An error occurred while booking the hotel", err);
        alert("Booking failed. Please try again.");
      }
    } else {
      router.push("/");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center">
        Loading...
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg flex items-start">
          <ArrowLeft className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold">Hotel not found</h3>
            <p className="mt-1">
              We couldn't find the hotel you're looking for. Please go back and
              try again.
            </p>
            <Link
              href="/hotel-search-results"
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
                  HT-{Math.floor(Math.random() * 1000000)}
                </span>
                <span className="text-gray-600">Hotel:</span>
                <span className="font-medium">{hotel.name}</span>
                <span className="text-gray-600">Location:</span>
                <span className="font-medium">{hotel.address}</span>
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

  return (
    <div className="container mx-auto p-6">
      <Link
        href="/hotel-search-results"
        className="flex items-center text-gray-600 hover:text-pink-600 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        <span>Back to search results</span>
      </Link>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Hotel Summary */}
        <div className="w-full lg:w-2/5">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
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
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {hotel.name}
              </h2>
              <div className="flex items-center mb-4">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-sm font-medium">{hotel.rating}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{hotel.address}</p>
              <p className="text-xs text-gray-600 mb-3">{hotel.description}</p>
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
              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">
                    Room Price (most popular)
                  </span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
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
