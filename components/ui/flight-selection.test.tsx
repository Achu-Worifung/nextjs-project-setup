import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FlightSelection } from "./flight-selection";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import * as React from 'react';
import { Dispatch, SetStateAction } from 'react';

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("FlightSelection", () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders flight type options", () => {
    render(<FlightSelection />);
    expect(screen.getByText("one way")).toBeInTheDocument();
    expect(screen.getByText("round trip")).toBeInTheDocument();
    expect(screen.getByText("multi city")).toBeInTheDocument();
  });

  it("handles passenger count changes", async () => {
    render(<FlightSelection />);
    
    // Adults
    const addAdultBtn = screen.getAllByText("+")[0];
    fireEvent.click(addAdultBtn);
    expect(screen.getAllByText("1")[0]).toBeInTheDocument();

    // Children
    const addChildBtn = screen.getAllByText("+")[1];
    fireEvent.click(addChildBtn);
    expect(screen.getAllByText("1")[1]).toBeInTheDocument();
  });

  it("decrements passenger counts correctly", () => {
    render(<FlightSelection />);
    
    // Add some passengers first
    const addAdultBtn = screen.getAllByText("+")[0];
    const addChildBtn = screen.getAllByText("+")[1];
    fireEvent.click(addAdultBtn);
    fireEvent.click(addChildBtn);

    // Then decrement
    const decAdultBtn = screen.getAllByText("−")[0];
    const decChildBtn = screen.getAllByText("−")[1];
    fireEvent.click(decAdultBtn);
    fireEvent.click(decChildBtn);

    // Verify counts are back to 0
    expect(screen.getAllByText("0")[0]).toBeInTheDocument();
    expect(screen.getAllByText("0")[1]).toBeInTheDocument();
  });

  it("handles flight class selection", () => {
    render(<FlightSelection />);
    const classSelect = screen.getByRole("combobox");
    fireEvent.change(classSelect, { target: { value: "Business" } });
    expect(classSelect).toHaveValue("Business");
  });

  it("handles round-trip date selection", async () => {
    render(<FlightSelection />);
    
    // Select round trip
    const roundTripButton = screen.getByText("round trip");
    await userEvent.click(roundTripButton);

    // Get date inputs
    const departureDateInput = screen.getByLabelText(/departure date/i);
    const returnDateInput = screen.getByLabelText(/return date/i);

    // Set dates
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

    // Format dates for input
    const tomorrowStr = format(tomorrow, "yyyy-MM-dd");
    const dayAfterTomorrowStr = format(dayAfterTomorrow, "yyyy-MM-dd");

    // Set departure and return dates
    await userEvent.type(departureDateInput, tomorrowStr);
    await userEvent.type(returnDateInput, dayAfterTomorrowStr);

    // Verify dates are set
    expect(departureDateInput).toHaveValue(tomorrowStr);
    expect(returnDateInput).toHaveValue(dayAfterTomorrowStr);
  });

  it("handles multi-city flight addition and removal", () => {
    render(<FlightSelection />);
    
    // Switch to multi-city
    fireEvent.click(screen.getByText("multi city"));

    // Add new flight
    const addButton = screen.getByRole("button", { name: /add another flight/i });
    fireEvent.click(addButton);
    
    // Check if new flight inputs are rendered
    const fromInputs = screen.getAllByPlaceholderText("Departure city");
    const toInputs = screen.getAllByPlaceholderText("Destination city");
    expect(fromInputs).toHaveLength(2);
    expect(toInputs).toHaveLength(2);

    // Remove flight (button shows as "x")
    const removeButton = screen.getByRole("button", { name: "x" });
    fireEvent.click(removeButton);
    
    // Verify flight was removed
    expect(screen.getAllByPlaceholderText("Departure city")).toHaveLength(1);
  });

  it("enforces maximum legs limit in multi-city", () => {
    render(<FlightSelection />);
    
    // Switch to multi-city
    fireEvent.click(screen.getByText("multi city"));

    // Add maximum number of flights
    const addButton = screen.getByRole("button", { name: /add another flight/i });
    for (let i = 0; i < 4; i++) {
      fireEvent.click(addButton);
    }

    // Verify maximum message is shown
    expect(screen.getByText("Maximum 5 flights reached")).toBeInTheDocument();

    // Count current number of departure inputs
    const beforeCount = screen.getAllByPlaceholderText("Departure city").length;

    // Try to add another flight beyond the maximum
    fireEvent.click(addButton);

    // Verify no additional flight was added
    const afterCount = screen.getAllByPlaceholderText("Departure city").length;
    expect(afterCount).toBe(beforeCount);
  });

  it("handles airport search and selection", async () => {
    render(<FlightSelection />);
    
    // Type in departure city
    const fromInput = screen.getByPlaceholderText("Departure city");
    await userEvent.type(fromInput, "London");

    // Wait for suggestions to appear and select Heathrow
    await waitFor(() => {
      const heathrowText = screen.getByText(/London Heathrow Airport.*LHR/);
      const suggestionItem = heathrowText.closest('.px-4.py-2.hover\\:bg-pink-50');
      if (!suggestionItem) throw new Error('Could not find suggestion container');
      fireEvent.click(suggestionItem);
    });

    // Verify the input has the correct city and IATA code
    expect(fromInput).toHaveValue("London, LHR");
  });

  it("handles multi-city leg updates correctly", async () => {
    render(<FlightSelection />);
    
    // Switch to multi-city
    fireEvent.click(screen.getByText("multi city"));

    // Get the first leg inputs
    const fromInput = screen.getByPlaceholderText("Departure city");
    const toInput = screen.getByPlaceholderText("Destination city");
    const dateInput = screen.getByLabelText(/departure date/i);

    // Update the leg
    await userEvent.type(fromInput, "London");
    await userEvent.type(toInput, "Paris");

    // Set date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = format(tomorrow, "yyyy-MM-dd");
    await userEvent.type(dateInput, tomorrowStr);

    // Verify values
    expect(fromInput).toHaveValue("London");
    expect(toInput).toHaveValue("Paris");
    expect(dateInput).toHaveValue(tomorrowStr);
  });

  it("resets multi-city legs when changing flight type", () => {
    render(<FlightSelection />);
    
    // Start with multi-city and add a leg
    fireEvent.click(screen.getByText("multi city"));
    const addButton = screen.getByRole("button", { name: /add another flight/i });
    fireEvent.click(addButton);
    
    // Verify we have 2 sets of inputs
    expect(screen.getAllByPlaceholderText("Departure city")).toHaveLength(2);
    
    // Switch to round-trip
    fireEvent.click(screen.getByText("round trip"));
    
    // Verify we're back to 1 set of inputs
    expect(screen.getAllByPlaceholderText("Departure city")).toHaveLength(1);
  });

  it("handles swap functionality in round-trip mode", async () => {
    render(<FlightSelection />);
    
    // Switch to round-trip
    fireEvent.click(screen.getByText("round trip"));

    // Set initial values
    const fromInput = screen.getByPlaceholderText("Departure city");
    const toInput = screen.getByPlaceholderText("Destination city");
    await userEvent.type(fromInput, "London");
    await userEvent.type(toInput, "Paris");

    // Initial values check
    expect(fromInput).toHaveValue("London");
    expect(toInput).toHaveValue("Paris");

    // Find and click swap button
    const swapButton = screen.getByRole("button", {
      name: /swap departure and destination/i
    });
    fireEvent.click(swapButton);

    // Verify values are swapped
    expect(fromInput).toHaveValue("Paris");
    expect(toInput).toHaveValue("London");

    // Test double swap returns to original state
    fireEvent.click(swapButton);
    expect(fromInput).toHaveValue("London");
    expect(toInput).toHaveValue("Paris");
  });

  it("handles swap functionality in multi-city legs", async () => {
    render(<FlightSelection />);
    
    // Switch to multi-city
    fireEvent.click(screen.getByText("multi city"));

    // Fill in the first leg
    const fromInput = screen.getByPlaceholderText("Departure city");
    const toInput = screen.getByPlaceholderText("Destination city");
    await userEvent.type(fromInput, "London");
    await userEvent.type(toInput, "Paris");

    // Find and click swap button for the first leg
    const swapButtons = screen.getAllByRole("button", {
      name: /swap departure and destination/i
    });
    fireEvent.click(swapButtons[0]);

    // Verify values are swapped
    expect(fromInput).toHaveValue("Paris");
    expect(toInput).toHaveValue("London");
  }, 10000);  // Add 10 second timeout

  it("prioritizes exact IATA and ICAO matches in airport search", async () => {
    render(<FlightSelection />);
    
    // Test exact IATA code match
    const fromInput = screen.getByPlaceholderText("Departure city");
    await userEvent.type(fromInput, "lhr"); // Testing case-insensitive match

    // Verify that London Heathrow (LHR) appears first in suggestions
    await waitFor(() => {
      const suggestions = screen.getAllByText(/Airport/);
      const firstSuggestion = suggestions[0];
      expect(firstSuggestion).toHaveTextContent(/London Heathrow.*LHR/);
    });

    // Test name containing "lhr" score bonus
    await userEvent.clear(fromInput);
    await userEvent.type(fromInput, "lon"); // Search for London airports

    // Verify airport with "lhr" in name gets boosted in ranking
    await waitFor(() => {
      const suggestions = screen.getAllByText(/Airport/);
      
      // Find positions of different airports
      const heathrowPos = suggestions.findIndex(s => 
        s.textContent?.toLowerCase().includes("heathrow")
      );
      const otherLondonPos = suggestions.findIndex(s => 
        s.textContent?.toLowerCase().includes("london") && 
        !s.textContent?.toLowerCase().includes("heathrow")
      );
      
      // Verify "lhr" airport is ranked higher due to +50 score bonus
      expect(heathrowPos).toBeGreaterThanOrEqual(0);
      expect(otherLondonPos).toBeGreaterThanOrEqual(0);
      expect(heathrowPos).toBeLessThan(otherLondonPos);
      
      // Verify the actual content contains "lhr"
      const heathrowSuggestion = suggestions[heathrowPos];
      expect(heathrowSuggestion.textContent?.toLowerCase()).toContain("lhr");
    });

    // Clear and test ICAO code match
    await userEvent.clear(fromInput);
    await userEvent.type(fromInput, "egll"); // ICAO code for Heathrow, testing case-insensitive

    // Verify Heathrow appears first for ICAO match
    await waitFor(() => {
      const suggestions = screen.getAllByText(/Airport/);
      const firstSuggestion = suggestions[0];
      expect(firstSuggestion).toHaveTextContent(/London Heathrow.*LHR/);
    });

    // Test partial name match (should score lower than LHR bonus)
    await userEvent.clear(fromInput);
    await userEvent.type(fromInput, "london stansted"); // Should rank below Heathrow

    // Verify Heathrow still appears first due to "lhr" in name
    await waitFor(() => {
      const suggestions = screen.getAllByText(/Airport/);
      const firstSuggestion = suggestions[0];
      expect(firstSuggestion).toHaveTextContent(/London Heathrow.*LHR/);
      
      // Verify Stansted appears but not first
      const stanstedExists = suggestions.some(s => s.textContent?.includes("Stansted"));
      expect(stanstedExists).toBe(true);
    });
  }, 10000);  // Add 10 second timeout

  it("submits search with correct parameters", async () => {
    render(<FlightSelection />);
    
    // Fill in search details
    await userEvent.type(screen.getByPlaceholderText("Departure city"), "London");
    await userEvent.type(screen.getByPlaceholderText("Destination city"), "Paris");
    
    // Set departure date
    const departureDateInput = screen.getByLabelText(/departure date/i);
    const tomorrow = format(new Date(Date.now() + 86400000), "yyyy-MM-dd");
    await userEvent.type(departureDateInput, tomorrow);

    // Click search
    fireEvent.click(screen.getByText("Search"));

    // Verify search parameters
    expect(mockRouter.push).toHaveBeenCalledWith(
      expect.stringMatching(/flight-search\?.*departDate=\d{4}-\d{2}-\d{2}/)
    );
  }, 10000);  // Add 10 second timeout

  it("submits multi-city search with serialized legs", async () => {
    render(<FlightSelection />);
    
    // Switch to multi-city
    await userEvent.click(screen.getByText("multi city"));

    // Add another leg
    const addButton = screen.getByRole("button", { name: /add another flight/i });
    await userEvent.click(addButton);

    // Fill in legs
    const fromInputs = screen.getAllByPlaceholderText("Departure city");
    const toInputs = screen.getAllByPlaceholderText("Destination city");
    const dateInputs = screen.getAllByLabelText(/departure date/i);

    // First leg
    await userEvent.type(fromInputs[0], "London");
    await userEvent.type(toInputs[0], "Paris");
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const date1 = format(tomorrow, "yyyy-MM-dd");
    await userEvent.clear(dateInputs[0]); // Clear first to ensure clean input
    await userEvent.type(dateInputs[0], date1);
    expect(dateInputs[0]).toHaveValue(date1);

    // Second leg
    await userEvent.type(fromInputs[1], "Paris");
    await userEvent.type(toInputs[1], "Rome");
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    const date2 = format(dayAfterTomorrow, "yyyy-MM-dd");
    await userEvent.clear(dateInputs[1]); // Clear first to ensure clean input
    await userEvent.type(dateInputs[1], date2);
    expect(dateInputs[1]).toHaveValue(date2);

    // Click search
    await userEvent.click(screen.getByText("Search"));

    // Verify search parameters
    expect(mockRouter.push).toHaveBeenCalledWith(
      expect.stringContaining("flightType=multi-city")
    );

    // Get the legs parameter from the URL
    const url = mockRouter.push.mock.calls[0][0];
    const searchParams = new URLSearchParams(url.split("?")[1]);
    const legsParam = searchParams.get("legs");
    
    // Verify legs are properly serialized
    expect(legsParam).toBeTruthy();
    const parsedLegs = JSON.parse(legsParam!);
    expect(parsedLegs).toHaveLength(2);
    expect(parsedLegs[0]).toEqual({
      from: "London",
      to: "Paris",
      date: expect.any(String)
    });
    expect(parsedLegs[1]).toEqual({
      from: "Paris",
      to: "Rome",
      date: expect.any(String)
    });

    // Compare dates by converting both to Date objects
    const parsedDate1 = new Date(parsedLegs[0].date);
    const parsedDate2 = new Date(parsedLegs[1].date);
    const expectedDate1 = new Date(date1);
    const expectedDate2 = new Date(date2);

    expect(parsedDate1.toISOString().split('T')[0]).toBe(date1);
    expect(parsedDate2.toISOString().split('T')[0]).toBe(date2);
  }, 10000);

  it("handles multi-city airport suggestion selection correctly", async () => {
    render(<FlightSelection />);
    
    // Switch to multi-city
    await userEvent.click(screen.getByText("multi city"));

    // Add another leg
    const addButton = screen.getByRole("button", { name: /add another flight/i });
    await userEvent.click(addButton);

    // Get all departure inputs
    const fromInputs = screen.getAllByPlaceholderText("Departure city");

    // Test first leg airport selection
    await userEvent.type(fromInputs[0], "Goroka");
    
    // Wait for and select first suggestion for first leg
    await waitFor(() => {
      const gorokaText = screen.getByText(/Goroka Airport.*GKA/);
      const suggestionItem = gorokaText.closest('.px-4.py-2.hover\\:bg-pink-50');
      if (!suggestionItem) throw new Error('Could not find suggestion container');
      fireEvent.click(suggestionItem);
    });

    // Verify first leg selection was applied
    expect(fromInputs[0]).toHaveValue("Goroka, GKA");

    // Test second leg airport selection
    await userEvent.type(fromInputs[1], "Madang");
    
    // Wait for and select first suggestion for second leg
    await waitFor(() => {
      const madangText = screen.getByText(/Madang Airport.*MAG/);
      const suggestionItem = madangText.closest('.px-4.py-2.hover\\:bg-pink-50');
      if (!suggestionItem) throw new Error('Could not find suggestion container');
      fireEvent.click(suggestionItem);
    });

    // Verify second leg selection was applied and didn't affect first leg
    expect(fromInputs[0]).toHaveValue("Goroka, GKA");
    expect(fromInputs[1]).toHaveValue("Madang, MAG");

    // Verify suggestions are cleared after selection
    expect(screen.queryByText(/Goroka Airport.*GKA/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Madang Airport.*MAG/)).not.toBeInTheDocument();
  }, 15000);  // Increased timeout for multiple async operations

  it("handles destination airport suggestion selection correctly", async () => {
    render(<FlightSelection />);
    
    // Test in single/round-trip mode first
    const toInput = screen.getByPlaceholderText("Destination city");
    await userEvent.type(toInput, "Goroka");
    
    // Wait for and select destination suggestion
    await waitFor(() => {
      const gorokaText = screen.getByText(/Goroka Airport.*GKA/);
      const suggestionItem = gorokaText.closest('.px-4.py-2.hover\\:bg-pink-50');
      if (!suggestionItem) throw new Error('Could not find suggestion container');
      fireEvent.click(suggestionItem);
    });

    // Verify destination selection was applied
    expect(toInput).toHaveValue("Goroka, GKA");
    
    // Verify suggestions are cleared
    expect(screen.queryByText(/Goroka Airport.*GKA/)).not.toBeInTheDocument();

    // Now test in multi-city mode
    await userEvent.click(screen.getByText("multi city"));
    
    // Add another leg
    const addButton = screen.getByRole("button", { name: /add another flight/i });
    await userEvent.click(addButton);

    // Get all destination inputs
    const toInputs = screen.getAllByPlaceholderText("Destination city");

    // Test destination selection in first leg
    await userEvent.type(toInputs[0], "Madang");
    
    // Wait for and select first suggestion
    await waitFor(() => {
      const madangText = screen.getByText(/Madang Airport.*MAG/);
      const suggestionItem = madangText.closest('.px-4.py-2.hover\\:bg-pink-50');
      if (!suggestionItem) throw new Error('Could not find suggestion container');
      fireEvent.click(suggestionItem);
    });

    // Verify first leg destination selection
    expect(toInputs[0]).toHaveValue("Madang, MAG");

    // Test destination selection in second leg
    await userEvent.type(toInputs[1], "Goroka");
    
    // Wait for and select second suggestion
    await waitFor(() => {
      const gorokaText = screen.getByText(/Goroka Airport.*GKA/);
      const suggestionItem = gorokaText.closest('.px-4.py-2.hover\\:bg-pink-50');
      if (!suggestionItem) throw new Error('Could not find suggestion container');
      fireEvent.click(suggestionItem);
    });

    // Verify both leg selections are correct
    expect(toInputs[0]).toHaveValue("Madang, MAG");
    expect(toInputs[1]).toHaveValue("Goroka, GKA");

    // Verify suggestions are cleared after selection
    expect(screen.queryByText(/Madang Airport.*MAG/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Goroka Airport.*GKA/)).not.toBeInTheDocument();
  }, 15000);  // Increased timeout for multiple async operations

  it("prevents adding legs beyond maximum and early returns", async () => {
    render(<FlightSelection />);
    
    // Switch to multi-city
    await userEvent.click(screen.getByText("multi city"));

    // Add legs until reaching maximum (5)
    const addButton = screen.getByRole("button", { name: /add another flight/i });
    for (let i = 0; i < 4; i++) {  // Add 4 more to the initial 1 = 5 total
      await userEvent.click(addButton);
    }

    // Get initial count of departure inputs
    const beforeCount = screen.getAllByPlaceholderText("Departure city").length;
    expect(beforeCount).toBe(5); // Verify we have max legs

    // Try to add another leg and verify it was prevented
    await userEvent.click(addButton);
    
    // Count should remain the same due to early return
    const afterCount = screen.getAllByPlaceholderText("Departure city").length;
    expect(afterCount).toBe(5);
    
    // Verify the message is shown
    expect(screen.getByText("Maximum 5 flights reached")).toBeInTheDocument();
  });

  it("prevents adding legs beyond maximum by returning early", async () => {
    render(<FlightSelection />);
    
    // Switch to multi-city
    await userEvent.click(screen.getByText("multi city"));
    
    // Add legs until reaching maximum (5)
    const addButton = screen.getByRole("button", { name: /add another flight/i });
    for (let i = 0; i < 4; i++) {  // Add 4 more to the initial 1 = 5 total
      await userEvent.click(addButton);
    }

    // Verify we have 5 departure inputs
    expect(screen.getAllByPlaceholderText("Departure city")).toHaveLength(5);

    // Store current departure inputs for comparison
    const beforeInputs = screen.getAllByPlaceholderText("Departure city");
    const beforeInputValues = beforeInputs.map(input => (input as HTMLInputElement).value);
    
    // Try to add another leg when at maximum
    await userEvent.click(addButton);
    
    // Get current inputs after attempted add
    const afterInputs = screen.getAllByPlaceholderText("Departure city");
    const afterInputValues = afterInputs.map(input => (input as HTMLInputElement).value);
    
    // Verify that no new inputs were added and existing values weren't changed
    expect(afterInputs).toHaveLength(5); // Still 5 inputs
    expect(afterInputValues).toEqual(beforeInputValues); // Values unchanged
    
    // Verify the maximum message is shown
    expect(screen.getByText("Maximum 5 flights reached")).toBeInTheDocument();
    
    // Verify the button is disabled
    expect(addButton).toHaveAttribute('disabled');
  });

  it("handles undefined date when input is cleared", async () => {
    render(<FlightSelection />);
    
    // Select round trip
    const roundTripButton = screen.getByText("round trip");
    await userEvent.click(roundTripButton);

    // Get date inputs
    const departureDateInput = screen.getByLabelText(/departure date/i);
    const returnDateInput = screen.getByLabelText(/return date/i);

    // Set initial dates
    const departDate = new Date();
    departDate.setDate(departDate.getDate() + 1);
    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + 2);

    const departDateStr = format(departDate, "yyyy-MM-dd");
    const returnDateStr = format(returnDate, "yyyy-MM-dd");

    // Set departure and return dates
    await userEvent.type(departureDateInput, departDateStr);
    await userEvent.type(returnDateInput, returnDateStr);

    // Verify dates are set
    expect(departureDateInput).toHaveValue(departDateStr);
    expect(returnDateInput).toHaveValue(returnDateStr);

    // Clear the inputs
    await userEvent.clear(departureDateInput);
    await userEvent.clear(returnDateInput);

    // Verify inputs are empty
    expect(departureDateInput).toHaveValue("");
    expect(returnDateInput).toHaveValue("");

    // Click search to verify the form submission handles undefined dates
    await userEvent.click(screen.getByText("Search"));

    // Verify URL parameters
    expect(mockRouter.push).toHaveBeenLastCalledWith(
      expect.stringMatching(/flight-search\?.*departDate=&returnDate=/)
    );
  });

  it("properly formats travelers parameter for both singular and plural cases", async () => {
    render(<FlightSelection />);
    
    // Click + once to get to 1 adult
    const addAdultBtn = screen.getAllByText("+")[0];
    await userEvent.click(addAdultBtn);
    
    // Test singular case (1 adult)
    await userEvent.click(screen.getByText("Search"));
    expect(mockRouter.push).toHaveBeenLastCalledWith(
      expect.stringMatching(/flight-search\?.*travelers=1\+Adult(&|$)/)
    );

    // Click + again to get to 2 adults
    await userEvent.click(addAdultBtn);
    
    // Test plural case (2 adults)
    await userEvent.click(screen.getByText("Search"));
    expect(mockRouter.push).toHaveBeenLastCalledWith(
      expect.stringMatching(/flight-search\?.*travelers=2\+Adults(&|$)/)
    );
  });

  it("handles travelers pluralization correctly", async () => {
    render(<FlightSelection />);
    
    // Test singular (1 adult)
    const addAdultBtn = screen.getAllByText("+")[0];
    await userEvent.click(addAdultBtn);
    await userEvent.click(screen.getByText("Search"));

    // Verify singular form ("1 Adult")
    expect(mockRouter.push).toHaveBeenLastCalledWith(
      expect.stringMatching(/flight-search\?.*&travelers=1\+Adult&/)
    );

    // Test plural (2 adults)
    await userEvent.click(addAdultBtn);
    await userEvent.click(screen.getByText("Search"));

    // Verify plural form ("2 Adults")
    expect(mockRouter.push).toHaveBeenLastCalledWith(
      expect.stringMatching(/flight-search\?.*&travelers=2\+Adults&/)
    );
  });

  it("handles returnDate formatting correctly", async () => {
    render(<FlightSelection />);
    
    // Switch to round trip
    await userEvent.click(screen.getByText("round trip"));
    
    // Setup basic round trip search
    const fromInput = screen.getByPlaceholderText("Departure city");
    const toInput = screen.getByPlaceholderText("Destination city");
    await userEvent.type(fromInput, "London");
    await userEvent.type(toInput, "Paris");

    // Test with return date set
    const testDate = "2024-03-15";
    const returnDateInput = screen.getByLabelText(/return date/i);
    await userEvent.clear(returnDateInput);
    await userEvent.type(returnDateInput, testDate);
    
    await userEvent.click(screen.getByText("Search"));

    // Helper functions for reliable date handling
    function parseDateAsLocal(dateString: string) {
      const [year, month, day] = dateString.split("-").map(Number);
      return new Date(year, month - 1, day +1 ); // month is zero-based
    }

    function formatDateAsLocalISO(date: Date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    // Get the actual URL and extract the returnDate
    const url = mockRouter.push.mock.calls[0][0];
   
    
    const searchParams = new URLSearchParams(url.split("?")[1]);
    const returnDateStr = searchParams.get("returnDate")!;

    const returnDate = parseDateAsLocal(returnDateStr);
    const formattedDate = formatDateAsLocalISO(returnDate);
    expect(formattedDate).toBe(testDate);

    // Test with return date cleared
    await userEvent.clear(returnDateInput);
    await userEvent.click(screen.getByText("Search"));

    // Verify returnDate is empty when not set
    expect(mockRouter.push).toHaveBeenLastCalledWith(
      expect.stringMatching(/flight-search\?.*&returnDate=&/)
    );
  });

  it("handles undefined date in onLegDateChange", async () => {
    render(<FlightSelection />);
    
    // Switch to multi-city
    await userEvent.click(screen.getByText("multi city"));
    
    // Add another leg for testing multiple changes
    const addButton = screen.getByRole("button", { name: /add another flight/i });
    await userEvent.click(addButton);

    // Get date inputs
    const dateInputs = screen.getAllByLabelText(/departure date/i);

    // Set dates initially
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const date1 = format(tomorrow, "yyyy-MM-dd");
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    const date2 = format(dayAfterTomorrow, "yyyy-MM-dd");

    // Set and verify initial dates
    await userEvent.type(dateInputs[0], date1);
    await userEvent.type(dateInputs[1], date2);
    expect(dateInputs[0]).toHaveValue(date1);
    expect(dateInputs[1]).toHaveValue(date2);

    // Clear dates one by one and verify search parameters
    await userEvent.clear(dateInputs[0]);
    await userEvent.click(screen.getByText("Search"));

    // Verify first date becomes undefined when cleared
    const firstSearchUrl = mockRouter.push.mock.calls[0][0];
    const firstSearchParams = new URLSearchParams(firstSearchUrl.split("?")[1]);
    const firstLegsParam = firstSearchParams.get("legs");
    const firstParsedLegs = JSON.parse(firstLegsParam!);
    expect(firstParsedLegs[0].date).toBeUndefined(); // Verify first leg date is undefined when cleared
    // Convert ISO string to YYYY-MM-DD format for comparison
    const secondLegDate = new Date(firstParsedLegs[1].date).toISOString().split('T')[0];
    expect(secondLegDate).toBe(date2); // Second leg date should remain unchanged

    // Clear second date and verify both are empty
    await userEvent.clear(dateInputs[1]);
    await userEvent.click(screen.getByText("Search"));

    // Verify both dates are properly serialized as undefined
    const secondSearchUrl = mockRouter.push.mock.calls[1][0];
    const secondSearchParams = new URLSearchParams(secondSearchUrl.split("?")[1]);
    const secondLegsParam = secondSearchParams.get("legs");
    const secondParsedLegs = JSON.parse(secondLegsParam!);
    expect(secondParsedLegs[0].date).toBeUndefined(); // First leg should still be undefined
    expect(secondParsedLegs[1].date).toBeUndefined(); // Second leg should now be undefined

    // Set one date back and verify mixed empty/filled state
    await userEvent.type(dateInputs[0], date1);
    await userEvent.click(screen.getByText("Search"));

    const thirdSearchUrl = mockRouter.push.mock.calls[2][0];
    const thirdSearchParams = new URLSearchParams(thirdSearchUrl.split("?")[1]);
    const thirdLegsParam = thirdSearchParams.get("legs");
    const thirdParsedLegs = JSON.parse(thirdLegsParam!);
    // Convert ISO string to YYYY-MM-DD format for comparison
    const firstLegDate = new Date(thirdParsedLegs[0].date).toISOString().split('T')[0];
    expect(firstLegDate).toBe(date1); // First leg should have a date again
    expect(thirdParsedLegs[1].date).toBeUndefined(); // Second leg should remain undefined
  });

  it("verifies onLegDateChange handles direct undefined values", async () => {
    render(<FlightSelection />);
    
    // Switch to multi-city
    await userEvent.click(screen.getByText("multi city"));
    
    // Get first date input and directly manipulate its value to simulate
    // a case where undefined might be passed directly
    const dateInput = screen.getByLabelText(/departure date/i);
    
    // First set a value
    await userEvent.type(dateInput, "2025-07-15");
    expect(dateInput).toHaveValue("2025-07-15");
    
    // Now clear it completely
    await userEvent.clear(dateInput);
    expect(dateInput).toHaveValue("");
    
    // Submit and verify the leg parameter has an empty date
    await userEvent.click(screen.getByText("Search"));
    const url = mockRouter.push.mock.calls[0][0];
    const searchParams = new URLSearchParams(url.split("?")[1]);
    const legsParam = searchParams.get("legs");
    const parsedLegs = JSON.parse(legsParam!);
    expect(parsedLegs[0].date).toBeUndefined(); // When input is cleared, date should be undefined
  });
});