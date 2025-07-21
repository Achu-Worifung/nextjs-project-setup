'use client';
import { tokenManager } from './token-manager';
import { decodeJWT } from '@/lib/auth-utils';


export interface FlightBookingRequest {
  token: string; // Optional token for client-side use
  flightNumber: string;
  airline: string;
  departureAirport: string;
  destinationAirport: string;
  departureTime: string;
  arrivalTime: string;
  flightClass: 'Economy' | 'Business' | 'First';
  price: number;
  numberOfSeats: number;
  // Add complete flight details for storage
  flightDetails?: {
    duration: string;
    aircraft: string;
    gate: string;
    terminal: string;
    numberOfStops: number;
    stops: Array<{
      airport: string;
      arrivalTime: string;
      departureTime: string;
      layoverDuration: string;
    }>;
    status: string;
    meal: boolean;
    availableSeats: {
      Economy: number;
      Business: number;
      First: number;
    };
    prices: {
      Economy: number;
      Business: number;
      First: number;
    };
  };
}

export interface HotelBookingRequest {
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  totalPrice: number;
  // Complete hotel details for storage
  hotelDetails: {
    hotelName: string;
    hotelAddress: string;
    hotelCity: string;
    hotelCountry: string;
    hotelRating?: number;
    roomType: string;
    roomDescription?: string;
    maxOccupancy: number;
    nights: number;
    basePrice: number;
    discounts?: number;
    tax: number;
    amenities?: string[];
    images?: string[];
    checkInTime?: string;
    checkOutTime?: string;
  };
}

export interface CarBookingRequest {
  id:number;
  name:string;
  make:string;
  model:string;
  year:number;
  imageUrl:string;
  seats:number;
  type:string;
  pricePerDay:number;
  features:string;
  transmission:string;
  fuelType:string;
  rating:number;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  dropoffDate: string;
}

export interface FlightBooking {
  bookingId: string;
  flightBookingId: string;
  flightNumber: string;
  airline: string;
  route: string;
  departureTime: string;
  arrivalTime?: string;
  flightClass: string;
  numberOfSeats: number;
  totalPaid: number;
  status: string;
  bookingDateTime?: string;
  checkInStatus?: string;
  // Additional flight details from JSONB column
  duration?: string;
  aircraft?: string;
  gate?: string;
  terminal?: string;
  stops?: Array<unknown>;
  meal?: boolean;
}

export interface HotelBooking {
  bookingId: string;
  hotelBookingId: string;
  hotelName: string;
  location: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  guests: number;
  totalPaid: number;
  status: string;
  bookingDateTime: string;
  // Additional details from JSONB
  hotelRating?: number;
  amenities?: string[];
  roomDescription?: string;
}

export interface CarBooking {
  bookingId: string;
  carBookingId: string;
  companyName: string;
  vehicle: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  dropoffDate: string;
  days: number;
  numberPassengers: number;
  totalPaid: number;
  status: string;
  bookingDateTime: string;
}

export interface BookingDetails {
  success: boolean;
  booking?: {
    bookingId: string;
    userId: string;
    bookingType: string;
    totalPaid: number;
    status: string;
    bookingDateTime: string;
    location?: string;
    provider?: string;
    // Flight specific
    flightNumber?: string;
    airline?: string;
    departureTime?: string;
    arrivalTime?: string;
    flightClass?: string;
    numberOfSeats?: number;
    // Hotel specific
    hotelName?: string;
    roomType?: string;
    checkInDate?: string;
    checkOutDate?: string;
    nights?: number;
    guests?: number;
    // Car specific
    vehicle?: string;
    companyName?: string;
    pickupDate?: string;
    dropoffDate?: string;
    days?: number;
    numberPassengers?: number;
    pickupLocation?: string;
    dropoffLocation?: string;
    [key: string]: unknown; // Allow additional properties
  };
  error?: string;
}

export interface BookingResponse {
  success: boolean;
  message?: string;
  booking?: FlightBooking | HotelBooking | CarBooking;
  error?: string;
}

export interface FlightBookingsListResponse {
  success: boolean;
  bookings?: FlightBooking[];
  error?: string;
}

export interface HotelBookingsListResponse {
  success: boolean;
  bookings?: HotelBooking[];
  error?: string;
}

export interface CarBookingsListResponse {
  success: boolean;
  bookings?: CarBooking[];
  error?: string;
}

class BookingService {
  private getAuthHeaders() {
    const token = tokenManager.get();
    if (!token) {
      throw new Error('No authentication token found');
    }
        
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }



