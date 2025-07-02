'use client';

import { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { 
  PlusIcon, 
  MapPinIcon, 
  CalendarDaysIcon, 
  XMarkIcon,
  PencilIcon,
  EyeIcon
} from '@heroicons/react/24/solid';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Fragment } from 'react';

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
  const { isSignedIn } = useAuth();
  const router = useRouter();

  // Mock data for now - this would come from an API
  useEffect(() => {
    const loadTrips = async () => {
      if (!isSignedIn) {
        router.push('/signin');
        return;
      }

      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock trips data
        const mockTrips: Trip[] = [
          {
            id: '1',
            name: 'Summer Vacation in Paris',
            destination: 'Paris, France',
            startDate: '2025-08-15',
            endDate: '2025-08-25',
            travelers: 2,
            budget: 5000,
            status: 'Planning',
            description: 'Romantic getaway to the City of Light',
            createdAt: '2025-07-01',
            updatedAt: '2025-07-01',
            flight: { included: true, departure: 'JFK', arrival: 'CDG' },
            hotel: { included: true, name: 'Hotel des Grands Boulevards', rooms: 1 },
            car: { included: false }
          },
          {
            id: '2',
            name: 'Business Trip to Tokyo',
            destination: 'Tokyo, Japan',
            startDate: '2025-09-10',
            endDate: '2025-09-15',
            travelers: 1,
            budget: 3500,
            status: 'Booked',
            description: 'Annual conference and client meetings',
            createdAt: '2025-06-15',
            updatedAt: '2025-06-20',
            flight: { included: true, departure: 'LAX', arrival: 'NRT' },
            hotel: { included: true, name: 'The Peninsula Tokyo', rooms: 1 },
            car: { included: true, type: 'Executive Sedan' }
          }
        ];
        
        setTrips(mockTrips);
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

  const handleViewTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    setIsDetailModalOpen(true);
  };

  const handleCreateTrip = () => {
    setIsCreateModalOpen(true);
  };

  const handlePlanTrip = (tripId: string) => {
    // Navigate to trip planning page
    router.push(`/mytrips/${tripId}/plan`);
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsDetailModalOpen(false);
    setSelectedTrip(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center">
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
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Create New Trip
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">✈️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Trips</p>
                <p className="text-2xl font-bold text-gray-900">{trips.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Planning</p>
                <p className="text-2xl font-bold text-gray-900">
                  {trips.filter(t => t.status === 'Planning').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Booked</p>
                <p className="text-2xl font-bold text-gray-900">
                  {trips.filter(t => t.status === 'Booked').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Budget</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${trips.reduce((sum, trip) => sum + trip.budget, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

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
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                      {trip.status}
                    </span>
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
                      <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-1 ${
                        trip.flight?.included ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        ✈️
                      </div>
                      <span className="text-xs text-gray-500">Flight</span>
                    </div>
                    <div className="text-center">
                      <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-1 ${
                        trip.hotel?.included ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        🏨
                      </div>
                      <span className="text-xs text-gray-500">Hotel</span>
                    </div>
                    <div className="text-center">
                      <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-1 ${
                        trip.car?.included ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        🚗
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
                    <button
                      onClick={() => handlePlanTrip(trip.id)}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <PencilIcon className="w-4 h-4 mr-1" />
                      Plan
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
                      <form className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Trip Name
                          </label>
                          <input
                            type="text"
                            placeholder="e.g., Summer Vacation in Paris"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Destination
                          </label>
                          <input
                            type="text"
                            placeholder="e.g., Paris, France"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Start Date
                            </label>
                            <input
                              type="date"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              End Date
                            </label>
                            <input
                              type="date"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                              placeholder="2"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Budget ($)
                            </label>
                            <input
                              type="number"
                              placeholder="5000"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </form>
                    </div>

                    <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                      <button
                        onClick={closeModals}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Create Trip
                      </button>
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
                                        {selectedTrip.flight.departure} → {selectedTrip.flight.arrival}
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
                            <button
                              onClick={() => handlePlanTrip(selectedTrip.id)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Start Planning
                            </button>
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
      </div>
    </div>
  );
}
