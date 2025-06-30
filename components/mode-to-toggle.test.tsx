// @jest-environment jsdom

import * as React from "react";
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ModeToggle } from './mode-to-toggle';
import { ThemeProvider } from 'next-themes';

// Mock next-themes
const mockSetTheme = jest.fn();
jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: mockSetTheme,
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  Moon: () => <div data-testid="moon-icon" />,
  Sun: () => <div data-testid="sun-icon" />,
}));

// Mock UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: React.PropsWithChildren<any>) => (
    <button {...props}>{children}</button>
  ),
}));

jest.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: React.PropsWithChildren<{}>) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children, asChild }: React.PropsWithChildren<{ asChild?: boolean }>) => <div>{children}</div>,
  DropdownMenuContent: ({ children, align }: React.PropsWithChildren<{ align?: string }>) => <div data-testid="dropdown-content">{children}</div>,
  DropdownMenuItem: ({ children, onClick }: React.PropsWithChildren<{ onClick?: () => void }>) => (
    <div onClick={onClick} role="menuitem">{children}</div>
  ),
}));

describe('ModeToggle Component', () => {
  test('renders the theme toggle button', () => {
    render(<ModeToggle />);
    
    // Check if button exists with accessible name
    const button = screen.getByRole('button', { name: /toggle theme/i });
    expect(button).toBeInTheDocument();
    
    // Check if icons are rendered
    expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
  });
  
  test('shows dropdown menu when clicked', () => {
    render(<ModeToggle />);
    
    // Click the button to open dropdown
    const button = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(button);
    
    // Check if dropdown menu items appear
    expect(screen.getByText(/light/i)).toBeInTheDocument();
    expect(screen.getByText(/dark/i)).toBeInTheDocument();
    expect(screen.getByText(/system/i)).toBeInTheDocument();
  });
  
  test('renders theme options in dropdown menu', () => {
    render(<ModeToggle />);
    
    // Open dropdown menu
    const button = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(button);
    
    // Check if dropdown menu items are rendered correctly
    expect(screen.getByText(/light/i)).toBeInTheDocument();
    expect(screen.getByText(/dark/i)).toBeInTheDocument();
    expect(screen.getByText(/system/i)).toBeInTheDocument();
  });
  
  test('calls setTheme with correct theme when clicking menu items', () => {
    render(<ModeToggle />);
    
    // Open dropdown menu
    const button = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(button);
    
    // Click on light theme option
    fireEvent.click(screen.getByText(/light/i));
    expect(mockSetTheme).toHaveBeenCalledWith('light');
    
    // Reset mock counter
    mockSetTheme.mockClear();
    
    // Open dropdown menu again
    fireEvent.click(button);
    
    // Click on dark theme option
    fireEvent.click(screen.getByText(/dark/i));
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
    
    // Reset mock counter
    mockSetTheme.mockClear();
    
    // Open dropdown menu again
    fireEvent.click(button);
    
    // Click on system theme option
    fireEvent.click(screen.getByText(/system/i));
    expect(mockSetTheme).toHaveBeenCalledWith('system');
  });
  
  beforeEach(() => {
    // Clear all mocks before each test
    mockSetTheme.mockClear();
  });
});
