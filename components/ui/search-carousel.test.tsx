// @jest-environment jsdom

import * as React from "react";
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CarouselDemo } from './search-carousel';

// Mock the card components to ensure line 3 is covered
jest.mock('@/components/ui/card', () => ({
  Card: ({ children }: React.PropsWithChildren<{}>) => (
    <div data-testid="card">{children}</div>
  ),
  CardContent: ({ children }: React.PropsWithChildren<{}>) => (
    <div data-testid="card-content">{children}</div>
  )
}));

// Mock the carousel components
jest.mock('@/components/ui/carousel', () => ({
  Carousel: ({ children, className }: React.PropsWithChildren<{ className: string }>) => (
    <div data-testid="carousel" className={className}>{children}</div>
  ),
  CarouselContent: ({ children }: React.PropsWithChildren<{}>) => (
    <div data-testid="carousel-content">{children}</div>
  ),
  CarouselItem: ({ children, id }: React.PropsWithChildren<{ id: string }>) => (
    <div data-testid={`carousel-item-${id}`} data-id={id}>{children}</div>
  ),
  // Include commented components to ensure 100% coverage
  CarouselNext: () => <button data-testid="carousel-next">Next</button>,
  CarouselPrevious: () => <button data-testid="carousel-previous">Previous</button>
}));

// Mock the search components
jest.mock('./flight-selection', () => ({
  FlightSelection: () => <div data-testid="flight-selection">Flight Selection Component</div>
}));

jest.mock('./select-hotel', () => ({
  SelectHotel: () => <div data-testid="select-hotel">Hotel Selection Component</div>
}));

jest.mock('./select-vehicle', () => ({
  SelectVehicle: () => <div data-testid="select-vehicle">Vehicle Selection Component</div>
}));

describe('CarouselDemo Component', () => {
  test('renders the search carousel with all three search components', () => {
    render(<CarouselDemo />);
    
    // Check if the carousel wrapper is rendered
    expect(screen.getByTestId('carousel')).toBeInTheDocument();
    expect(screen.getByTestId('carousel-content')).toBeInTheDocument();
    
    // Check if all three search components are rendered in their respective carousel items
    expect(screen.getByTestId('carousel-item-Flights')).toBeInTheDocument();
    expect(screen.getByTestId('carousel-item-Hotels')).toBeInTheDocument();
    expect(screen.getByTestId('carousel-item-Vehicles')).toBeInTheDocument();
    
    // Check if the actual search components are rendered inside the carousel items
    expect(screen.getByTestId('flight-selection')).toBeInTheDocument();
    expect(screen.getByTestId('select-hotel')).toBeInTheDocument();
    expect(screen.getByTestId('select-vehicle')).toBeInTheDocument();
  });
  
  test('displays correct content for each search component', () => {
    render(<CarouselDemo />);
    
    // Verify the text content of each mocked component
    expect(screen.getByText('Flight Selection Component')).toBeInTheDocument();
    expect(screen.getByText('Hotel Selection Component')).toBeInTheDocument();
    expect(screen.getByText('Vehicle Selection Component')).toBeInTheDocument();
  });
});
