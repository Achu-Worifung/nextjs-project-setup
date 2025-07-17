// @jest-environment jsdom

import * as React from "react";
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SelectVehicle } from './select-vehicle';
import { useRouter } from 'next/navigation';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

// Mock car rental data
jest.mock('@/data/car-rental-data', () => {
  const mockGetLocationSuggestions = jest.fn((query) => {
    const suggestions = [
      'New York, NY',
      'Los Angeles, CA',
      'Chicago, IL',
      'Miami, FL',
      'Las Vegas, NV'
    ];
    return Promise.resolve(
      suggestions.filter(location => 
        location.toLowerCase().includes(query.toLowerCase())
      )
    );
  });
  
  return {
    mockAvailableCars: [
      { id: 1, name: 'Toyota Camry', type: 'Sedan', seats: 5, price: 50 },
      { id: 2, name: 'Honda CR-V', type: 'SUV', seats: 5, price: 70 }
    ],
    getLocationSuggestions: mockGetLocationSuggestions,
    carTypes: ['All', 'Economy', 'Compact', 'Midsize', 'Standard', 'SUV', 'Luxury']
  };
});

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  MapPin: () => <div data-testid="map-pin-icon" />,
  Calendar: () => <div data-testid="calendar-icon" />
}));

// Mock UI components
jest.mock('@/components/ui/label', () => ({
  Label: ({ children, ...props }: React.PropsWithChildren<any>) => (
    <label {...props}>{children}</label>
  ),
}));

describe('SelectVehicle Component', () => {
  const mockPush = jest.fn();
  const mockGetLocationSuggestions = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush
    });
    
    // Reset and set up the mock for getLocationSuggestions
    const carRentalModule = require('@/data/car-rental-data');
    carRentalModule.getLocationSuggestions.mockClear();
  });

  test('renders the vehicle search form with animation styles', () => {
    const { container } = render(<SelectVehicle />);
    
    // Check if the heading and subtitle are rendered
    expect(screen.getByText('Book Your Ride')).toBeInTheDocument();
    expect(screen.getByText('Select your pickup and dropoff details')).toBeInTheDocument();
    
    // Check for form fields
    expect(screen.getByPlaceholderText('Enter pickup location')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter dropoff location')).toBeInTheDocument();
    
    // Check for search button
    expect(screen.getByText('Search Available Vehicles')).toBeInTheDocument();
    
    // Check for animation style tag to cover line 14
    const styleTag = container.querySelector('style');
    expect(styleTag).toBeInTheDocument();
    expect(styleTag?.innerHTML).toContain('@keyframes fadeIn');
    expect(styleTag?.innerHTML).toContain('animation: fadeIn');
  });
  
  test('animation styles include correct keyframes', () => {
    const { container } = render(<SelectVehicle />);
    
    const styleTag = container.querySelector('style');
    expect(styleTag).toBeInTheDocument();
    expect(styleTag?.innerHTML).toContain('from { opacity: 0; transform: translateY(10px); }');
    expect(styleTag?.innerHTML).toContain('to { opacity: 1; transform: translateY(0); }');
  });
});


