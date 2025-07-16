// Configuration for microservices endpoints
export const MICROSERVICES_CONFIG = {
  FLIGHT_SERVICE: 'http://localhost:8000',
  CAR_BOOKING_SERVICE: 'http://localhost:8001', 
  HOTEL_SERVICE: 'http://localhost:8002',
  USER_SERVICE: 'http://localhost:8004',
  FLIGHT_BOOKING_SERVICE: 'http://localhost:8006',
  CAR_SERVICE: 'http://localhost:8010',
  TRIP_SERVICE: 'http://localhost:8012'
};

// Service API endpoints
export const API_ENDPOINTS = {
  // Flight Service
  FLIGHTS: `${MICROSERVICES_CONFIG.FLIGHT_SERVICE}/flights`,
  FLIGHT_SEARCH: `${MICROSERVICES_CONFIG.FLIGHT_SERVICE}/search`,
  
  // Car Booking Service
  CAR_BOOKINGS: `${MICROSERVICES_CONFIG.CAR_BOOKING_SERVICE}/bookings`,
  CAR_BOOKING_STATUS: `${MICROSERVICES_CONFIG.CAR_BOOKING_SERVICE}/bookings/status`,
  
  // Hotel Service  
  HOTELS: `${MICROSERVICES_CONFIG.HOTEL_SERVICE}/hotels`,
  HOTEL_BOOKINGS: `${MICROSERVICES_CONFIG.HOTEL_SERVICE}/bookings`,
  
  // User Service
  USERS: `${MICROSERVICES_CONFIG.USER_SERVICE}/users`,
  USER_LOGIN: `${MICROSERVICES_CONFIG.USER_SERVICE}/login`,
  USER_REGISTER: `${MICROSERVICES_CONFIG.USER_SERVICE}/register`,
  
  // Flight Booking Service
  FLIGHT_BOOKINGS: `${MICROSERVICES_CONFIG.FLIGHT_BOOKING_SERVICE}/bookings`,
  
  // Car Service
  CARS: `${MICROSERVICES_CONFIG.CAR_SERVICE}/cars`,
  CAR_AVAILABILITY: `${MICROSERVICES_CONFIG.CAR_SERVICE}/availability`,
  
  // Trip Service
  TRIPS: `${MICROSERVICES_CONFIG.TRIP_SERVICE}/trips`,
  TRIP_PLANNING: `${MICROSERVICES_CONFIG.TRIP_SERVICE}/plan`
};

// Helper function to test service connectivity
export async function testServiceConnection(serviceName: string, baseUrl: string) {
  try {
    const response = await fetch(`${baseUrl}/docs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-ID': 'nextjs-client',
      },
    });

    return {
      service: serviceName,
      url: baseUrl,
      status: response.ok ? 'connected' : 'error',
      httpStatus: response.status,
      message: response.ok ? 'Service is running' : `HTTP ${response.status}`
    };
  } catch (error) {
    return {
      service: serviceName,
      url: baseUrl,
      status: 'error',
      httpStatus: null,
      message: error instanceof Error ? error.message : 'Connection failed'
    };
  }
}

// Server-side test function (no CORS issues)
export async function testServiceConnectionServer(serviceName: string, baseUrl: string) {
  try {
    // Try multiple endpoints to test connectivity
    const endpoints = ['/docs', '/health', '/status', '/'];
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${baseUrl}${endpoint}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Client-ID': 'nextjs-client',
          },
        });

        if (response.ok) {
          return {
            service: serviceName,
            url: baseUrl,
            status: 'connected' as const,
            httpStatus: response.status,
            message: `Service is running (${endpoint})`,
            endpoint
          };
        }
      } catch (error) {
        continue; // Try next endpoint
      }
    }
    
    // If no endpoint worked, try basic connection
    const response = await fetch(baseUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-ID': 'nextjs-client',
      },
    });

    return {
      service: serviceName,
      url: baseUrl,
      status: response.ok ? 'connected' : 'error' as const,
      httpStatus: response.status,
      message: response.ok ? 'Service is running' : `HTTP ${response.status}`
    };
  } catch (error) {
    return {
      service: serviceName,
      url: baseUrl,
      status: 'error' as const,
      httpStatus: null,
      message: error instanceof Error ? error.message : 'Connection failed'
    };
  }
}

// Test all services
export async function testAllServices() {
  const services = [
    { name: 'Flight Service', url: MICROSERVICES_CONFIG.FLIGHT_SERVICE },
    { name: 'Car Booking Service', url: MICROSERVICES_CONFIG.CAR_BOOKING_SERVICE },
    { name: 'Hotel Service', url: MICROSERVICES_CONFIG.HOTEL_SERVICE },
    { name: 'User Service', url: MICROSERVICES_CONFIG.USER_SERVICE },
    { name: 'Flight Booking Service', url: MICROSERVICES_CONFIG.FLIGHT_BOOKING_SERVICE },
    { name: 'Car Service', url: MICROSERVICES_CONFIG.CAR_SERVICE },
    { name: 'Trip Service', url: MICROSERVICES_CONFIG.TRIP_SERVICE },
  ];

  console.log('🔍 Testing microservices connectivity...\n');
  
  const results = [];
  
  for (const service of services) {
    const result = await testServiceConnection(service.name, service.url);
    results.push(result);
    
    const statusIcon = result.status === 'connected' ? '✅' : '❌';
    console.log(`${statusIcon} ${result.service}: ${result.message}`);
  }
  
  console.log('\n📊 Test Summary:');
  const connected = results.filter(r => r.status === 'connected').length;
  const total = results.length;
  console.log(`${connected}/${total} services are running`);
  
  return results;
}

// Example usage functions
export const apiHelpers = {
  // GET request helper
  async get(endpoint: string) {
    try {
      const response = await fetch(endpoint, {
        headers: {
          'Content-Type': 'application/json',
          'X-Client-ID': 'nextjs-client',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`GET ${endpoint} failed:`, error);
      throw error;
    }
  },

  // POST request helper
  async post(endpoint: string, data: any) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-ID': 'nextjs-client',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`POST ${endpoint} failed:`, error);
      throw error;
    }
  },

  // PUT request helper
  async put(endpoint: string, data: any) {
    try {
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-ID': 'nextjs-client',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`PUT ${endpoint} failed:`, error);
      throw error;
    }
  },

  // DELETE request helper
  async delete(endpoint: string) {
    try {
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-ID': 'nextjs-client',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`DELETE ${endpoint} failed:`, error);
      throw error;
    }
  }
};

// Example API calls
export const exampleApiCalls = {
  // Get all flights
  async getFlights() {
    return await apiHelpers.get(API_ENDPOINTS.FLIGHTS);
  },

  // Get all hotels
  async getHotels() {
    return await apiHelpers.get(API_ENDPOINTS.HOTELS);
  },

  // Get all cars
  async getCars() {
    return await apiHelpers.get(API_ENDPOINTS.CARS);
  },

  // User login
  async login(credentials: { email: string; password: string }) {
    return await apiHelpers.post(API_ENDPOINTS.USER_LOGIN, credentials);
  },

  // Create booking
  async createCarBooking(bookingData: any) {
    return await apiHelpers.post(API_ENDPOINTS.CAR_BOOKINGS, bookingData);
  },

  // Get user trips
  async getTrips() {
    return await apiHelpers.get(API_ENDPOINTS.TRIPS);
  }
};
