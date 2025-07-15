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

// Mock car data
export const mockAvailableCars: CarData[] = [
  {
    id: 1,
    name: "Toyota Corolla",
    make: "Toyota",
    model: "Corolla",
    year: 2023,
    imageUrl: "🚗",
    seats: 5,
    type: "Economy",
    pricePerDay: 35,
    features: "5 seats • Bluetooth • Backup camera • Fuel efficient",
    transmission: "Automatic",
    fuelType: "Gasoline",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Honda CR-V",
    make: "Honda",
    model: "CR-V",
    year: 2024,
    imageUrl: "🚙",
    seats: 5,
    type: "SUV",
    pricePerDay: 55,
    features: "5 seats • AWD • Navigation • Backup camera",
    transmission: "Automatic",
    fuelType: "Hybrid",
    rating: 4.7,
  },
  {
    id: 3,
    name: "Mercedes-Benz E-Class",
    make: "Mercedes-Benz",
    model: "E-Class",
    year: 2023,
    imageUrl: "🚗",
    seats: 5,
    type: "Luxury",
    pricePerDay: 95,
    features: "5 seats • Premium audio • Leather seats • Panoramic roof",
    transmission: "Automatic",
    fuelType: "Gasoline",
    rating: 4.9,
  },
  {
    id: 4,
    name: "Ford Transit",
    make: "Ford",
    model: "Transit",
    year: 2023,
    imageUrl: "🚐",
    seats: 12,
    type: "Van",
    pricePerDay: 75,
    features: "12 seats • Spacious cargo • Bluetooth • Backup camera",
    transmission: "Automatic",
    fuelType: "Diesel",
    rating: 4.5,
  },
  {
    id: 5,
    name: "Jeep Wrangler",
    make: "Jeep",
    model: "Wrangler",
    year: 2023,
    imageUrl: "🚙",
    seats: 5,
    type: "SUV",
    pricePerDay: 65,
    features: "5 seats • 4WD • Removable top • Off-road capability",
    transmission: "Automatic",
    fuelType: "Gasoline",
    rating: 4.6,
  },
  {
    id: 6,
    name: "Tesla Model 3",
    make: "Tesla",
    model: "Model 3",
    year: 2024,
    imageUrl: "🚗",
    seats: 5,
    type: "Electric",
    pricePerDay: 85,
    features: "5 seats • Autopilot • Zero emissions • Premium audio",
    transmission: "Electric",
    fuelType: "Electric",
    rating: 4.9,
  },
  {
    id: 7,
    name: "Chevrolet Corvette",
    make: "Chevrolet",
    model: "Corvette",
    year: 2023,
    imageUrl: "🏎️",
    seats: 2,
    type: "Sports",
    pricePerDay: 120,
    features: "2 seats • V8 engine • Performance tires • Premium audio",
    transmission: "Automatic",
    fuelType: "Gasoline",
    rating: 4.8,
  },
  {
    id: 8,
    name: "Toyota Sienna",
    make: "Toyota",
    model: "Sienna",
    year: 2024,
    imageUrl: "🚐",
    seats: 8,
    type: "Minivan",
    pricePerDay: 70,
    features: "8 seats • Power sliding doors • AWD • Entertainment system",
    transmission: "Automatic",
    fuelType: "Hybrid",
    rating: 4.7,
  },
];

// Car types for filtering
export const carTypes = [
  "All",
  "Economy",
  "SUV", 
  "Luxury",
  "Van",
  "Electric",
  "Sports",
  "Minivan"
];
