// Mock location data for car rental location autocomplete
export const mockLocations = [
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
  "Phoenix, AZ",
  "Philadelphia, PA",
  "San Antonio, TX",
  "San Diego, CA",
  "Dallas, TX",
  "San Jose, CA",
  "Austin, TX",
  "Jacksonville, FL",
  "San Francisco, CA",
  "Columbus, OH",
  "Indianapolis, IN",
];

// Mock API function to get location suggestions
export const getLocationSuggestions = (query: string): Promise<string[]> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      const filteredLocations = query
        ? mockLocations.filter((location) =>
            location.toLowerCase().includes(query.toLowerCase())
          )
        : [];
      resolve(filteredLocations);
    }, 300);
  });
};

// Interface for car data structure
export interface CarData {
  id: number;
  name: string;
  make: string;
  model: string;
  year: number;
  imageUrl: string;
  seats: number;
  type: string;
  pricePerDay: number;
  features: string;
  transmission: string;
  fuelType: string;
  rating: number;
}

// Fetch car data from Car Service microservice
export async function fetchAvailableCars(): Promise<CarData[]> {
  try {
    const response = await fetch('/api/test-services');
    if (!response.ok) throw new Error('Failed to fetch car service data');
    const data = await response.json();
    // carServiceResults should be an array of car objects
    if (data.carServiceResults && Array.isArray(data.carServiceResults)) {
      // Map backend car fields to frontend CarData interface
      return data.carServiceResults.map((car: any) => ({
        id: car.id,
        name: `${car.make} ${car.model}`,
        make: car.make,
        model: car.model,
        year: car.year,
        imageUrl: car.imageUrl || '',
        seats: car.seats !== undefined ? car.seats : car.seat,
        type: car.type,
        pricePerDay: car.pricePerDay !== undefined ? car.pricePerDay : car.price_per_day,
        features: car.features !== undefined ? car.features : car.feature,
        transmission: car.transmission,
        fuelType: car.fuelType !== undefined ? car.fuelType : car.fuel_type,
        rating: car.rating,
      }));
    }
    // If carServiceResults is an object with error, throw
    if (data.carServiceResults && data.carServiceResults.error) {
      throw new Error(data.carServiceResults.error);
    }
    // Fallback: return empty array
    return [];
  } catch (err) {
    console.error('Error fetching cars from Car Service:', err);
    return [];
  }
}

// Car types for filtering
export const carTypes = [
  "All",
  "Sports",
  "Luxury",
  "Sedan",
  "SUV",
  "Truck",
  "Economy",
  "Van",
  "Hybrid",
  "Electric",
  "Coupe",
  "Minivan"
];
