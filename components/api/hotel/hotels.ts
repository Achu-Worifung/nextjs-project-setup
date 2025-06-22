import Amadeus from "amadeus";

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
});

export default async function getHotels({
    hotelId,
    adults = 1,
    checkInDate,
    checkOutDate,
    countryofResidence = "US",
    roomQuantity = 1,
    currency = "USD",
}: {
    hotelId: string;
    adults?: number;
    checkInDate: string;
    checkOutDate: string;
    countryofResidence?: string;
    roomQuantity?: number;
    currency?: string;
}) {
  try {
    const response = await amadeus.shopping.hotelOffers.get({
      hotelId,
      adults,
      checkInDate,
      checkOutDate,
      countryofResidence,
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
