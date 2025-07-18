import Amadeus from "amadeus";
import { apiHelpers, API_ENDPOINTS } from '../../../lib/api-config';

const amadeus = new Amadeus({
    clientId: "34I5uNgLLLsHkuNTF27R1knTcTQGZ1Td",
    clientSecret: "Ky4NJP1yQswXeFKE",
});

export  async function getHotels({
    hotelId,
    adults = 1,
    checkInDate,
    checkOutDate,
    roomQuantity = 1,
    currency = "USD",
}: {
    hotelId: string;
    adults?: number;
    checkInDate: string;
    checkOutDate: string;
    roomQuantity?: number;
    currency?: string;
}) {
  try {
    // Since hotelOffers doesn't exist, we need to use a different approach
    // This might need to be done via the REST API directly or use hotelOffersSearch with hotelId
    const response = await amadeus.shopping.hotelOffersSearch.get({
      hotelIds: hotelId, // Note: might be hotelIds (plural)
      checkInDate,
      checkOutDate,
      adults,
      roomQuantity,
      currency,
    });
    console.log("Hotel offers response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching hotel offers:", error);
    throw error;
  }
}

export async function getHotelList({
  citycode = "NYC",
}: {
  citycode?: string;
}) {
  citycode = "NYC"; //for testing
  const checkInDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
  const checkOutDate = new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0]; // 7 days later
  
  try {
    console.log("Trying to call amadeus.shopping.hotelOffers with:", { citycode, checkInDate, checkOutDate });
    
    // Try the hotel offers endpoint - this might need different parameters
    const response = await amadeus.shopping.hotelOffersSearch.get({
      cityCode: citycode,
      checkInDate,
      checkOutDate,
      adults: 1,
    });
    
    console.log("Hotel list response:", response.data);
    return response.data;  } catch(error) {
    console.error("Error fetching hotel list:", error);
    
    // Fallback: try the reference data endpoint
    try {
      console.log("Trying fallback: reference data hotels by city");
      const fallbackResponse = await amadeus.referenceData.locations.hotels.byCity.get({
        cityCode: citycode,
      });
      console.log("Fallback hotel list response:", fallbackResponse.data);
      return fallbackResponse.data;
    } catch(fallbackError) {
      console.error("Fallback also failed:", fallbackError);
      throw error; // throw the original error
    }
  }
}

export async function searchHotelOffers({
  latitude,
  longitude,
  checkInDate,
  checkOutDate,
  adults = 1,
  roomQuantity = 1,
  radius = 5,
  radiusUnit = "KM",
  currency = "USD",
}: {
  latitude: number;
  longitude: number;
  checkInDate: string;
  checkOutDate: string;
  adults?: number;
  roomQuantity?: number;
  radius?: number;
  radiusUnit?: string;
  currency?: string;
}) {
  try {
    const response = await amadeus.shopping.hotelOffersSearch.get({
      latitude,
      longitude,
      checkInDate,
      checkOutDate,
      adults,
      roomQuantity,
      radius,
      radiusUnit,
      currency,
    });
    console.log("Hotel offers search response:", response.data);
    return response.data;
  } catch(error) {
    console.error("Error searching hotel offers:", error);
    throw error;
  }
}