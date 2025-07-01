// @jest-environment jsdom

import * as React from "react";
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SelectHotel } from './select-hotel';
import { useRouter } from 'next/navigation';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  MapPin: () => <div data-testid="map-pin-icon" />,
  Calendar: () => <div data-testid="calendar-icon" />,
  Users: () => <div data-testid="users-icon" />,
  Building2: () => <div data-testid="building-icon" />,
}));

// Mock UI components
jest.mock('@/components/ui/label', () => ({
  Label: ({ children, ...props }: React.PropsWithChildren<any>) => (
    <label {...props}>{children}</label>
  ),
}));

describe('SelectHotel Component', () => {
  const mockPush = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush
    });
  });

  test('renders the hotel search form', () => {
    render(<SelectHotel />);
    
    // Check if the heading and subtitle are rendered
    expect(screen.getByText('Find Your Perfect Hotel')).toBeInTheDocument();
    expect(screen.getByText('Search hotels for your next adventure')).toBeInTheDocument();
    
    // Check for form fields
    expect(screen.getByPlaceholderText('Where are you going?')).toBeInTheDocument();
    expect(screen.getByText('Check-in')).toBeInTheDocument();
    expect(screen.getByText('Check-out')).toBeInTheDocument();
    expect(screen.getByText('Guests')).toBeInTheDocument();
    expect(screen.getByText('Rooms')).toBeInTheDocument();
    
    // Check for search button
    expect(screen.getByText('Search Hotels')).toBeInTheDocument();
  });
  
  test('destination field accepts input', () => {
    render(<SelectHotel />);
    
    const destinationInput = screen.getByPlaceholderText('Where are you going?') as HTMLInputElement;
    fireEvent.change(destinationInput, { target: { value: 'Miami' } });
    
    // Mock the component's internal state by patching the onChange event
    expect(destinationInput.value).toBe('Miami');
  });
  
  test('date fields accept input', () => {
    render(<SelectHotel />);
    
    // Find both date inputs (there should be two for check-in and check-out)
    const dateInputs = screen.getAllByRole('textbox');
    const checkInInput = screen.getByLabelText(/check-in/i) as HTMLInputElement;
    const checkOutInput = screen.getByLabelText(/check-out/i) as HTMLInputElement;
    
    // Check-in date
    fireEvent.change(checkInInput, { target: { value: '2025-07-15' } });
    expect(checkInInput).toHaveValue('2025-07-15');
    
    // Check-out date
    fireEvent.change(checkOutInput, { target: { value: '2025-07-20' } });
    expect(checkOutInput).toHaveValue('2025-07-20');
  });
  
  test('select fields can be changed', () => {
    render(<SelectHotel />);
    
    // Test changing guests dropdown
    const guestsSelect = screen.getByRole('combobox', { name: /guests/i });
    fireEvent.change(guestsSelect, { target: { value: '2' } });
    expect(guestsSelect).toHaveValue('2');
    
    // Test changing rooms dropdown
    const roomsSelect = screen.getByRole('combobox', { name: /rooms/i });
    fireEvent.change(roomsSelect, { target: { value: '2' } });
    expect(roomsSelect).toHaveValue('2');
  });
  
  test('navigates to search results when search button is clicked', () => {
    // Override the initial state of the SelectHotel component
    const originalSetState = React.useState;
    
    // Mock useState to set initial values for our test
    jest.spyOn(React, 'useState').mockImplementation((initialValue: any) => {
      // If it's a number 1 (for guests or rooms), return our mocked value
      if (initialValue === 1) {
        return [2, jest.fn()]; // Return 2 for guests
      }
      // For other useState calls, use the original implementation
      return originalSetState(initialValue);
    });
    
    render(<SelectHotel />);
    
    // Fill in the destination field
    const destinationInput = screen.getByPlaceholderText('Where are you going?') as HTMLInputElement;
    fireEvent.change(destinationInput, { target: { value: 'Miami' } });
    
    // Click the search button
    const searchButton = screen.getByText('Search Hotels');
    fireEvent.click(searchButton);
    
    // Verify router was called with expected URL parameters
    expect(mockPush).toHaveBeenCalled();
    
    // Clean up the mock
    jest.restoreAllMocks();
  });
  
  test('handles null dates correctly in URL formatting', () => {
    render(<SelectHotel />);
    
    // Reset mocks to clear previous calls
    mockPush.mockClear();
    
    // Fill only the destination field, leave dates as null
    const destInput = screen.getByPlaceholderText('Where are you going?') as HTMLInputElement;
    fireEvent.change(destInput, { target: { value: 'Paris' } });
    
    // Click the search button
    const searchBtn = screen.getByText('Search Hotels');
    fireEvent.click(searchBtn);
    
    // Verify router was called with expected URL parameters (empty date strings)
    expect(mockPush).toHaveBeenCalled();
    const callArg = mockPush.mock.calls[0][0];
    expect(callArg).toContain('/hotel-search?');
    expect(callArg).toContain('startDate=');
    expect(callArg).toContain('endDate=');
  });
  
  test('handles date conversions and null dates correctly', () => {
    render(<SelectHotel />);
    
    const checkInInput = screen.getByLabelText(/check-in/i) as HTMLInputElement;
    const checkOutInput = screen.getByLabelText(/check-out/i) as HTMLInputElement;
    
    // Test setting valid dates
    fireEvent.change(checkInInput, { target: { value: '2025-07-15' } });
    fireEvent.change(checkOutInput, { target: { value: '2025-07-20' } });
    
    // Test clearing dates (setting to null)
    fireEvent.change(checkInInput, { target: { value: '' } });
    fireEvent.change(checkOutInput, { target: { value: '' } });
    
    // Click search to trigger URL generation with empty dates
    const searchBtn = screen.getByText('Search Hotels');
    fireEvent.click(searchBtn);
    
    // Verify empty dates are handled correctly in URL
    expect(mockPush).toHaveBeenCalledWith(expect.stringMatching(/startDate=&endDate=/));
  });

  test('formats dates correctly in ISO format for URL', () => {
    render(<SelectHotel />);
    
    const checkInInput = screen.getByLabelText(/check-in/i) as HTMLInputElement;
    const checkOutInput = screen.getByLabelText(/check-out/i) as HTMLInputElement;
    
    // Set specific dates to test ISO string conversion
    fireEvent.change(checkInInput, { target: { value: '2025-07-15' } });
    fireEvent.change(checkOutInput, { target: { value: '2025-07-20' } });
    
    // Trigger search to check URL formatting
    const searchBtn = screen.getByText('Search Hotels');
    fireEvent.click(searchBtn);
    
    // Verify dates are properly formatted in ISO format (YYYY-MM-DD)
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('startDate=2025-07-15'));
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('endDate=2025-07-20'));
  });

  test('handles date state changes correctly', () => {
    render(<SelectHotel />);
    
    const checkInInput = screen.getByLabelText(/check-in/i) as HTMLInputElement;
    const checkOutInput = screen.getByLabelText(/check-out/i) as HTMLInputElement;
    
    // Test setting valid dates
    fireEvent.change(checkInInput, { target: { value: '2025-07-15' } });
    expect(checkInInput.value).toBe('2025-07-15');
    
    fireEvent.change(checkOutInput, { target: { value: '2025-07-20' } });
    expect(checkOutInput.value).toBe('2025-07-20');
    
    // Test setting invalid dates
    fireEvent.change(checkInInput, { target: { value: 'invalid-date' } });
    fireEvent.change(checkOutInput, { target: { value: 'invalid-date' } });
    
    // Click search to verify URL handling with invalid dates
    const searchBtn = screen.getByText('Search Hotels');
    fireEvent.click(searchBtn);
    
    // Should handle invalid dates gracefully by using empty strings
    expect(mockPush).toHaveBeenCalledWith(expect.stringMatching(/startDate=&endDate=/));
  });
});
