'use client';

import { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  PlusIcon,
  MapPinIcon,
  CalendarDaysIcon,
  XMarkIcon,
  PencilIcon,
  EyeIcon,
  TrashIcon,
  ArrowLeftIcon, // Added for consistency with the component
  CheckIcon, // Added for consistency with the component
  UserGroupIcon, // Added for consistency with the component
  CurrencyDollarIcon // Added for consistency with the component
} from '@heroicons/react/24/solid';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Fragment } from 'react';
import { getCurrentUser } from '@/lib/auth-utils';
import { bookingService } from '@/lib/booking-service';
import { Tab } from '@headlessui/react'; // Added for consistency with the component
import { generateHotels } from "@/lib/hotel-generator"; // Added for consistency with the component
import { generateFakeFlights } from "@/lib/flight-generator"; // Added for consistency with the component
import { Flight, HotelData } from "@/lib/types"; // Added for consistency with the component
import { format } from "date-fns"; // Added for consistency with the component
import ConfirmationModal from "@/components/ConfirmationModal"; // Added for consistency with the component
import { useParams, useSearchParams } from 'next/navigation';

interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  status: 'Planning' | 'Booked' | 'Completed' | 'Cancelled';
  description?: string;
  createdAt: string;
  updatedAt: string;
  // Trip components
  flight?: {
    included: boolean;
    departure?: string;
    arrival?: string;
    bookingId?: string;
  };
  hotel?: {
    included: boolean;
    name?: string;
    checkIn?: string;
    checkOut?: string;
    rooms?: number;
    bookingId?: string;
  };
  car?: {
    included: boolean;
    type?: string;
    pickupLocation?: string;
    dropoffLocation?: string;
    bookingId?: string;
  };
}

