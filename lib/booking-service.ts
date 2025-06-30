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
}

export interface BookingResponse {
  success: boolean;
  message?: string;
  booking?: FlightBooking;
  error?: string;
}

export interface BookingsListResponse {
  success: boolean;
  bookings?: FlightBooking[];
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

  async getUserBookings(): Promise<BookingsListResponse> {
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

  async cancelBooking(bookingId: string): Promise<BookingResponse> {
    try {
      const headers = this.getAuthHeaders();
      
      const response = await fetch(`/api/bookings/flight/${bookingId}`, {
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