  async getUserFlightBookings(): Promise<FlightBookingsListResponse> {
    try {
      const headers = this.getAuthHeaders();
      
      const response = await fetch('/api/bookings/flight', {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch bookings');
      }

      return data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async bookHotel(bookingData: HotelBookingRequest): Promise<BookingResponse> {
    try {
      const headers = this.getAuthHeaders();
      
      const response = await fetch('/api/bookings/hotel', {
        method: 'POST',
        headers,
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Hotel booking failed');
      }

      return data;
    } catch (error) {
      console.error('Hotel booking error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getUserHotelBookings(): Promise<HotelBookingsListResponse> {
    try {
      const headers = this.getAuthHeaders();
      
      const response = await fetch('/api/bookings/hotel', {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch hotel bookings');
      }

      return data;
    } catch (error) {
      console.error('Error fetching hotel bookings:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async bookCar(bookingData: CarBookingRequest): Promise<BookingResponse> {
    try {
      const headers = this.getAuthHeaders();
      
      const response = await fetch('/api/bookings/car', {
        method: 'POST',
        headers,
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Car booking failed');
      }

      return data;
    } catch (error) {
      console.error('Car booking error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getUserCarBookings(): Promise<CarBookingsListResponse> {
    try {
      const headers = this.getAuthHeaders();
      
      const response = await fetch('/api/bookings', {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch car bookings');
      }

      return data;
    } catch (error) {
      console.error('Error fetching car bookings:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getBookingDetails(bookingId: string, bookingType: string): Promise<BookingDetails> {
    try {
      const headers = this.getAuthHeaders();
      
      // Determine the endpoint based on booking type
      let endpoint = '';
      switch (bookingType.toLowerCase()) {
        case 'flight':
          endpoint = `/api/bookings/flight/${bookingId}`;
          break;
        case 'hotel':
          endpoint = `/api/bookings/hotel/${bookingId}`;
          break;
        case 'car':
          endpoint = `/api/bookings/car/${bookingId}`;
          break;
        default:
          throw new Error('Invalid booking type');
      }

      const response = await fetch(endpoint, {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch booking details');
      }

      return data;
    } catch (error) {
      console.error('Booking details fetch error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }




  //get user bookings by token 
  async getUserBookings(token: string){
    try {
      const url = 'http://localhost:8004/bookings';
      const res = await fetch(url, {
        method: 'GET',
        headers:
        {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Client-ID': `${token}`
        }
      });

      if (res.status !== 200) {
        return {
          error: 'Error fetching user bookings',
          msg: res.statusText,
          bookings: []
        }
      }
      const data = await res.json();
      console.log('User bookings fetched successfully:', data);
      return data;

    } catch (error) {
      console.error('Error fetching user bookings:', error);
      return {
        bookings: []
      };
    }
  }


  // Create a new trip
  async createTrip(trip: any, token: string)
  {
    // Debug: log the payload being sent
    console.log('Trip payload being sent to backend:', trip.trip);
    try {
      const url = 'http://localhost:8012/trips/create';
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Client-ID': `${token}`
        },
        body: JSON.stringify(trip.trip)
      });
      const data = await res.json();
      if (res.status !== 201) {
        // Log backend error for diagnosis
        console.error('Backend returned error:', data);
        return {
          success: false,
          error: 'Error creating trip: ' + (data.error || res.statusText)
        };
      }
      console.log('Trip created successfully:', data);
      return {
        success: true,
        trip: data
      };
    } catch (error) {
      console.error('Error creating trip:', error);
      return {
        success: false,
        error: 'Error creating trip: ' + error
      };
    }
}

//fetch users trips
async fetchTrips(token: string){
  try {
    const url = 'http://localhost:8012/trips';
    const res = await fetch(url, {
      method: 'GET',
      headers:
      {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Client-ID': `${token}`
      }
    });
    const data = await res.json();
    if (res.status !== 200) {
      return {
        success: false,
        error: 'Error fetching trips: ' + data.error || res.statusText
      };
    }
    console.log('Trips fetched successfully:', data);
    return {
      success: true,
      trips: data
    };
  } catch (error) {
    console.error('Error fetching trips:', error);
    return {
      success: false,
      error: 'Error fetching trips: ' + error
    };
  }
}

//delete a trip
async deleteTrip(tripId: string, token: string) {
  try {
    const url = `http://localhost:8012/trips/${tripId}`;
    // Fire-and-forget: do not await fetch or .json
    fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Client-ID': `${token}`
      }
    }).catch((error) => {
      console.error('Error deleting trip:', error);
    });
    // Return success immediately
    return {
      success: true
    };
  } catch (error) {
    console.error('Error deleting trip:', error);
    return {
      success: false,
      error: 'Error deleting trip: ' + error
    };
  }
}

//book a flight 
async bookFlight(flight: any, token: string) 
{
  try {
      const url = "http://localhost:8006/flights/book";

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          "X-Client-ID": `${token}`,
        },
        body: JSON.stringify({
          flight
        }),
      });

      const data = await response.json();

      console.log('Flight booking response:', data);



      return data;
    } catch (error) {
      console.error('Flight booking error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  
}

//cancel booking 
async cancelBooking(bookingId: string, token: string, bookingType: string)
{
  let url;
  switch (bookingType.toLowerCase()) {
    case 'flight':
      url = `http://localhost:8006/flights/delete/${bookingId}`;
      break;
    case 'hotel':
      url = `http://localhost:8002/hotels/delete/${bookingId}`;
      break;
    case 'car':
      url = `http://localhost:8001/cars/delete/${bookingId}`;
      break;
    default:
      throw new Error('Invalid booking type');
  }

  try {
    // Fire-and-forget: do not await fetch or .json
    fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Client-ID': `${token}`
      }
    }).catch((error) => {
      console.error('Error canceling booking:', error);
    });
    // Return success immediately
    return {
      success: true
    };
  } catch (error) {
    console.error('Error canceling booking:', error);
    return {
      success: false,
      error: 'Error canceling booking: ' + error
    };
  }
}

async saveAddress({country, state, city, street, zipCode, token}: {country: string, state: string, city: string, street: string, zipCode: string, token: string}) {
  try {
    // console.log('Saving address:', {country, state, city, street, zipCode});
    const url = 'http://localhost:8004/address';
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Client-ID': `${token}`
      },
      body: JSON.stringify({country, state, city, street, zipCode})
    });
    const data = await res.json();
    if (res.status !== 200) {
      return {
        success: false,
        error: 'Error saving address: ' + data.error || res.statusText
      };
    }
  } catch (error) {
    console.error('Error saving address:', error);
    return {
      success: false,
      error: 'Error saving address: ' + error
    };
  }
}

async getAddress(token: string) {
  try {
    const url = 'http://localhost:8004/get_address';
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Client-ID': `${token}`
      }
    });
    const data = await res.json();
    if (res.status !== 200) {
      return {
        success: false,
        error: 'Error getting address: ' + data.error || res.statusText
      };
    }
    return data;
  } catch (error) {
    console.error('Error getting address:', error);
    return {
      success: false,
      error: 'Error getting address: ' + error
    };
  }
}

async savePaymentDetails({ cardNumber, expiryDate, cvv, cardHolderName, isDefault, token }: { cardNumber: string; expiryDate: string; cvv: string; cardHolderName: string; isDefault: boolean; token: string }) {
  try {
    const url = 'http://localhost:8004/payment';
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Client-ID': `${token}`
      },
      body: JSON.stringify({ cardNumber, expiryDate, cvv, cardHolderName, isDefault })
    });
    const data = await res.json();
    if (res.status !== 200) {
      return {
        success: false,
        error: 'Error saving payment details: ' + data.error || res.statusText
      };
    }
  } catch (error) {
    console.error('Error saving payment details:', error);
    return {
      success: false,
      error: 'Error saving payment details: ' + error
    };
  }
}
async getPaymentDetails(token: string) {
  try {
    const url = 'http://localhost:8004/get_payment';
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Client-ID': `${token}`
      }
    });
    const data = await res.json();
    if (res.status !== 200) {
      return {
        success: false,
        error: 'Error getting payment details: ' + data.error || res.statusText
      };
    }
    return data;
  } catch (error) {
    console.error('Error getting payment details:', error);
    return {
      success: false,
      error: 'Error getting payment details: ' + error
    };
  }
}
// Get current user info from token
  getCurrentUser() {
    const token = tokenManager.get();
    if (!token) {
      return null;
    }
    
    const decode = decodeJWT(token);
    if (!decode || Date.now() >= decode.exp * 1000) {
      tokenManager.clear();
      return null;
    }
    
    return {
      userId: decode.userId,
      email: decode.email,
      firstName: decode.firstName,
      lastName: decode.lastName,
    };
  }

}

export const bookingService = new BookingService();
