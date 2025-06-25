import hotelbycity from "./searchhtelbycity.json";
import hotelList from "./hotelList.json"
export async function searchDestinations(query: string) {
  try {
    // search hotels by city name use prev return data
    console.log(`Searching destinations for: ${query}`); // Use the query parameter
    const response = hotelbycity;
    // const response = await fetch(`/api/booking/search-destination?query=${encodeURIComponent(query)}`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // });

    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }

    // const result = await response.json();

    // if (!result.success) {
    //   throw new Error(result.error || 'Failed to fetch destinations');
    // }

    //getting the hotel list

    // console.log('Search destinations response:', result.data);

    return response;
  } catch (error) {
    console.error("Error searching destinations:", error);
    throw error;
  }
}

// TypeScript interfaces
interface Destination {
  dest_id: string;
  city_name?: string;
  name?: string;
  search_type?: string;
}

interface HotelData {
  hotel_id: number;
  accessibilityLabel: string;
  property: {
    id: number;
    name: string;
    reviewScore?: number;
    reviewScoreWord?: string;
    reviewCount?: number;
    photoUrls?: string[];
    mainPhotoId?: number;
    propertyClass?: number;
    accuratePropertyClass?: number;
    currency: string;
    latitude?: number;
    longitude?: number;
    countryCode?: string;
    wishlistName?: string;
    checkinDate?: string;
    checkoutDate?: string;
    checkin?: {
      fromTime: string;
      untilTime: string;
    };
    checkout?: {
      fromTime: string;
      untilTime: string;
    };
    priceBreakdown: {
      grossPrice: {
        currency: string;
        value: number;
      };
      strikethroughPrice?: {
        currency: string;
        value: number;
      };
      excludedPrice?: {
        currency: string;
        value: number;
      };
      benefitBadges?: Array<{
        text: string;
        variant: string;
        explanation: string;
        identifier: string;
      }>;
    };
    isPreferred?: boolean;
    blockIds?: string[];
    qualityClass?: number;
    position?: number;
    rankingPosition?: number;
    isFirstPage?: boolean;
    ufi?: number;
    optOutFromGalleryChanges?: number;
  };
}

export async function getHotelList(
  destinations: Destination[]
): Promise<HotelData[]> {
  try {
    const hotelPromises = destinations.map(async (destination: Destination) => {
      try {
        console.log(
          `Fetching hotels for: ${destination.city_name || destination.name}`
        );

        // Prepare request parameters
        const requestParams = {
          dest_id: destination.dest_id,
          search_type: destination.search_type || "CITY",
          adults: 1,
          children_age: "0,17",
          room_qty: 1,
          page_number: 1,
          units: "metric",
          temperature_unit: "c",
          languagecode: "en-us",
          currency_code: "USD",
          arrival_date: "2025-06-24",
          departure_date: "2025-07-25",
        };

        // Log the parameters being sent
        console.log(
          `📋 Request parameters for ${destination.city_name}:`,
          requestParams
        );

        const response = await fetch("/api/booking/search-hotels", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestParams),
        });

        if (!response.ok) {
          console.error(
            `Failed to fetch hotels for ${destination.city_name}:`,
            response.status
          );
          return [];
        }

        const result = await response.json();

        if (!result.success) {
          console.error(
            `API error for ${destination.city_name}:`,
            result.error
          );
          return []; // Return empty array instead of throwing
        }
        console.log(
          ` Found ${result.data?.length || 0} hotels for ${
            destination.city_name
          }`
        );
        return result.data || [];
      } catch (error) {
        console.error(`Error fetching hotels for destination:`, error);
        return []; // Return empty array on error
      }
    });

    // Wait for all requests to complete
    const hotelResults = await Promise.all(hotelPromises);

    // Flatten all results into single array
    const allHotels = hotelResults.flat();

    console.log(`Total hotels fetched: ${allHotels.length}`);
    return allHotels;
  } catch (error) {
    console.error("Error in getHotelList:", error);
    throw error;
  }
}

export async function hotelSearch({
  city,
  startDate,
  endDate,
  guests,
  rooms,
}: {
  city: string;
  startDate: string;
  endDate: string;
  guests: string;
  rooms: string;
}): Promise<HotelData[]> {
  try {
    console.log(`🔍 Searching hotels for:`, {
      city,
      startDate,
      endDate,
      guests,
      rooms,
    });

    // Fetch destinations based on the city name
    const destinations = await searchDestinations(city);

    if (!destinations || destinations.length === 0) {
      console.warn(`No destinations found for city: ${city}`);
      return [];
    }

    // TODO: Pass the date and guest parameters to the hotel search
    // For now, we'll just get the hotel list, but you should modify getHotelList
    // to accept these parameters and pass them to the API
    console.log(`📋 Search parameters that should be used:`, {
      checkIn: startDate,
      checkOut: endDate,
      adults: guests,
      rooms: rooms,
    });
     //for testing --------------------------------------------
     return hotelList; // Use the static hotel list for testing
    //------------------------------------------------------
    const justOne = destinations.slice(0, 1); // For testing, just take the first destination
    // Get hotel list for the fetched destinations
    const hotels = await getHotelList(justOne);

    console.log(`🏨 Total hotels found: ${hotels.length}`);
    return hotels;
  } catch (error) {
    console.error("Error in hotelSearch:", error);
    throw error;
  }
}

// TypeScript interface for the expected response structure
// export interface BookingDestination {
//   // Add proper types based on the actual API response
//   // You'll need to check the actual response structure and update this
//   id: string;
//   name: string;
//   country?: string;
//   region?: string;
//   type?: string;
// }
