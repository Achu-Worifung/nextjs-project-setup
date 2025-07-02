'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Tab } from '@headlessui/react';
import { 
  ArrowLeftIcon,
  CheckIcon,
  CalendarDaysIcon,
  MapPinIcon,
  UserGroupIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/solid';
import { useAuth } from '@/context/AuthContext';

interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  status: string;
  description?: string;
}

interface FlightOption {
  id: string;
  airline: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  duration: string;
  stops: number;
}

interface HotelOption {
  id: string;
  name: string;
  rating: number;
  address: string;
  price: number;
  amenities: string[];
  imageUrl: string;
  roomType: string;
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
  const [selectedFlight, setSelectedFlight] = useState<FlightOption | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<HotelOption | null>(null);
  const [selectedCar, setSelectedCar] = useState<CarOption | null>(null);

  const tabs = ['Flight', 'Hotel', 'Car Rental', 'Summary'];

  // Mock data
  const mockFlights: FlightOption[] = [
    {
      id: '1',
      airline: 'Air France',
      flightNumber: 'AF123',
      departure: 'JFK',
      arrival: 'CDG',
      departureTime: '2025-08-15T14:30:00',
      arrivalTime: '2025-08-16T07:15:00',
      price: 850,
      duration: '7h 45m',
      stops: 0
    },
    {
      id: '2',
      airline: 'Delta',
      flightNumber: 'DL456',
      departure: 'JFK',
      arrival: 'CDG',
      departureTime: '2025-08-15T10:15:00',
      arrivalTime: '2025-08-16T01:30:00',
      price: 780,
      duration: '8h 15m',
      stops: 1
    }
  ];

