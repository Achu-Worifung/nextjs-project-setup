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
  TrashIcon
} from '@heroicons/react/24/solid';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Fragment } from 'react';
import { getCurrentUser } from '@/lib/auth-utils';
import { bookingService } from '@/lib/booking-service';

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

export default function MyTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [bookingsData, setBookingsData] = useState<{
    totalFlights: number;
    totalHotels: number;
    totalCars: number;
    totalSpent: number;
    bookedTrips: number;
  }>({
    totalFlights: 0,
    totalHotels: 0,
    totalCars: 0,
    totalSpent: 0,
    bookedTrips: 0,
  });
  const { isSignedIn } = useAuth();
  const router = useRouter();

  // Form state for creating new trips
  const [newTripForm, setNewTripForm] = useState({
    name: '',
    destination: '',
    startDate: '',
    endDate: '',
    travelers: 1,
    budget: 0,
    description: '',
    flight: { included: false, departure: '', arrival: '' },
    hotel: { included: false, name: '', rooms: 1 },
    car: { included: false, type: '', pickupLocation: '', dropoffLocation: '' }
  });

  // Load trips from database
  useEffect(() => {
    const loadTrips = async () => {
      if (!isSignedIn) {
        router.push('/signin');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Get user ID from auth context
        const { userId, isAuthenticated } = getCurrentUser();
        
        if (!isAuthenticated || !userId) {
          setError('User not found. Please sign in again.');
          router.push('/signin');
          return;
        }

        // Fetch trips
        const response = await fetch(`/api/trips?userId=${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch trips');
        }
        
        const data = await response.json();
        setTrips(data.trips || []);

        // Fetch actual booking data
        try {
          const allBookings = await bookingService.getUserBookings();
          
          // Debug: log the structure of the first booking to understand the data format
          if (allBookings && Array.isArray(allBookings) && allBookings.length > 0) {
            console.log('Sample booking structure:', allBookings[0]);
            console.log('Available keys:', Object.keys(allBookings[0]));
          }
          
          if (allBookings && Array.isArray(allBookings)) {
            // Calculate statistics from actual bookings
            const flightBookings = allBookings.filter(b => b.bookingtype === 'Flight' || b.BookingType === 'Flight');
            const hotelBookings = allBookings.filter(b => b.bookingtype === 'Hotel' || b.BookingType === 'Hotel');
            const carBookings = allBookings.filter(b => b.bookingtype === 'Car' || b.BookingType === 'Car');
            
            // Handle both lowercase and uppercase column names from the database
            const totalSpent = allBookings.reduce((sum, booking) => {
              // Try multiple possible property names for the total amount
              const amount = booking.totalpaid || booking.TotalPaid || booking.total_paid || booking.totalAmount || 0;
              const numericAmount = Number(amount);
              console.log(`Booking ${booking.bookingid || booking.BookingID}: amount=${amount}, numericAmount=${numericAmount}`);
              return sum + numericAmount;
            }, 0);
            
            console.log('Total calculated:', totalSpent);
            
            // Count trips that have bookings
            const tripsWithBookings = data.trips?.filter((trip: Trip) => 
              trip.flight?.bookingId || trip.hotel?.bookingId || trip.car?.bookingId
            ).length || 0;

            setBookingsData({
              totalFlights: flightBookings.length,
              totalHotels: hotelBookings.length,
              totalCars: carBookings.length,
              totalSpent,
              bookedTrips: tripsWithBookings,
            });
          }
        } catch (bookingError) {
          console.warn('Could not fetch booking data:', bookingError);
          // Don't break the trips loading if bookings fail
        }
      } catch (error) {
        console.error('Error loading trips:', error);
        setError('Failed to load trips. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, [isSignedIn, router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planning':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'Booked':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'Completed':
        return 'bg-gray-100 text-gray-800 border border-gray-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getTripBookingStatus = (trip: Trip): string => {
    const hasFlightBooking = trip.flight?.bookingId;
    const hasHotelBooking = trip.hotel?.bookingId;
    const hasCarBooking = trip.car?.bookingId;
    
    const bookingCount = [hasFlightBooking, hasHotelBooking, hasCarBooking].filter(Boolean).length;
    const includedCount = [trip.flight?.included, trip.hotel?.included, trip.car?.included].filter(Boolean).length;
    
    if (bookingCount === 0) {
      return 'Planning';
    } else if (bookingCount === includedCount) {
      return 'Fully Booked';
    } else {
      return 'Partially Booked';
    }
  };

  const getTripBookingStatusColor = (trip: Trip): string => {
    const status = getTripBookingStatus(trip);
    switch (status) {
      case 'Planning':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'Partially Booked':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'Fully Booked':
        return 'bg-green-100 text-green-800 border border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const handleViewTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    setIsDetailModalOpen(true);
  };

  const handleCreateTrip = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateTripSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { userId, isAuthenticated } = getCurrentUser();
      
      if (!isAuthenticated || !userId) {
        setError('User not found. Please sign in again.');
        return;
      }

      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          ...newTripForm
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create trip');
      }

      const data = await response.json();
      
      // Add the new trip to the list
      setTrips(prevTrips => [data.trip, ...prevTrips]);
      
      // Refresh booking data after adding a new trip
      try {
        const allBookings = await bookingService.getUserBookings();
        if (allBookings && Array.isArray(allBookings)) {
          const flightBookings = allBookings.filter(b => b.bookingtype === 'Flight' || b.BookingType === 'Flight');
          const hotelBookings = allBookings.filter(b => b.bookingtype === 'Hotel' || b.BookingType === 'Hotel');
          const carBookings = allBookings.filter(b => b.bookingtype === 'Car' || b.BookingType === 'Car');
          
          // Handle both lowercase and uppercase column names from the database
          const totalSpent = allBookings.reduce((sum, booking) => {
            const amount = booking.totalpaid || booking.TotalPaid || booking.total_paid || booking.totalAmount || 0;
            return sum + Number(amount);
          }, 0);
          
          // Include the new trip in the count
          const updatedTrips = [data.trip, ...trips];
          const tripsWithBookings = updatedTrips.filter((trip: Trip) => 
            trip.flight?.bookingId || trip.hotel?.bookingId || trip.car?.bookingId
          ).length;

          setBookingsData({
            totalFlights: flightBookings.length,
            totalHotels: hotelBookings.length,
            totalCars: carBookings.length,
            totalSpent,
            bookedTrips: tripsWithBookings,
          });
        }
      } catch (bookingError) {
        console.warn('Could not refresh booking data:', bookingError);
      }
      
      // Reset form and close modal
      setNewTripForm({
        name: '',
        destination: '',
        startDate: '',
        endDate: '',
        travelers: 1,
        budget: 0,
        description: '',
        flight: { included: false, departure: '', arrival: '' },
        hotel: { included: false, name: '', rooms: 1 },
        car: { included: false, type: '', pickupLocation: '', dropoffLocation: '' }
      });
      setIsCreateModalOpen(false);
      
    } catch (error) {
      console.error('Error creating trip:', error);
      setError('Failed to create trip. Please try again.');
    }
  };

  const handleFormChange = (field: string, value: string | number | boolean) => {
    setNewTripForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePlanTrip = (tripId: string, tripdestination: string) => {
    // Navigate to trip planning page
    // console.log(`Planning trip with ID: ${trip}`);
    const url = `/mytrips/${tripId}/plan?destination=${encodeURIComponent(tripdestination)}`;
     router.push(url);
  };

  const handleDeleteTrip = (trip: Trip) => {
    setTripToDelete(trip);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteTrip = async () => {
    if (!tripToDelete) return;
    
    try {
      setIsDeleting(true);
      
      const { userId, isAuthenticated } = getCurrentUser();
      
      if (!isAuthenticated || !userId) {
        setError('User not found. Please sign in again.');
        return;
      }

      const response = await fetch(`/api/trips/${tripToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete trip');
      }

      // Remove the trip from the local state
      setTrips(prevTrips => prevTrips.filter(trip => trip.id !== tripToDelete.id));
      
      // Refresh booking data after deleting a trip
      try {
        const allBookings = await bookingService.getUserBookings();
        if (allBookings && Array.isArray(allBookings)) {
          const flightBookings = allBookings.filter(b => b.bookingtype === 'Flight' || b.BookingType === 'Flight');
          const hotelBookings = allBookings.filter(b => b.bookingtype === 'Hotel' || b.BookingType === 'Hotel');
          const carBookings = allBookings.filter(b => b.bookingtype === 'Car' || b.BookingType === 'Car');
          
          const totalSpent = allBookings.reduce((sum, booking) => {
            const amount = booking.totalpaid || booking.TotalPaid || booking.total_paid || booking.totalAmount || 0;
            return sum + Number(amount);
          }, 0);
          
          // Update trip count after deletion
          const updatedTrips = trips.filter(trip => trip.id !== tripToDelete.id);
          const tripsWithBookings = updatedTrips.filter((trip: Trip) => 
            trip.flight?.bookingId || trip.hotel?.bookingId || trip.car?.bookingId
          ).length;

          setBookingsData({
            totalFlights: flightBookings.length,
            totalHotels: hotelBookings.length,
            totalCars: carBookings.length,
            totalSpent,
            bookedTrips: tripsWithBookings,
          });
        }
      } catch (bookingError) {
        console.warn('Could not refresh booking data:', bookingError);
      }
      
      // Close modal and reset state
      setIsDeleteModalOpen(false);
      setTripToDelete(null);
      
    } catch (error) {
      console.error('Error deleting trip:', error);
      setError('Failed to delete trip. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsDetailModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedTrip(null);
    setTripToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 pb-26">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                My Trips
              </h1>
              <p className="text-gray-600 text-lg">
                Plan, organize, and manage your travel adventures
              </p>
            </div>
            <button
              onClick={handleCreateTrip}
              className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg w-full sm:w-auto"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Create New Trip
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${bookingsData.totalSpent.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Trips</p>
                <p className="text-2xl font-bold text-gray-900">{trips.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Planning Phase</p>
                <p className="text-2xl font-bold text-gray-900">
                  {trips.filter(t => t.status === 'Planning').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Trips with Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{bookingsData.bookedTrips}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Stats */}
     

        {/* Error State */}
        {error && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Trips</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Your Trips</h3>
              <p className="text-gray-500">Please wait while we fetch your travel plans...</p>
            </div>
          </div>
        )}

        {/* Trips Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <div key={trip.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {/* Trip Header */}
                <div className="bg-blue-600 p-6 text-white">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{trip.name}</h3>
                      <div className="flex items-center text-blue-200">
                        <MapPinIcon className="w-4 h-4 mr-1" />
                        <span className="text-sm">{trip.destination}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                        {trip.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTripBookingStatusColor(trip)}`}>
                        {getTripBookingStatus(trip)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center text-blue-200">
                    <CalendarDaysIcon className="w-4 h-4 mr-1" />
                    <span className="text-sm">
                      {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Trip Details */}
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-1 relative ${
                        trip.flight?.included 
                          ? trip.flight?.bookingId 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        ✈️
                        {trip.flight?.bookingId && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">Flight</span>
                    </div>
                    <div className="text-center">
                      <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-1 relative ${
                        trip.hotel?.included 
                          ? trip.hotel?.bookingId 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-orange-100 text-orange-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        🏨
                        {trip.hotel?.bookingId && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">Hotel</span>
                    </div>
                    <div className="text-center">
                      <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-1 relative ${
                        trip.car?.included 
                          ? trip.car?.bookingId 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-purple-100 text-purple-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        🚗
                        {trip.car?.bookingId && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">Car</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                    <span>{trip.travelers} traveler{trip.travelers > 1 ? 's' : ''}</span>
                    <span className="font-semibold text-green-600">${trip.budget.toLocaleString()}</span>
                  </div>

                  {trip.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{trip.description}</p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewTrip(trip)}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      <EyeIcon className="w-4 h-4 mr-1" />
                      View
                    </button>
                    {trip.status !== 'Booked' && (
                      <button
                        onClick={() => handlePlanTrip(trip.id, trip.destination)}
                        className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <PencilIcon className="w-4 h-4 mr-1" />
                        Plan
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteTrip(trip)}
                      className="flex items-center justify-center px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && trips.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">🗺️</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No trips planned yet</h3>
            <p className="text-gray-500 mb-6">Start planning your next adventure!</p>
            <button
              onClick={handleCreateTrip}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Trip
            </button>
          </div>
        )}

        {/* Create Trip Modal */}
        <Transition appear show={isCreateModalOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeModals}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-blue-600 bg-opacity-15 backdrop-blur-sm" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                    <div className="bg-blue-600 px-6 py-4">
                      <div className="flex items-center justify-between">
                        <Dialog.Title className="text-lg font-medium text-white">
                          Create New Trip
                        </Dialog.Title>
                        <button
                          onClick={closeModals}
                          className="text-white hover:text-gray-200 transition-colors"
                        >
                          <XMarkIcon className="w-6 h-6" />
                        </button>
                      </div>
                    </div>

                    <div className="p-6">
                      <form onSubmit={handleCreateTripSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Trip Name
                          </label>
                          <input
                            type="text"
                            placeholder="e.g., Summer Vacation in Paris"
                            value={newTripForm.name}
                            onChange={(e) => handleFormChange('name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Destination
                          </label>
                          <input
                            type="text"
                            placeholder="e.g., Paris, France"
                            value={newTripForm.destination}
                            onChange={(e) => handleFormChange('destination', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Start Date
                            </label>
                            <input
                              type="date"
                              value={newTripForm.startDate}
                              onChange={(e) => handleFormChange('startDate', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              End Date
                            </label>
                            <input
                              type="date"
                              value={newTripForm.endDate}
                              onChange={(e) => handleFormChange('endDate', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Travelers
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={newTripForm.travelers}
                              onChange={(e) => handleFormChange('travelers', parseInt(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Budget ($)
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={newTripForm.budget}
                              onChange={(e) => handleFormChange('budget', parseFloat(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description (Optional)
                          </label>
                          <textarea
                            placeholder="Tell us about your trip..."
                            rows={3}
                            value={newTripForm.description}
                            onChange={(e) => handleFormChange('description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={closeModals}
                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Create Trip
                          </button>
                        </div>
                      </form>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>

        {/* Trip Detail Modal */}
        <Transition appear show={isDetailModalOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeModals}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-blue-600 bg-opacity-15 backdrop-blur-sm" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                    {selectedTrip && (
                      <>
                        <div className="bg-blue-600 px-6 py-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Dialog.Title className="text-xl font-semibold text-white">
                                {selectedTrip.name}
                              </Dialog.Title>
                              <p className="text-blue-200 text-sm">
                                {selectedTrip.destination}
                              </p>
                            </div>
                            <button
                              onClick={closeModals}
                              className="text-white hover:text-gray-200 transition-colors"
                            >
                              <XMarkIcon className="w-6 h-6" />
                            </button>
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Trip Details</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Dates:</span>
                                    <span className="font-medium">
                                      {new Date(selectedTrip.startDate).toLocaleDateString()} - {new Date(selectedTrip.endDate).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Travelers:</span>
                                    <span className="font-medium">{selectedTrip.travelers}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Budget:</span>
                                    <span className="font-medium text-green-600">${selectedTrip.budget.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Status:</span>
                                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedTrip.status)}`}>
                                      {selectedTrip.status}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {selectedTrip.description && (
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                                  <p className="text-sm text-gray-600">{selectedTrip.description}</p>
                                </div>
                              )}
                            </div>

                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Trip Components</h4>
                                <div className="space-y-3">
                                  <div className={`p-3 rounded-lg border ${selectedTrip.flight?.included ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center">
                                        <span className="text-lg mr-2">✈️</span>
                                        <span className="font-medium">Flight</span>
                                      </div>
                                      <span className={`text-sm ${selectedTrip.flight?.included ? 'text-blue-600' : 'text-gray-500'}`}>
                                        {selectedTrip.flight?.included ? 'Included' : 'Not included'}
                                      </span>
                                    </div>
                                    {selectedTrip.flight?.included && (
                                      <div className="mt-2 text-sm text-gray-600">
                                        {selectedTrip.flight.departure && selectedTrip.flight.arrival 
                                          ? `${selectedTrip.flight.departure} → ${selectedTrip.flight.arrival}`
                                          : 'Flight details pending'
                                        }
                                        {selectedTrip.flight.bookingId && (
                                          <div className="text-xs text-green-600 mt-1">
                                            ✓ Booked (ID: {selectedTrip.flight.bookingId})
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>

                                  <div className={`p-3 rounded-lg border ${selectedTrip.hotel?.included ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center">
                                        <span className="text-lg mr-2">🏨</span>
                                        <span className="font-medium">Hotel</span>
                                      </div>
                                      <span className={`text-sm ${selectedTrip.hotel?.included ? 'text-green-600' : 'text-gray-500'}`}>
                                        {selectedTrip.hotel?.included ? 'Included' : 'Not included'}
                                      </span>
                                    </div>
                                    {selectedTrip.hotel?.included && selectedTrip.hotel.name && (
                                      <div className="mt-2 text-sm text-gray-600">
                                        {selectedTrip.hotel.name}
                                        {selectedTrip.hotel.checkIn && selectedTrip.hotel.checkOut && (
                                          <div className="text-xs text-gray-500 mt-1">
                                            {new Date(selectedTrip.hotel.checkIn).toLocaleDateString()} - {new Date(selectedTrip.hotel.checkOut).toLocaleDateString()}
                                          </div>
                                        )}
                                        {selectedTrip.hotel.bookingId && (
                                          <div className="text-xs text-green-600 mt-1">
                                            ✓ Booked (ID: {selectedTrip.hotel.bookingId})
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>

                                  <div className={`p-3 rounded-lg border ${selectedTrip.car?.included ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'}`}>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center">
                                        <span className="text-lg mr-2">🚗</span>
                                        <span className="font-medium">Car Rental</span>
                                      </div>
                                      <span className={`text-sm ${selectedTrip.car?.included ? 'text-purple-600' : 'text-gray-500'}`}>
                                        {selectedTrip.car?.included ? 'Included' : 'Not included'}
                                      </span>
                                    </div>
                                    {selectedTrip.car?.included && selectedTrip.car.type && (
                                      <div className="mt-2 text-sm text-gray-600">
                                        {selectedTrip.car.type}
                                        {selectedTrip.car.pickupLocation && (
                                          <div className="text-xs text-gray-500 mt-1">
                                            Pickup: {selectedTrip.car.pickupLocation}
                                          </div>
                                        )}
                                        {selectedTrip.car.bookingId && (
                                          <div className="text-xs text-green-600 mt-1">
                                            ✓ Booked (ID: {selectedTrip.car.bookingId})
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 px-6 py-4 flex justify-between">
                          <div className="text-sm text-gray-500">
                            Created {new Date(selectedTrip.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex space-x-3">
                            <button
                              onClick={closeModals}
                              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              Close
                            </button>
                            {selectedTrip.status !== 'Booked' && (
                              <button
                                onClick={() => handlePlanTrip(selectedTrip.id, selectedTrip.destination)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                Start Planning
                              </button>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>

        {/* Delete Trip Confirmation Modal */}
        <Transition appear show={isDeleteModalOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeModals}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                    <div className="bg-red-600 px-6 py-4">
                      <div className="flex items-center justify-between">
                        <Dialog.Title className="text-lg font-medium text-white">
                          Delete Trip
                        </Dialog.Title>
                        <button
                          onClick={closeModals}
                          className="text-white hover:text-gray-200 transition-colors"
                          disabled={isDeleting}
                        >
                          <XMarkIcon className="w-6 h-6" />
                        </button>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                          <TrashIcon className="h-6 w-6 text-red-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Are you sure you want to delete this trip?
                        </h3>
                        {tripToDelete && (
                          <p className="text-sm text-gray-500 mb-4">
                            <strong>"{tripToDelete.name}"</strong> to {tripToDelete.destination} will be permanently deleted. This action cannot be undone.
                          </p>
                        )}
                        
                        <div className="mt-6 flex space-x-3 justify-center">
                          <button
                            type="button"
                            onClick={closeModals}
                            disabled={isDeleting}
                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={confirmDeleteTrip}
                            disabled={isDeleting}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center"
                          >
                            {isDeleting ? (
                              <>
                                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                Deleting...
                              </>
                            ) : (
                              <>
                                <TrashIcon className="w-4 h-4 mr-2" />
                                Delete Trip
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  );
}
