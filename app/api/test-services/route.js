// Simple test-services API route for Next.js
// Microservices config
const MICROSERVICES_CONFIG = {
  FLIGHT_SERVICE: 'http://localhost:8000',
  CAR_BOOKING_SERVICE: 'http://localhost:8001',
  HOTEL_SERVICE: 'http://localhost:8002',
  USER_SERVICE: 'http://localhost:8004',
  FLIGHT_BOOKING_SERVICE: 'http://localhost:8006',
  CAR_SERVICE: 'http://localhost:8010',
  TRIP_SERVICE: 'http://localhost:8012'
};

// Helper function to test service connectivity
async function testServiceConnection(serviceName, baseUrl) {
  try {
    // Try /health first, fallback to /docs if /health fails
    let response = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-ID': 'nextjs-client',
      },
    });
    if (!response.ok) {
      // Try /docs if /health is not available
      response = await fetch(`${baseUrl}/docs`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-ID': 'nextjs-client',
        },
      });
    }
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
      message: error.message || 'Connection failed'
    };
  }
}

export async function GET(req) {
  const services = [
    { name: 'Flight Service', url: MICROSERVICES_CONFIG.FLIGHT_SERVICE },
    { name: 'Car Booking Service', url: MICROSERVICES_CONFIG.CAR_BOOKING_SERVICE },
    { name: 'Hotel Service', url: MICROSERVICES_CONFIG.HOTEL_SERVICE },
    { name: 'User Service', url: MICROSERVICES_CONFIG.USER_SERVICE },
    { name: 'Flight Booking Service', url: MICROSERVICES_CONFIG.FLIGHT_BOOKING_SERVICE },
    { name: 'Car Service', url: MICROSERVICES_CONFIG.CAR_SERVICE },
    { name: 'Trip Service', url: MICROSERVICES_CONFIG.TRIP_SERVICE },
  ];

  // Test all services in parallel
  const results = await Promise.all(
    services.map(s => testServiceConnection(s.name, s.url))
  );

  // If Car Service is connected, fetch available cars
  let carServiceResults = null;
  const carServiceStatus = results.find(r => r.service === 'Car Service' && r.status === 'connected');
  if (carServiceStatus) {
    try {
      const carRes = await fetch(`${MICROSERVICES_CONFIG.CAR_SERVICE}/cars`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-ID': 'nextjs-client',
        },
      });
      if (carRes.ok) {
        let cars = await carRes.json();
        // Ensure cars is always an array and each car has a numeric id
        if (Array.isArray(cars)) {
          const seenIds = new Set();
          carServiceResults = cars
            .map(car => {
              let id = car.id;
              if (id === undefined) id = car.carId;
              if (id === undefined) id = car._id;
              if (typeof id === 'string') id = parseInt(id, 10);
              if (id === null || id === undefined || isNaN(id)) return null;
              if (seenIds.has(id)) {
                console.warn('DEBUG: Duplicate car id found:', id);
                return null;
              }
              seenIds.add(id);
              return {
                ...car,
                id
              };
            })
            .filter(car => car !== null);
        } else {
          carServiceResults = [];
        }
      } else {
        carServiceResults = { error: `Car Service responded with HTTP ${carRes.status}` };
      }
    } catch (err) {
      carServiceResults = { error: err.message || 'Failed to fetch available cars' };
    }
  }

  const connected = results.filter(r => r.status === 'connected').length;
  const total = results.length;
  const summary = `${connected}/${total} services are running`;

  return new Response(
    JSON.stringify({ summary, results, carServiceResults }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}