  const mockHotels: HotelOption[] = [
    {
      id: '1',
      name: 'Hotel des Grands Boulevards',
      rating: 4.5,
      address: '17 Boulevard Poissonnière, Paris',
      price: 200,
      amenities: ['Free WiFi', 'Restaurant', 'Bar', 'Concierge'],
      imageUrl: '/des1.jpg',
      roomType: 'Deluxe Room'
    },
    {
      id: '2',
      name: 'Le Marais Boutique Hotel',
      rating: 4.3,
      address: '12 Rue de Rivoli, Paris',
      price: 180,
      amenities: ['Free WiFi', 'Breakfast', 'Gym', 'Spa'],
      imageUrl: '/des2.jpg',
      roomType: 'Superior Room'
    }
  ];

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
        description: 'Romantic getaway to the City of Light'
      });
      
      setLoading(false);
    };

    loadTrip();
  }, [isSignedIn, router, params?.id]);

  const handleBookFlight = (flight: FlightOption) => {
    // Navigate to flight booking with pre-filled data
    router.push(`/flight-search?prefill=${encodeURIComponent(JSON.stringify({
      from: flight.departure,
      to: flight.arrival,
      departure: trip?.startDate,
      passengers: trip?.travelers || 1,
      selectedFlight: flight
    }))}`);
  };

  const handleBookHotel = (hotel: HotelOption) => {
    // Navigate to hotel booking
    router.push(`/hotel-search?prefill=${encodeURIComponent(JSON.stringify({
      destination: trip?.destination,
      checkIn: trip?.startDate,
      checkOut: trip?.endDate,
      guests: trip?.travelers || 1,
      selectedHotel: hotel
    }))}`);
  };

  const handleBookCar = (car: CarOption) => {
    // Navigate to car booking
    router.push(`/car-search?prefill=${encodeURIComponent(JSON.stringify({
      location: trip?.destination,
      pickupDate: trip?.startDate,
      dropoffDate: trip?.endDate,
      selectedCar: car
    }))}`);
  };

  const getTotalEstimate = () => {
    let total = 0;
    if (selectedFlight) total += selectedFlight.price * (trip?.travelers || 1);
    if (selectedHotel && trip) {
      const nights = Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24));
      total += selectedHotel.price * nights;
    }
    if (selectedCar && trip) {
      const days = Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24));
      total += selectedCar.price * days;
    }
    return total;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Trip Details</h3>
              <p className="text-gray-500">Please wait while we prepare your trip planning...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Trip Not Found</h3>
            <p className="text-gray-500 mb-4">The requested trip could not be found.</p>
            <button
              onClick={() => router.push('/mytrips')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to My Trips
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/mytrips')}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{trip.name}</h1>
                <div className="flex items-center space-x-4 text-gray-600 mt-2">
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
              <div className="text-sm text-gray-500">Estimated Total</div>
              <div className="text-2xl font-bold text-green-600">${getTotalEstimate().toLocaleString()}</div>
              <div className="text-sm text-gray-500">
                Remaining: ${Math.max(0, trip.budget - getTotalEstimate()).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Planning Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
            <Tab.List className="flex bg-gray-50 border-b">
              {tabs.map((tab, index) => (
                <Tab
                  key={tab}
                  className={({ selected }) =>
                    classNames(
                      'flex-1 px-6 py-4 text-sm font-medium focus:outline-none',
                      selected
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
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
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Choose Your Flight</h2>
                <div className="space-y-4">
                  {mockFlights.map((flight) => (
                    <div key={flight.id} className={`border rounded-lg p-4 ${selectedFlight?.id === flight.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-semibold text-lg">
                              {flight.airline} {flight.flightNumber}
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-600">${flight.price}</div>
                              <div className="text-sm text-gray-500">per person</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-gray-600 mb-2">
                            <span>{flight.departure} → {flight.arrival}</span>
                            <span>Duration: {flight.duration}</span>
                            <span>{flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            Departure: {new Date(flight.departureTime).toLocaleString()} | 
                            Arrival: {new Date(flight.arrivalTime).toLocaleString()}
                          </div>
                        </div>
                        <div className="ml-4 space-x-2">
                          <button
                            onClick={() => setSelectedFlight(flight)}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                              selectedFlight?.id === flight.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {selectedFlight?.id === flight.id ? 'Selected' : 'Select'}
                          </button>
                          <button
                            onClick={() => handleBookFlight(flight)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Tab.Panel>

              {/* Hotel Tab */}
              <Tab.Panel className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Choose Your Hotel</h2>
                <div className="space-y-4">
                  {mockHotels.map((hotel) => (
                    <div key={hotel.id} className={`border rounded-lg p-4 ${selectedHotel?.id === hotel.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                      <div className="flex">
                        <div className="w-24 h-24 bg-gray-200 rounded-lg mr-4 flex-shrink-0">
                          <div className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center text-gray-500">
                            🏨
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">{hotel.name}</h3>
                              <div className="flex items-center">
                                <span className="text-yellow-400">{'★'.repeat(Math.floor(hotel.rating))}</span>
                                <span className="ml-1 text-gray-600">({hotel.rating})</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-600">${hotel.price}</div>
                              <div className="text-sm text-gray-500">per night</div>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{hotel.address}</p>
                          <p className="text-gray-600 text-sm mb-2">{hotel.roomType}</p>
                          <div className="flex items-center space-x-2 mb-2">
                            {hotel.amenities.slice(0, 3).map((amenity, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                {amenity}
                              </span>
                            ))}
                            {hotel.amenities.length > 3 && (
                              <span className="text-gray-500 text-xs">+{hotel.amenities.length - 3} more</span>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setSelectedHotel(hotel)}
                              className={`px-4 py-2 rounded-lg transition-colors ${
                                selectedHotel?.id === hotel.id
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {selectedHotel?.id === hotel.id ? 'Selected' : 'Select'}
                            </button>
                            <button
                              onClick={() => handleBookHotel(hotel)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Book Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Tab.Panel>

              {/* Car Tab */}
              <Tab.Panel className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Choose Your Car Rental</h2>
                <div className="space-y-4">
                  {mockCars.map((car) => (
                    <div key={car.id} className={`border rounded-lg p-4 ${selectedCar?.id === car.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                      <div className="flex">
                        <div className="w-24 h-24 bg-gray-200 rounded-lg mr-4 flex-shrink-0">
                          <div className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center text-gray-500">
                            🚗
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">{car.name}</h3>
                              <p className="text-gray-600">{car.type} • {car.company}</p>
                              <p className="text-gray-600 text-sm">{car.seats} seats</p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-600">${car.price}</div>
                              <div className="text-sm text-gray-500">per day</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 mb-2">
                            {car.features.slice(0, 4).map((feature, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                {feature}
                              </span>
                            ))}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setSelectedCar(car)}
                              className={`px-4 py-2 rounded-lg transition-colors ${
                                selectedCar?.id === car.id
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {selectedCar?.id === car.id ? 'Selected' : 'Select'}
                            </button>
                            <button
                              onClick={() => handleBookCar(car)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Book Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Tab.Panel>

              {/* Summary Tab */}
              <Tab.Panel className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Trip Summary</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Selected Options</h3>
                      
                      {selectedFlight ? (
                        <div className="mb-4 p-3 bg-white rounded border">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">✈️ {selectedFlight.airline} {selectedFlight.flightNumber}</div>
                              <div className="text-sm text-gray-600">{selectedFlight.departure} → {selectedFlight.arrival}</div>
                            </div>
                            <div className="text-green-600 font-semibold">${selectedFlight.price * trip.travelers}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="mb-4 p-3 bg-gray-100 rounded border-dashed border-2 border-gray-300">
                          <div className="text-gray-500 text-center">No flight selected</div>
                        </div>
                      )}

                      {selectedHotel ? (
                        <div className="mb-4 p-3 bg-white rounded border">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">🏨 {selectedHotel.name}</div>
                              <div className="text-sm text-gray-600">{selectedHotel.roomType}</div>
                            </div>
                            <div className="text-green-600 font-semibold">
                              ${selectedHotel.price * Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="mb-4 p-3 bg-gray-100 rounded border-dashed border-2 border-gray-300">
                          <div className="text-gray-500 text-center">No hotel selected</div>
                        </div>
                      )}

                      {selectedCar ? (
                        <div className="mb-4 p-3 bg-white rounded border">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">🚗 {selectedCar.name}</div>
                              <div className="text-sm text-gray-600">{selectedCar.type} • {selectedCar.company}</div>
                            </div>
                            <div className="text-green-600 font-semibold">
                              ${selectedCar.price * Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="mb-4 p-3 bg-gray-100 rounded border-dashed border-2 border-gray-300">
                          <div className="text-gray-500 text-center">No car rental selected</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Cost Breakdown</h3>
                      <div className="space-y-2">
                        {selectedFlight && (
                          <div className="flex justify-between">
                            <span>Flight ({trip.travelers} passenger{trip.travelers > 1 ? 's' : ''})</span>
                            <span>${selectedFlight.price * trip.travelers}</span>
                          </div>
                        )}
                        {selectedHotel && (
                          <div className="flex justify-between">
                            <span>Hotel ({Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24))} nights)</span>
                            <span>${selectedHotel.price * Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24))}</span>
                          </div>
                        )}
                        {selectedCar && (
                          <div className="flex justify-between">
                            <span>Car Rental ({Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24))} days)</span>
                            <span>${selectedCar.price * Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24))}</span>
                          </div>
                        )}
                        <hr className="my-2" />
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Total Estimate</span>
                          <span className="text-green-600">${getTotalEstimate()}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Budget Remaining</span>
                          <span className={`${trip.budget - getTotalEstimate() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ${Math.max(0, trip.budget - getTotalEstimate())}
                            {trip.budget - getTotalEstimate() < 0 && ' (Over budget)'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Next Steps</h3>
                      <div className="space-y-2 text-sm">
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
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => setSelectedTab(Math.min(tabs.length - 1, selectedTab + 1))}
            disabled={selectedTab === tabs.length - 1}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
