'use client';

import { useState, useEffect } from 'react';
import { Switch, Dialog, Transition } from '@headlessui/react';
import { MagnifyingGlassIcon, XMarkIcon, CalendarDaysIcon, MapPinIcon, CreditCardIcon, BuildingOfficeIcon } from '@heroicons/react/24/solid';
import { useAuth } from '@/context/AuthContext';
import { bookingService } from '@/lib/booking-service';
import { useRouter } from 'next/navigation';
import { Fragment } from 'react';
interface Booking {
  bookingid: string;
  paymentId: string;
  userId: string;
  bookingtype: string;
  totalpaid: number;
  bookingStatus: string;
  location?: string;
  provider?: string;
  departureTime?: string;
  arrivalTime?: string;
  checkInDate?: string;
  checkOutDate?: string;
  pickupDate?: string;
  dropoffDate?: string;
  bookingDateTime?: string;
  flightNumber?: string;
  airline?: string;
  hotelName?: string;
  roomType?: string;
  vehicle?: string;
  companyName?: string;
  guests?: number;
  nights?: number;
  days?: number;
}

export default function MyBooking() {
  const [enabled, setEnabled] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const { isSignedIn } = useAuth();
  const router = useRouter();

  // Fetch user bookings on component mount
  useEffect(() => {
    const fetchBookings = async () => {
      if (!isSignedIn) {
        router.push('/signin');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const allBookings: Booking[] = await bookingService.getUserBookings();
        
        console.log('Fetched all bookings:', allBookings);
        
        setBookings(allBookings);
        
        if (!allBookings || allBookings.length === 0) {
          console.log('No bookings found for user');
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError('Failed to load bookings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [isSignedIn, router]);

  // Check if cancellation is allowed (booking time hasn't passed)
  const isCancellationAllowed = (booking: Booking): boolean => {
    const now = new Date();
    
    // For flights, check departure time
    if (booking.bookingtype === 'Flight' && booking.departureTime) {
      const departureTime = new Date(booking.departureTime);
      return departureTime > now;
    }
    
    // For hotels, check check-in date
    if (booking.bookingtype === 'Hotel' && booking.checkInDate) {
      const checkInDate = new Date(booking.checkInDate);
      return checkInDate > now;
    }
    
    // For cars, check pickup date
    if (booking.bookingtype === 'Car' && booking.pickupDate) {
      const pickupDate = new Date(booking.pickupDate);
      return pickupDate > now;
    }
    
    // Default to allow cancellation if no specific date is available
    return true;
  };

  // Handle booking row click - fetch detailed information
  const handleBookingClick = async (booking: Booking) => {
    try {
      // Show loading state in modal
      setSelectedBooking(booking);
      setIsModalOpen(true);
      setDetailsLoading(true);
      
      // Fetch detailed booking information
      const detailsResult = await bookingService.getBookingDetails(booking.bookingid, booking.bookingtype);
      
      if (detailsResult.success && detailsResult.booking) {
        // Update selectedBooking with detailed information
        setSelectedBooking({
          ...booking,
          ...detailsResult.booking
        });
        console.log('Fetched booking details:', detailsResult.booking);
      } else {
        console.error('Failed to fetch booking details:', detailsResult.error);
        // Still show modal with basic information
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
      // Still show modal with basic information
      setSelectedBooking(booking);
      setIsModalOpen(true);
    } finally {
      setDetailsLoading(false);
    }
  };

  // Handle booking cancellation
  const handleCancelBooking = async () => {
    if (!selectedBooking) return;
    
    try {
      setCancelLoading(true);
      const result = await bookingService.cancelBooking(selectedBooking.bookingid, selectedBooking.bookingtype);
      
      if (result.success) {
        // Update the booking status in the local state
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking.bookingid === selectedBooking.bookingid 
              ? { ...booking, bookingStatus: 'Cancelled' }
              : booking
          )
        );
        setIsModalOpen(false);
        setSelectedBooking(null);
      } else {
        setError(result.error || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setError('Failed to cancel booking. Please try again.');
    } finally {
      setCancelLoading(false);
    }
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const filteredBookings = bookings.filter(booking =>
    booking.bookingid.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.bookingtype.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (booking.location && booking.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (booking.provider && booking.provider.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Flight':
        return '✈️';
      case 'Hotel':
        return '🏨';
      case 'Car':
        return '🚗';
      default:
        return '📋';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-2 sm:p-4 lg:p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                My Bookings
              </h1>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
                Manage and track your travel reservations
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => router.push('/mytrips')}
                className="flex items-center justify-center px-4 sm:px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors shadow-lg text-sm sm:text-base"
              >
                <span className="mr-2">🗺️</span>
                <span className="hidden sm:inline">Plan New Trip</span>
                <span className="sm:hidden">Plan Trip</span>
              </button>
              <button
                onClick={() => router.push('/flight-search')}
                className="flex items-center justify-center px-4 sm:px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg text-sm sm:text-base"
              >
                <span className="mr-2">✈️</span>
                <span className="hidden sm:inline">Book Now</span>
                <span className="sm:hidden">Book</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-8">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="relative w-full lg:w-2/3">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Search bookings by ID, type, location, or provider..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 w-full rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 bg-gray-50 text-sm sm:text-base"
              />
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center justify-center lg:justify-start space-x-3 bg-gray-50 rounded-xl p-3">
              <Switch
                checked={enabled}
                onChange={setEnabled}
                className={`${enabled ? 'bg-blue-600' : 'bg-gray-300'}
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                <span
                  className={`${
                    enabled ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform bg-white rounded-full transition-transform duration-200`}
                />
              </Switch>
              <span className="text-sm font-medium text-gray-700">Upcoming Only</span>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Bookings</h3>
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Your Bookings</h3>
              <p className="text-gray-500">Please wait while we fetch your travel reservations...</p>
            </div>
          </div>
        )}

        {/* Bookings Table */}
        {!loading && !error && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              {filteredBookings.length} Booking{filteredBookings.length !== 1 ? 's' : ''} Found
            </h2>
          </div>
          
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Provider
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking: Booking) => (
                  <tr 
                    key={booking.bookingid} 
                    className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                    onClick={() => handleBookingClick(booking)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-lg">{getTypeIcon(booking.bookingtype)}</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{booking.bookingid}</div>
                          <div className="text-sm text-gray-500">{booking.bookingtype}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.bookingDateTime ? new Date(booking.bookingDateTime).toISOString().split('T')[0] : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {booking.location || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.provider || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${booking.totalpaid || '0.00'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden divide-y divide-gray-200">
            {filteredBookings.map((booking: Booking) => (
              <div 
                key={booking.bookingid}
                className="p-4 sm:p-6 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                onClick={() => handleBookingClick(booking)}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-xl">{getTypeIcon(booking.bookingtype)}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {booking.bookingid}
                      </p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.bookingStatus)}`}>
                        {booking.bookingStatus}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">Type:</p>
                        <p className="text-sm font-medium text-gray-900">{booking.bookingtype}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">Date:</p>
                        <p className="text-sm text-gray-900">
                          {booking.bookingDateTime ? new Date(booking.bookingDateTime).toISOString().split('T')[0] : 'N/A'}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">Location:</p>
                        <p className="text-sm text-gray-900 truncate max-w-32">{booking.location || 'N/A'}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">Provider:</p>
                        <p className="text-sm text-gray-900 truncate max-w-32">{booking.provider || 'N/A'}</p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <p className="text-sm font-medium text-gray-500">Total:</p>
                        <p className="text-lg font-bold text-green-600">${booking.totalpaid || '0.00'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredBookings.length === 0 && !loading && !error && (
            <div className="text-center py-12 px-4">
              <div className="text-gray-400 text-6xl mb-4">
                {searchTerm ? '🔍' : '✈️'}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No bookings found' : 'No bookings yet'}
              </h3>
              <p className="text-gray-500 mb-4 text-sm sm:text-base">
                {searchTerm 
                  ? 'Try adjusting your search criteria' 
                  : 'Start planning your next adventure!'
                }
              </p>
              {!searchTerm && (
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <button
                    onClick={() => router.push('/mytrips')}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Plan a Trip
                  </button>
                  <button
                    onClick={() => router.push('/flight-search')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Book Individual Service
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        )}

        {/* Booking Details Modal */}
        <Transition appear show={isModalOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-white/30  backdrop-blur-sm" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-2 sm:p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-2xl mx-2 sm:mx-4 transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                    {selectedBooking && (
                      <>
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 sm:px-6 py-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 sm:w-12 h-10 sm:h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                                <span className="text-xl sm:text-2xl text-white">
                                  {getTypeIcon(selectedBooking.bookingtype)}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <Dialog.Title className="text-lg sm:text-xl font-semibold text-white truncate">
                                  {selectedBooking.bookingtype} Booking Details
                                </Dialog.Title>
                                <p className="text-blue-100 text-xs sm:text-sm truncate">
                                  Booking ID: {selectedBooking.bookingid}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={closeModal}
                              className="text-white hover:text-gray-200 transition-colors flex-shrink-0"
                            >
                              <XMarkIcon className="w-6 h-6" />
                            </button>
                          </div>
                        </div>

                        {/* Modal Content */}
                        <div className="px-4 sm:px-6 py-6">
                          {detailsLoading ? (
                            <div className="text-center py-8">
                              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                              <p className="text-gray-500">Loading booking details...</p>
                            </div>
                          ) : (
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                            {/* Left Column - Main Details */}
                            <div className="space-y-4">
                              <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center text-sm sm:text-base">
                                  <BuildingOfficeIcon className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-blue-600" />
                                  Service Details
                                </h3>
                                <div className="space-y-2">
                                  {selectedBooking.bookingtype === 'Flight' && (
                                    <>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600 text-sm">Flight Number:</span>
                                        <span className="font-medium text-sm truncate ml-2">{selectedBooking.flightNumber || 'N/A'}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600 text-sm">Airline:</span>
                                        <span className="font-medium text-sm truncate ml-2">{selectedBooking.airline || selectedBooking.provider || 'N/A'}</span>
                                      </div>
                                    </>
                                  )}
                                  {selectedBooking.bookingtype === 'Hotel' && (
                                    <>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600 text-sm">Hotel Name:</span>
                                        <span className="font-medium text-sm truncate ml-2">{selectedBooking.hotelName || selectedBooking.provider || 'N/A'}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600 text-sm">Room Type:</span>
                                        <span className="font-medium text-sm truncate ml-2">{selectedBooking.roomType || 'N/A'}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600 text-sm">Guests:</span>
                                        <span className="font-medium text-sm">{selectedBooking.guests || 'N/A'}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600 text-sm">Nights:</span>
                                        <span className="font-medium text-sm">{selectedBooking.nights || 'N/A'}</span>
                                      </div>
                                    </>
                                  )}
                                  {selectedBooking.bookingtype === 'Car' && (
                                    <>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600 text-sm">Vehicle:</span>
                                        <span className="font-medium text-sm truncate ml-2">{selectedBooking.vehicle || 'N/A'}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600 text-sm">Company:</span>
                                        <span className="font-medium text-sm truncate ml-2">{selectedBooking.companyName || selectedBooking.provider || 'N/A'}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600 text-sm">Days:</span>
                                        <span className="font-medium text-sm">{selectedBooking.days || 'N/A'}</span>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* Location Details */}
                              <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center text-sm sm:text-base">
                                  <MapPinIcon className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-green-600" />
                                  Location Details
                                </h3>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 text-sm">Location:</span>
                                    <span className="font-medium text-sm truncate ml-2">{selectedBooking.location || 'N/A'}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Right Column - Dates & Payment */}
                            <div className="space-y-4">
                              {/* Date Details */}
                              <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center text-sm sm:text-base">
                                  <CalendarDaysIcon className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-purple-600" />
                                  Schedule
                                </h3>
                                <div className="space-y-2">
                                  {selectedBooking.bookingtype === 'Flight' && (
                                    <>
                                      <div className="flex flex-col sm:flex-row sm:justify-between">
                                        <span className="text-gray-600 text-sm">Departure:</span>
                                        <span className="font-medium text-sm break-all sm:text-right">
                                          {selectedBooking.departureTime 
                                            ? new Date(selectedBooking.departureTime).toLocaleString()
                                            : 'N/A'
                                          }
                                        </span>
                                      </div>
                                      <div className="flex flex-col sm:flex-row sm:justify-between">
                                        <span className="text-gray-600 text-sm">Arrival:</span>
                                        <span className="font-medium text-sm break-all sm:text-right">
                                          {selectedBooking.arrivalTime 
                                            ? new Date(selectedBooking.arrivalTime).toLocaleString()
                                            : 'N/A'
                                          }
                                        </span>
                                      </div>
                                    </>
                                  )}
                                  {selectedBooking.bookingtype === 'Hotel' && (
                                    <>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600 text-sm">Check-in:</span>
                                        <span className="font-medium text-sm">
                                          {selectedBooking.checkInDate 
                                            ? new Date(selectedBooking.checkInDate).toLocaleDateString()
                                            : 'N/A'
                                          }
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600 text-sm">Check-out:</span>
                                        <span className="font-medium text-sm">
                                          {selectedBooking.checkOutDate 
                                            ? new Date(selectedBooking.checkOutDate).toLocaleDateString()
                                            : 'N/A'
                                          }
                                        </span>
                                      </div>
                                    </>
                                  )}
                                  {selectedBooking.bookingtype === 'Car' && (
                                    <>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600 text-sm">Pickup:</span>
                                        <span className="font-medium text-sm">
                                          {selectedBooking.pickupDate 
                                            ? new Date(selectedBooking.pickupDate).toLocaleDateString()
                                            : 'N/A'
                                          }
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600 text-sm">Drop-off:</span>
                                        <span className="font-medium text-sm">
                                          {selectedBooking.dropoffDate 
                                            ? new Date(selectedBooking.dropoffDate).toLocaleDateString()
                                            : 'N/A'
                                          }
                                        </span>
                                      </div>
                                    </>
                                  )}
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 text-sm">Booked On:</span>
                                    <span className="font-medium text-sm">
                                      {selectedBooking.bookingDateTime 
                                        ? new Date(selectedBooking.bookingDateTime).toLocaleDateString()
                                        : 'N/A'
                                      }
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Payment Details */}
                              <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center text-sm sm:text-base">
                                  <CreditCardIcon className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-yellow-600" />
                                  Payment Details
                                </h3>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 text-sm">Total Paid:</span>
                                    <span className="font-bold text-lg text-green-600">
                                      ${selectedBooking.totalpaid || '0.00'}
                                    </span>
                                  </div>
                                  <div className="flex flex-col sm:flex-row sm:justify-between">
                                    <span className="text-gray-600 text-sm">Payment ID:</span>
                                    <span className="font-medium text-xs break-all sm:text-right">{selectedBooking.paymentId}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 text-sm">Status:</span>
                                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedBooking.bookingStatus)}`}>
                                      {selectedBooking.bookingStatus}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          )}
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-gray-50 px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                          <div className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
                            {isCancellationAllowed(selectedBooking) && selectedBooking.bookingStatus !== 'Cancelled'
                              ? 'You can cancel this booking'
                              : selectedBooking.bookingStatus === 'Cancelled'
                              ? 'This booking has been cancelled'
                              : 'Cancellation is no longer available for this booking'
                            }
                          </div>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <button
                              onClick={closeModal}
                              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                            >
                              Close
                            </button>
                            {isCancellationAllowed(selectedBooking) && selectedBooking.bookingStatus !== 'Cancelled' && (
                              <button
                                onClick={handleCancelBooking}
                                disabled={cancelLoading}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
                              >
                                {cancelLoading ? (
                                  <>
                                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                    Cancelling...
                                  </>
                                ) : (
                                  'Cancel Booking'
                                )}
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
      </div>
    </div>
  );
}