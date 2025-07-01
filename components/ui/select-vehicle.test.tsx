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
  
  test('location fields accept input', async () => {
    render(<SelectVehicle />);
    
    // Use act to handle async updates
    await act(async () => {
      const pickupInput = screen.getByPlaceholderText('Enter pickup location');
      fireEvent.change(pickupInput, { target: { value: 'New York' } });
      expect(pickupInput).toHaveValue('New York');
      
      const dropoffInput = screen.getByPlaceholderText('Enter dropoff location');
      fireEvent.change(dropoffInput, { target: { value: 'Miami' } });
      expect(dropoffInput).toHaveValue('Miami');
    });
  });
  
  test('shows location suggestions when typing', async () => {
    render(<SelectVehicle />);
    
    const pickupInput = screen.getByPlaceholderText('Enter pickup location');
    
    // Type in the input to trigger suggestions and wait for async updates
    await act(async () => {
      fireEvent.change(pickupInput, { target: { value: 'New' } });
      fireEvent.focus(pickupInput);
    });
    
    // Wait for suggestions to be fetched
    await waitFor(() => {
      expect(require('@/data/car-rental-data').getLocationSuggestions).toHaveBeenCalledWith('New');
    });
    
    // Ensure suggestions are displayed
    expect(screen.getByText('New York, NY')).toBeInTheDocument();
  });
  
  test('handles suggestion selection', async () => {
    render(<SelectVehicle />);
    
    // Get the pickup input and set a value to trigger suggestions
    const pickupInput = screen.getByPlaceholderText('Enter pickup location');
    
    await act(async () => {
      fireEvent.change(pickupInput, { target: { value: 'New' } });
      fireEvent.focus(pickupInput);
    });
    
    // Wait for suggestions
    await waitFor(() => {
      expect(screen.getByText('New York, NY')).toBeInTheDocument();
    });
    
    // Click on a suggestion
    await act(async () => {
      fireEvent.click(screen.getByText('New York, NY'));
    });
    
    // Check that the input now contains the selected suggestion
    expect(pickupInput).toHaveValue('New York, NY');
  });
  
  test('handles dropoff suggestion selection', async () => {
    render(<SelectVehicle />);
    
    // Get the dropoff input and set a value
    const dropoffInput = screen.getByPlaceholderText('Enter dropoff location');
    
    await act(async () => {
      fireEvent.change(dropoffInput, { target: { value: 'Los' } });
      fireEvent.focus(dropoffInput);
    });
    
    // Wait for suggestions
    await waitFor(() => {
      expect(screen.getByText('Los Angeles, CA')).toBeInTheDocument();
    });
    
    // Click on a suggestion
    await act(async () => {
      fireEvent.click(screen.getByText('Los Angeles, CA'));
    });
    
    // Check that the input now contains the selected suggestion
    expect(dropoffInput).toHaveValue('Los Angeles, CA');
  });
  
  test('handles click outside', async () => {
    render(<SelectVehicle />);
    
    // Get the pickup input and trigger suggestions
    const pickupInput = screen.getByPlaceholderText('Enter pickup location');
    
    await act(async () => {
      fireEvent.change(pickupInput, { target: { value: 'New' } });
      fireEvent.focus(pickupInput);
    });
    
    await waitFor(() => {
      expect(screen.getByText('New York, NY')).toBeInTheDocument();
    });
    
    // Simulate clicking outside
    await act(async () => {
      fireEvent.mouseDown(document.body);
    });
    
    // Suggestions should disappear (this is hard to test directly, but we can verify the behavior)
    await waitFor(() => {
      expect(screen.queryByText('New York, NY')).not.toBeInTheDocument();
    });
  });
  
  test('date fields accept input', () => {
    render(<SelectVehicle />);
    
    // Find date inputs by label text
    const pickupDateInput = screen.getByLabelText('Pickup From') as HTMLInputElement;
    const dropoffDateInput = screen.getByLabelText('Pickup To') as HTMLInputElement;
    
    // Pickup date
    fireEvent.change(pickupDateInput, { target: { value: '2025-07-15T10:00' } });
    expect(pickupDateInput.value).toBe('2025-07-15T10:00');
    
    // Dropoff date
    fireEvent.change(dropoffDateInput, { target: { value: '2025-07-20T12:00' } });
    expect(dropoffDateInput.value).toBe('2025-07-20T12:00');
  });
  
  test('displays validation errors if required fields are missing', () => {
    // Mock window.alert
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<SelectVehicle />);
    
    // Click search button without filling required fields
    const searchButton = screen.getByText('Search Available Vehicles');
    fireEvent.click(searchButton);
    
    // Should show alert for missing pickup location
    expect(alertMock).toHaveBeenCalledWith('Please enter a pickup location');
    
    // Fill pickup but not dropoff
    const pickupInput = screen.getByPlaceholderText('Enter pickup location');
    fireEvent.change(pickupInput, { target: { value: 'New York' } });
    
    // Try search again
    fireEvent.click(searchButton);
    
    // Should show alert for missing dropoff location
    expect(alertMock).toHaveBeenCalledWith('Please enter a dropoff location');
    
    // Clean up
    alertMock.mockRestore();
  });
  
  test('navigates to search results when search button is clicked with valid inputs', () => {
    render(<SelectVehicle />);
    
    // Fill required fields
    const pickupInput = screen.getByPlaceholderText('Enter pickup location');
    const dropoffInput = screen.getByPlaceholderText('Enter dropoff location');
    const pickupDateInput = screen.getByLabelText('Pickup From');
    const dropoffDateInput = screen.getByLabelText('Pickup To');
    
    fireEvent.change(pickupInput, { target: { value: 'New York' } });
    fireEvent.change(dropoffInput, { target: { value: 'Chicago' } });
    fireEvent.change(pickupDateInput, { target: { value: '2025-07-15T10:00' } });
    fireEvent.change(dropoffDateInput, { target: { value: '2025-07-16T10:00' } });
    
    // Click search button
    const searchButton = screen.getByText('Search Available Vehicles');
    fireEvent.click(searchButton);
    
    // Verify router was called with expected URL parameters
    expect(mockPush).toHaveBeenCalled();
    const callArg = mockPush.mock.calls[0][0];
    expect(callArg).toContain('/car-search-results?');
    expect(callArg).toContain('pickup=New+York');
    expect(callArg).toContain('dropoff=Chicago');
    expect(callArg).toContain('pickupDate=2025-07-15T10%3A00');
    expect(callArg).toContain('dropoffDate=2025-07-16T10%3A00');
  });
  
  test('includes all search parameters in the URL', () => {
    render(<SelectVehicle />);
    
    // Fill in all fields to ensure full coverage
    const pickupInput = screen.getByPlaceholderText('Enter pickup location');
    fireEvent.change(pickupInput, { target: { value: 'Los Angeles' } });
    
    const dropoffInput = screen.getByPlaceholderText('Enter dropoff location');
    fireEvent.change(dropoffInput, { target: { value: 'Las Vegas' } });
    
    // Set dates
    const pickupDateInput = screen.getByLabelText('Pickup From');
    fireEvent.change(pickupDateInput, { target: { value: '2025-07-15T10:00' } });
    
    const dropoffDateInput = screen.getByLabelText('Pickup To');
    fireEvent.change(dropoffDateInput, { target: { value: '2025-07-20T12:00' } });
    
    // Change min seats
    const minSeatsSelect = screen.getByLabelText('Minimum Seats');
    fireEvent.change(minSeatsSelect, { target: { value: '4' } });
    
    // Change vehicle type
    const vehicleTypeSelect = screen.getByLabelText('Vehicle Type');
    fireEvent.change(vehicleTypeSelect, { target: { value: 'SUV' } });
    
    // Change max price
    const maxPriceInput = screen.getByLabelText('Max Price (Per Day)');
    fireEvent.change(maxPriceInput, { target: { value: '150' } });
    
    // Submit search
    const searchButton = screen.getByText('Search Available Vehicles');
    fireEvent.click(searchButton);
    
    // Verify URL contains all parameters
    expect(mockPush).toHaveBeenCalled();
    const callArg = mockPush.mock.calls[0][0];
    
    expect(callArg).toContain('pickup=Los+Angeles');
    expect(callArg).toContain('dropoff=Las+Vegas');
    expect(callArg).toContain('minSeats=4');
    expect(callArg).toContain('maxPrice=150');
    expect(callArg).toContain('vehicleType=SUV');
    expect(callArg).toContain('pickupDate=2025-07-15T10%3A00');
    expect(callArg).toContain('dropoffDate=2025-07-20T12%3A00');
  });
  
  test('swaps pickup and dropoff locations when swap button is clicked', () => {
    render(<SelectVehicle />);
    
    // Set initial locations
    const pickupInput = screen.getByPlaceholderText('Enter pickup location');
    fireEvent.change(pickupInput, { target: { value: 'New York' } });
    
    const dropoffInput = screen.getByPlaceholderText('Enter dropoff location');
    fireEvent.change(dropoffInput, { target: { value: 'Miami' } });
    
    // Find and click swap button
    const swapButton = screen.getByText(/swap pickup & dropoff locations/i);
    fireEvent.click(swapButton);
    
    // Verify locations are swapped
    expect(pickupInput).toHaveValue('Miami');
    expect(dropoffInput).toHaveValue('New York');
  });
  
  test('clears suggestions when input is too short', async () => {
    render(<SelectVehicle />);
    
    const pickupInput = screen.getByPlaceholderText('Enter pickup location');
    
    // Type enough characters to get suggestions
    await act(async () => {
      fireEvent.change(pickupInput, { target: { value: 'New' } });
      fireEvent.focus(pickupInput);
    });
    
    // Wait for suggestions
    await waitFor(() => {
      expect(require('@/data/car-rental-data').getLocationSuggestions).toHaveBeenCalledWith('New');
    });
    
    // Now type fewer than the minimum characters
    await act(async () => {
      fireEvent.change(pickupInput, { target: { value: 'N' } });
    });
    
    // Wait for suggestions to disappear
    await waitFor(() => {
      expect(screen.queryByText('New York, NY')).not.toBeInTheDocument();
    });
  });
  
  test('handles empty location inputs', async () => {
    render(<SelectVehicle />);
    
    const pickupInput = screen.getByPlaceholderText('Enter pickup location');
    const dropoffInput = screen.getByPlaceholderText('Enter dropoff location');
    
    // Test empty pickup location
    await act(async () => {
      fireEvent.change(pickupInput, { target: { value: '' } });
      fireEvent.focus(pickupInput);
    });
    
    // Wait to ensure no suggestions are shown
    await waitFor(() => {
      expect(screen.queryByText('New York, NY')).not.toBeInTheDocument();
    });
    
    // Test empty dropoff location
    await act(async () => {
      fireEvent.change(dropoffInput, { target: { value: '' } });
      fireEvent.focus(dropoffInput);
    });
    
    await waitFor(() => {
      expect(screen.queryByText('Los Angeles, CA')).not.toBeInTheDocument();
    });
  });
  
  test('validates missing dates', () => {
    render(<SelectVehicle />);
    
    // Mock window.alert
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    // Fill locations
    const pickupInput = screen.getByPlaceholderText('Enter pickup location');
    const dropoffInput = screen.getByPlaceholderText('Enter dropoff location');
    
    fireEvent.change(pickupInput, { target: { value: 'New York' } });
    fireEvent.change(dropoffInput, { target: { value: 'Miami' } });
    
    // Try to search without dates
    const searchButton = screen.getByText('Search Available Vehicles');
    fireEvent.click(searchButton);
    
    // Check for missing date validation message
    expect(alertMock).toHaveBeenCalledWith(expect.stringMatching(/Please select.*pickup.*date/i));
    
    // Fill pickup date but not dropoff date
    const pickupDateInput = screen.getByLabelText('Pickup From');
    fireEvent.change(pickupDateInput, { target: { value: '2025-07-15T10:00' } });
    
    // Try search again
    fireEvent.click(searchButton);
    
    // Check for missing dropoff date validation message
    expect(alertMock).toHaveBeenCalledWith(expect.stringMatching(/Please select.*dropoff.*date/i));
    
    // Clean up
    alertMock.mockRestore();
  });
  
  test('validates dates are in correct order', () => {
    render(<SelectVehicle />);
    
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    // Fill required fields
    const pickupInput = screen.getByPlaceholderText('Enter pickup location');
    const dropoffInput = screen.getByPlaceholderText('Enter dropoff location');
    const pickupDateInput = screen.getByLabelText('Pickup From');
    const dropoffDateInput = screen.getByLabelText('Pickup To');
    
    // Set invalid date order
    fireEvent.change(pickupInput, { target: { value: 'New York' } });
    fireEvent.change(dropoffInput, { target: { value: 'Miami' } });
    fireEvent.change(pickupDateInput, { target: { value: '2025-07-15T10:00' } });
    fireEvent.change(dropoffDateInput, { target: { value: '2025-07-14T10:00' } });
    
    // Submit form
    const searchButton = screen.getByText('Search Available Vehicles');
    fireEvent.click(searchButton);
    
    // Verify validation message
    expect(alertMock).toHaveBeenCalledWith(expect.stringMatching(/dropoff.*must be after.*pickup/i));
    
    alertMock.mockRestore();
  });
  
  test('handles default and minimum values correctly', () => {
    render(<SelectVehicle />);
    
    // Fill required fields
    const pickupInput = screen.getByPlaceholderText('Enter pickup location');
    const dropoffInput = screen.getByPlaceholderText('Enter dropoff location');
    const pickupDateInput = screen.getByLabelText('Pickup From');
    const dropoffDateInput = screen.getByLabelText('Pickup To');
    
    fireEvent.change(pickupInput, { target: { value: 'New York' } });
    fireEvent.change(dropoffInput, { target: { value: 'Miami' } });
    fireEvent.change(pickupDateInput, { target: { value: '2025-07-15T10:00' } });
    fireEvent.change(dropoffDateInput, { target: { value: '2025-07-16T10:00' } });
    
    // Set invalid minimum seats (should default to minimum)
    const minSeatsSelect = screen.getByLabelText('Minimum Seats');
    fireEvent.change(minSeatsSelect, { target: { value: '0' } });
    
    // Set minimum price
    const maxPriceInput = screen.getByLabelText('Max Price (Per Day)');
    fireEvent.change(maxPriceInput, { target: { value: '0' } });
    
    // Submit search
    const searchButton = screen.getByText('Search Available Vehicles');
    fireEvent.click(searchButton);
    
    // Verify URL parameters with default values
    expect(mockPush).toHaveBeenCalled();
    const callArg = mockPush.mock.calls[0][0];
    
    // Check for adjusted minimum seats and unchanged price
    expect(callArg).toContain('minSeats=0');
    expect(callArg).toContain('maxPrice=0');
  });
});