interface CarOption {
  id: string;
  name: string;
  type: string;
  company: string;
  price: number;
  features: string[];
  imageUrl: string;
  seats: number;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function TripPlanning() {
  const params = useParams();
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<HotelData | null>(null);
  const [selectedCar, setSelectedCar] = useState<CarOption | null>(null);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
    details?: {
      flight?: { id: string };
      hotel?: { id: string };
      car?: { id: string };
    } | Error | string;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
    details: null
  });
  const searchParams = useSearchParams();
  const tripDestination = searchParams?.get('destination');

  const tabs = ['Flight', 'Hotel', 'Car Rental', 'Summary'];

  // Mock data - using a valid date format
  const mockFlights: Flight[] = generateFakeFlights(format(new Date(), "yyyy-MM-dd"), 5);

  const mockHotels: HotelData[] = generateHotels()

  const mockCars: CarOption[] = [
    {
      id: '1',
      name: 'Peugeot 308',
      type: 'Compact',
      company: 'Europcar',
      price: 45,
      features: ['Manual', 'AC', 'GPS', '5 Doors'],
      imageUrl: '/car1.jpg',
      seats: 5
    },
    {
      id: '2',
      name: 'BMW 3 Series',
      type: 'Luxury',
      company: 'Avis',
      price: 85,
      features: ['Automatic', 'AC', 'GPS', 'Leather Seats'],
      imageUrl: '/car2.jpg',
      seats: 5
    }
  ];

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/signin');
      return;
    }

    // Mock trip data load
    const loadTrip = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock trip data
      setTrip({
        id: params?.id as string || '1',
        name: 'Summer Vacation in Paris',
        destination: 'Paris, France',
        startDate: '2025-08-15',
        endDate: '2025-08-25',
        travelers: 2,
        budget: 5000,
        status: 'Planning',
        description: 'Romantic getaway to the City of Light',
        createdAt: new Date().toISOString(), // Added for consistency with Trip interface
        updatedAt: new Date().toISOString(), // Added for consistency with Trip interface
      });

      setLoading(false);
    };

    loadTrip();
  }, [isSignedIn, router, params?.id]);

  const handleBookTrip = async () => {
    if (!trip) return;

    try {
      // Get token from localStorage or your auth context
      const token = localStorage.getItem('token');
      if (!token) {
        setModalState({
          isOpen: true,
          type: 'error',
          title: 'Authentication Required',
          message: 'Please sign in to save your booking.',
          details: 'You need to be logged in to proceed with booking.'
        });
        return;
      }

      const bookingData = {
        tripId: trip.id,
        flight: selectedFlight,
        hotel: selectedHotel,
        car: selectedCar
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        const result = await response.json();
        setModalState({
          isOpen: true,
          type: 'success',
          title: 'Booking Confirmed! 🎉',
          message: 'Your selections have been successfully saved and confirmed.',
          details: result.data
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save booking');
      }
    } catch (error) {
      console.error('Error saving booking:', error);
      setModalState({
        isOpen: true,
        type: 'error',
        title: 'Booking Failed',
        message: 'We encountered an issue while saving your booking.',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  };

  const getTotalEstimate = () => {
    let total = 0;
    if (selectedFlight) total += selectedFlight.prices.Economy * (trip?.travelers || 1);
    if (selectedHotel && trip) {
      const nights = Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24));
      total += selectedHotel.rooms[0].pricePerNight * nights;
    }
    if (selectedCar && trip) {
      const days = Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24));
      total += selectedCar.price * days;
    }
    return total;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 dark:from-gray-900 dark:to-blue-950">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 dark:bg-[rgb(25,30,36)] dark:shadow-xl">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4 dark:border-blue-500 dark:border-t-transparent"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2 dark:text-white">Loading Trip Details</h3>
              <p className="text-gray-500 dark:text-brand-gray-400">Please wait while we prepare your trip planning...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 dark:from-gray-900 dark:to-blue-950">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center dark:bg-[rgb(25,30,36)] dark:shadow-xl">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2 dark:text-white">Trip Not Found</h3>
            <p className="text-gray-500 mb-4 dark:text-brand-gray-400">The requested trip could not be found.</p>
            <button
              onClick={() => router.push('/mytrips')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Back to My Trips
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 dark:from-gray-900 dark:to-blue-950">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 dark:bg-[rgb(25,30,36)] dark:shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/mytrips')}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 transition-colors dark:text-brand-gray-400 dark:hover:text-white"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{trip.name}</h1>
                <div className="flex items-center space-x-4 text-gray-600 mt-2 dark:text-brand-gray-300">
                  <div className="flex items-center">
                    <MapPinIcon className="w-4 h-4 mr-1" />
                    <span>{trip.destination}</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarDaysIcon className="w-4 h-4 mr-1" />
                    <span>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <UserGroupIcon className="w-4 h-4 mr-1" />
                    <span>{trip.travelers} traveler{trip.travelers > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center">
                    <CurrencyDollarIcon className="w-4 h-4 mr-1" />
                    <span>Budget: ${trip.budget.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 dark:text-brand-gray-400">Estimated Total</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-500">${getTotalEstimate().toLocaleString()}</div>
              <div className="text-sm text-gray-500 dark:text-brand-gray-400">
                Remaining: ${Math.max(0, trip.budget - getTotalEstimate()).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Planning Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden dark:bg-[rgb(25,30,36)] dark:shadow-xl">
          <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
            <Tab.List className="flex bg-gray-50 border-b dark:bg-[rgb(40,47,54)] dark:border-brand-gray-700">
              {tabs.map((tab, index) => (
                <Tab
                  key={tab}
                  className={({ selected }) =>
                    classNames(
                      'flex-1 px-6 py-4 text-sm font-medium focus:outline-none',
                      selected
                        ? 'bg-blue-600 text-white dark:bg-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-brand-gray-300 dark:hover:text-white dark:hover:bg-[rgb(50,58,66)]'
                    )
                  }
                >
                  <div className="flex items-center justify-center">
                    {index === 0 && '✈️'}
                    {index === 1 && '🏨'}
                    {index === 2 && '🚗'}
                    {index === 3 && '📋'}
                    <span className="ml-2">{tab}</span>
                    {((index === 0 && selectedFlight) ||
                      (index === 1 && selectedHotel) ||
                      (index === 2 && selectedCar)) && (
                      <CheckIcon className="w-4 h-4 ml-2 text-green-400" />
                    )}
                  </div>
                </Tab>
              ))}
            </Tab.List>

            <Tab.Panels>
              {/* Flight Tab */}
              <Tab.Panel className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 dark:text-white">Choose Your Flight</h2>
                <div className="space-y-4">
                  {mockFlights.map((flight) => (
                    <div key={flight.flightNumber} className={`border rounded-lg p-4 ${selectedFlight?.flightNumber === flight.flightNumber ? 'border-blue-500 bg-blue-50 dark:bg-[rgb(40,47,54)] dark:border-blue-700' : 'border-gray-200 dark:border-brand-gray-700 dark:bg-[rgb(30,35,41)]'}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1 pr-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-semibold text-lg text-gray-900 dark:text-white">
                              {flight.airline} {flight.flightNumber}
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-gray-600 mb-2 dark:text-brand-gray-300">
                            <span>{flight.departureAirport} → {flight.destinationAirport}</span>
                            <span>Duration: {flight.duration}</span>
                            <span>{flight.numberOfStops === 0 ? 'Non-stop' : `${flight.numberOfStops} stop${flight.numberOfStops > 1 ? 's' : ''}`}</span>
                          </div>
                          <div className="text-sm text-gray-500 dark:text-brand-gray-400">
                            Departure: {flight.departureTime} |
                            Arrival: {flight.arrivalTime}
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-center space-y-3 min-h-[80px]">
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600 dark:text-green-500">${flight.prices.Economy}</div>
                            <div className="text-sm text-gray-500 dark:text-brand-gray-400">per person</div>
                          </div>
                          <button
                            onClick={() => setSelectedFlight(flight)}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                              selectedFlight?.flightNumber === flight.flightNumber
                                ? 'bg-blue-600 text-white dark:bg-blue-700 dark:hover:bg-blue-800'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-brand-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            {selectedFlight?.flightNumber === flight.flightNumber ? 'Selected' : 'Select'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Tab.Panel>

              {/* Hotel Tab */}
              <Tab.Panel className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 dark:text-white">Choose Your Hotel</h2>
                <div className="space-y-4">
                  {mockHotels.map((hotel) => (
                    <div key={hotel.id} className={`border rounded-lg p-4 ${selectedHotel?.id === hotel.id ? 'border-blue-500 bg-blue-50 dark:bg-[rgb(40,47,54)] dark:border-blue-700' : 'border-gray-200 dark:border-brand-gray-700 dark:bg-[rgb(30,35,41)]'}`}>
                      <div className="flex">
                        <div className="w-24 h-24 bg-gray-200 rounded-lg mr-4 flex-shrink-0 dark:bg-gray-700">
                          <div className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                            🏨
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{hotel.name}</h3>
                              <div className="flex items-center">
                                <span className="text-yellow-400">{'★'.repeat(Math.floor(hotel.reviewSummary.averageRating))}</span>
                                <span className="ml-1 text-gray-600 dark:text-brand-gray-300">({hotel.reviewSummary.totalReviews} reviews)</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-600 dark:text-green-500">${hotel.rooms[0].pricePerNight}</div>
                              <div className="text-sm text-gray-500 dark:text-brand-gray-400">per night</div>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mb-2 dark:text-brand-gray-300">{hotel.address}, {tripDestination}</p>
                          <p className="text-gray-600 text-sm mb-2 dark:text-brand-gray-300">{hotel.rooms[0].type}</p>
                          {/* comeback to amenities later */}
                          {/* <div className="flex items-center space-x-2 mb-2">
                            {hotel.amenities.slice(0, 3).map((amenity, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                {amenity}
                              </span>
                            ))}
                            {hotel.amenities.length > 3 && (
                              <span className="text-gray-500 text-xs">+{hotel.amenities.length - 3} more</span>
                            )}
                          </div> */}
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setSelectedHotel(hotel)}
                              className={`px-4 py-2 rounded-lg transition-colors ${
                                selectedHotel?.id === hotel.id
                                  ? 'bg-blue-600 text-white dark:bg-blue-700 dark:hover:bg-blue-800'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-brand-gray-200 dark:hover:bg-gray-600'
                              }`}
                            >
                              {selectedHotel?.id === hotel.id ? 'Selected' : 'Select'}
                            </button>
                            {/* <button
                              onClick={() => handleBookHotel(hotel)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Book Now
                            </button> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Tab.Panel>

              {/* Car Tab */}
              <Tab.Panel className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 dark:text-white">Choose Your Car Rental</h2>
                <div className="space-y-4">
                  {mockCars.map((car) => (
                    <div key={car.id} className={`border rounded-lg p-4 ${selectedCar?.id === car.id ? 'border-blue-500 bg-blue-50 dark:bg-[rgb(40,47,54)] dark:border-blue-700' : 'border-gray-200 dark:border-brand-gray-700 dark:bg-[rgb(30,35,41)]'}`}>
                      <div className="flex">
                        <div className="w-24 h-24 bg-gray-200 rounded-lg mr-4 flex-shrink-0 dark:bg-gray-700">
                          <div className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                            🚗
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{car.name}</h3>
                              <p className="text-gray-600 dark:text-brand-gray-300">{car.type} • {car.company}</p>
                              <p className="text-gray-600 text-sm dark:text-brand-gray-300">{car.seats} seats</p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-600 dark:text-green-500">${car.price}</div>
                              <div className="text-sm text-gray-500 dark:text-brand-gray-400">per day</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 mb-2">
                            {car.features.slice(0, 4).map((feature, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded dark:bg-gray-700 dark:text-brand-gray-300">
                                {feature}
                              </span>
                            ))}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setSelectedCar(car)}
                              className={`px-4 py-2 rounded-lg transition-colors ${
                                selectedCar?.id === car.id
                                  ? 'bg-blue-600 text-white dark:bg-blue-700 dark:hover:bg-blue-800'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-brand-gray-200 dark:hover:bg-gray-600'
                              }`}
                            >
                              {selectedCar?.id === car.id ? 'Selected' : 'Select'}
                            </button>
                            {/* <button
                              onClick={() => handleBookCar(car)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Book Now
                            </button> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Tab.Panel>

              {/* Summary Tab */}
              <Tab.Panel className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 dark:text-white">Trip Summary</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4 dark:bg-[rgb(40,47,54)]">
                      <h3 className="font-semibold text-gray-900 mb-3 dark:text-white">Selected Options</h3>

                      {selectedFlight ? (
                        <div className="mb-4 p-3 bg-white rounded border dark:bg-[rgb(25,30,36)] dark:border-brand-gray-700">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium dark:text-white">✈️ {selectedFlight.airline} {selectedFlight.flightNumber}</div>
                              <div className="text-sm text-gray-600 dark:text-brand-gray-300">{selectedFlight.departureAirport} → {selectedFlight.destinationAirport}</div>
                            </div>
                            <div className="text-green-600 font-semibold dark:text-green-500">${selectedFlight.prices.Economy * trip.travelers}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="mb-4 p-3 bg-gray-100 rounded border-dashed border-2 border-gray-300 dark:bg-[rgb(40,47,54)] dark:border-brand-gray-600">
                          <div className="text-gray-500 text-center dark:text-brand-gray-400">No flight selected</div>
                        </div>
                      )}

                      {selectedHotel ? (
                        <div className="mb-4 p-3 bg-white rounded border dark:bg-[rgb(25,30,36)] dark:border-brand-gray-700">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium dark:text-white">🏨 {selectedHotel.name}</div>
                              <div className="text-sm text-gray-600 dark:text-brand-gray-300">{selectedHotel.rooms[0].type}</div>
                            </div>
                            <div className="text-green-600 font-semibold dark:text-green-500">
                              ${selectedHotel.rooms[0].pricePerNight * Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="mb-4 p-3 bg-gray-100 rounded border-dashed border-2 border-gray-300 dark:bg-[rgb(40,47,54)] dark:border-brand-gray-600">
                          <div className="text-gray-500 text-center dark:text-brand-gray-400">No hotel selected</div>
                        </div>
                      )}

                      {selectedCar ? (
                        <div className="mb-4 p-3 bg-white rounded border dark:bg-[rgb(25,30,36)] dark:border-brand-gray-700">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium dark:text-white">🚗 {selectedCar.name}</div>
                              <div className="text-sm text-gray-600 dark:text-brand-gray-300">{selectedCar.type} • {selectedCar.company}</div>
                            </div>
                            <div className="text-green-600 font-semibold dark:text-green-500">
                              ${selectedCar.price * Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="mb-4 p-3 bg-gray-100 rounded border-dashed border-2 border-gray-300 dark:bg-[rgb(40,47,54)] dark:border-brand-gray-600">
                          <div className="text-gray-500 text-center dark:text-brand-gray-400">No car rental selected</div>
                        </div>
                      )}
                    </div>

                    {/* Book Now Button - Only show if at least one option is selected */}
                    {(selectedFlight || selectedHotel || selectedCar) && (
                      <div className="mt-4">
                        <button
                          onClick={handleBookTrip}
                          className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors dark:bg-green-700 dark:hover:bg-green-800"
                        >
                          Book Selected Items
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4 dark:bg-[rgb(40,47,54)]">
                      <h3 className="font-semibold text-gray-900 mb-3 dark:text-white">Cost Breakdown</h3>
                      <div className="space-y-2 text-gray-700 dark:text-brand-gray-200">
                        {selectedFlight && (
                          <div className="flex justify-between">
                            <span>Flight ({trip.travelers} passenger{trip.travelers > 1 ? 's' : ''})</span>
                            <span>${selectedFlight.prices.Economy * trip.travelers}</span>
                          </div>
                        )}
                        {selectedHotel && (
                          <div className="flex justify-between">
                            <span>Hotel ({Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24))} nights)</span>
                            <span>${selectedHotel.rooms[0].pricePerNight * Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24))}</span>
                          </div>
                        )}
                        {selectedCar && (
                          <div className="flex justify-between">
                            <span>Car Rental ({Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24))} days)</span>
                            <span>${selectedCar.price * Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24))}</span>
                          </div>
                        )}
                        <hr className="my-2 border-gray-200 dark:border-brand-gray-600" />
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Total Estimate</span>
                          <span className="text-green-600 dark:text-green-500">${getTotalEstimate()}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 dark:text-brand-gray-300">
                          <span>Budget Remaining</span>
                          <span className={`${trip.budget - getTotalEstimate() >= 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                            ${Math.max(0, trip.budget - getTotalEstimate())}
                            {trip.budget - getTotalEstimate() < 0 && ' (Over budget)'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 dark:bg-[rgb(40,47,54)]">
                      <h3 className="font-semibold text-gray-900 mb-3 dark:text-white">Next Steps</h3>
                      <div className="space-y-2 text-sm text-gray-700 dark:text-brand-gray-200">
                        <p>• Review your selected options above</p>
                        <p>• Use the &quot;Book Now&quot; buttons to proceed with individual bookings</p>
                        <p>• Save this trip plan and return anytime to make changes</p>
                        <p>• Check your email for booking confirmations</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>

        {/* Navigation */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => setSelectedTab(Math.max(0, selectedTab - 1))}
            disabled={selectedTab === 0}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-brand-gray-200 dark:hover:bg-gray-600"
          >
            Previous
          </button>
          <button
            onClick={() => setSelectedTab(Math.min(tabs.length - 1, selectedTab + 1))}
            disabled={selectedTab === tabs.length - 1}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            Next
          </button>
        </div>

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={modalState.isOpen}
          onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
          type={modalState.type}
          title={modalState.title}
          message={modalState.message}
          details={modalState.details}
        />
      </div>
    </div>
  );
}