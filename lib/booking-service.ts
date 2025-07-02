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

  async bookFlight(bookingData: FlightBookingRequest): Promise<BookingResponse> {
    try {
      const headers = this.getAuthHeaders();
      
      const response = await fetch('/api/bookings/flight', {
        method: 'POST',
        headers,
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Booking failed');
      }

      return data;
    } catch (error) {
      console.error('Flight booking error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
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

  async cancelBooking(bookingId: string, bookingType: string): Promise<BookingResponse> {
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
        method: 'DELETE',
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Cancellation failed');
      }

      return data;
    } catch (error) {
      console.error('Booking cancellation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getUserBookings(){
    try 
    {
      const headers = this.getAuthHeaders();

      const response = await fetch(`/api/bookings`, {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      console.log('User bookings data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch user bookings');
      }

      return data;
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
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
