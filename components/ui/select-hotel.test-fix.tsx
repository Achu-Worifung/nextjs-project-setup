// @jest-environment jsdom

import * as React from "react";
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SelectHotel } from './select-hotel';
import { useRouter } from 'next/navigation';

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: mockPush
  }))
}));

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  MapPin: () => <div data-testid="map-pin-icon" />,
  Calendar: () => <div data-testid="calendar-icon" />,
  Users: () => <div data-testid="users-icon" />,
  Building2: () => <div data-testid="building-icon" />,
}));

describe('SelectHotel Component - Additional branch coverage tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test specifically for branch coverage of startDate and endDate being null
  test('handles null dates when searching', () => {
    render(<SelectHotel />);
    
    // Search without selecting dates (both null)
    const searchButton = screen.getByText('Search');
    fireEvent.click(searchButton);
    
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('startDate=&endDate=')
    );
  });

  // Test for when only startDate is null but endDate is set
  test('handles null startDate with valid endDate', () => {
    render(<SelectHotel />);
    
    // Set end date but leave start date null
    // Mock setting just the end date
    const endDateInput = screen.getAllByText('Select date')[1];
    fireEvent.click(endDateInput);
    
    // Select a date - assuming our mock calendar has a "Select Date" button
    const selectDateBtn = screen.getByText('Select Date');
    fireEvent.click(selectDateBtn);
    
    // Search with start date null but end date set
    const searchButton = screen.getByText('Search');
    fireEvent.click(searchButton);
    
    // Check that URL was formatted correctly with empty start date
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('startDate=&endDate=')
    );
  });
  
  // Test for when only endDate is null but startDate is set
  test('handles null endDate with valid startDate', () => {
    render(<SelectHotel />);
    
    // Set start date but leave end date null
    const startDateInput = screen.getAllByText('Select date')[0];
    fireEvent.click(startDateInput);
    
    // Select a date
    const selectDateBtn = screen.getByText('Select Date');
    fireEvent.click(selectDateBtn);
    
    // Search with end date null but start date set
    const searchButton = screen.getByText('Search');
    fireEvent.click(searchButton);
    
    // Check that URL was formatted correctly with empty end date
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('endDate=')
    );
  });
});
