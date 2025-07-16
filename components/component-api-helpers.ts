// Utility functions for components to interact with microservices
import { apiHelpers, API_ENDPOINTS } from '../lib/api-config';

// Example usage functions for components
export const componentApiHelpers = {
  // Flight-related functions
  async searchFlights(searchParams: {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    adults?: number;
    children?: number;
    cabinClass?: string;
  }) {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
      
      return await apiHelpers.get(`${API_ENDPOINTS.FLIGHT_SEARCH}?${queryParams}`);
    } catch (error) {
      console.error('Flight search failed:', error);
      throw error;
    }
  },

  async createFlightBooking(bookingData: any) {
    return await apiHelpers.post(API_ENDPOINTS.FLIGHT_BOOKINGS, bookingData);
  },

  // Hotel-related functions
  async searchHotels(searchParams: {
    location: string;
    checkIn: string;
    checkOut: string;
    adults?: number;
    rooms?: number;
  }) {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
      
      return await apiHelpers.get(`${API_ENDPOINTS.HOTELS}?${queryParams}`);
    } catch (error) {
      console.error('Hotel search failed:', error);
      throw error;
    }
  },

  async createHotelBooking(bookingData: any) {
    return await apiHelpers.post(API_ENDPOINTS.HOTEL_BOOKINGS, bookingData);
  },

  // Car-related functions
  async searchCars(searchParams: {
    location: string;
    pickupDate: string;
    dropoffDate: string;
    carType?: string;
  }) {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
      
      return await apiHelpers.get(`${API_ENDPOINTS.CAR_AVAILABILITY}?${queryParams}`);
    } catch (error) {
      console.error('Car search failed:', error);
      throw error;
    }
  },

  async createCarBooking(bookingData: any) {
    return await apiHelpers.post(API_ENDPOINTS.CAR_BOOKINGS, bookingData);
  },

  // Trip-related functions
  async getUserTrips() {
    return await apiHelpers.get(API_ENDPOINTS.TRIPS);
  },

  async createTrip(tripData: any) {
    return await apiHelpers.post(API_ENDPOINTS.TRIPS, tripData);
  },

  async planTrip(planningData: any) {
    return await apiHelpers.post(API_ENDPOINTS.TRIP_PLANNING, planningData);
  },

  // User-related functions
  async getUserProfile(userId: string) {
    return await apiHelpers.get(`${API_ENDPOINTS.USERS}/${userId}`);
  },

  async updateUserProfile(userId: string, userData: any) {
    return await apiHelpers.put(`${API_ENDPOINTS.USERS}/${userId}`, userData);
  },

  async loginUser(credentials: { email: string; password: string }) {
    return await apiHelpers.post(API_ENDPOINTS.USER_LOGIN, credentials);
  },

  async registerUser(userData: any) {
    return await apiHelpers.post(API_ENDPOINTS.USER_REGISTER, userData);
  }
};

// Example usage in a component:
/*
import { componentApiHelpers } from './component-api-helpers';

// In your component
const searchForFlights = async () => {
  try {
    const results = await componentApiHelpers.searchFlights({
      origin: 'NYC',
      destination: 'LAX',
      departureDate: '2024-01-15',
      adults: 1
    });
    console.log('Flight results:', results);
  } catch (error) {
    console.error('Error searching flights:', error);
  }
};
*/
