'use client';

import { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { useAuth } from '@/context/AuthContext';
import { bookingService } from '@/lib/booking-service';
import { useRouter } from 'next/navigation';

interface Booking {
  id: string;
  type: 'Flight' | 'Hotel' | 'Car Rental';
  date: string;
  status: string;
  location: string;
  provider: string;
  amount: string;
  flightNumber?: string;
  checkInStatus?: string;
}

export default function MyBooking() {
  const [enabled, setEnabled] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        
        // Fetch flight bookings
        const flightResponse = await bookingService.getUserBookings();
        
        if (flightResponse.success && flightResponse.bookings) {
          // Transform flight bookings to the common booking format
          const transformedBookings: Booking[] = flightResponse.bookings.map(booking => ({
            id: booking.bookingId,
            type: 'Flight' as const,
            date: booking.bookingDateTime || booking.departureTime,
            status: booking.status || 'Unknown',
            location: booking.route || `${booking.flightNumber}`,
            provider: booking.airline || 'Unknown Airline',
            amount: `$${booking.totalPaid.toFixed(2)}`,
            flightNumber: booking.flightNumber,
            checkInStatus: booking.checkInStatus
          }));
          
          setBookings(transformedBookings);
        } else {
          setError('Failed to fetch bookings');
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

  // TODO: Add hotel and car rental booking fetching when those APIs are ready

  const filteredBookings = bookings.filter(booking =>
    booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.provider.toLowerCase().includes(searchTerm.toLowerCase())
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
      case 'Car Rental':
        return '🚗';
      default:
        return '📋';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            My Bookings
          </h1>
          <p className="text-gray-600 text-lg">
            Manage and track all your travel reservations
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="relative w-full lg:w-2/3">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Search bookings by ID, type, location, or provider..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 w-full rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 bg-gray-50"
              />
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-3">
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
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {filteredBookings.length} Booking{filteredBookings.length !== 1 ? 's' : ''} Found
            </h2>
          </div>
          
          <div className="overflow-x-auto">
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
                    Status
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
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-lg">{getTypeIcon(booking.type)}</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{booking.id}</div>
                          <div className="text-sm text-gray-500">{booking.type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(booking.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {booking.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.provider}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {booking.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredBookings.length === 0 && !loading && !error && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">
                {searchTerm ? '🔍' : '✈️'}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No bookings found' : 'No bookings yet'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm 
                  ? 'Try adjusting your search criteria' 
                  : 'Start planning your next adventure!'
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={() => router.push('/flight-search')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Book Your First Flight
                </button>
              )}
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
}