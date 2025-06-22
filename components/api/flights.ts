"use server";
// @ts-expect-error - Amadeus SDK doesn't have TypeScript declarations
import Amadeus from "amadeus";

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
});

//get the list of avaliable flights from Amadeus API
export default async function getFlights({
  origin,
  destination,
  departureDate,
  returnDate = null,
  adults = 1,
  children = 0,
  infants = 0,
  cabinClass = "economy",
  airlineCode,
  currency = "USD",
  max = 250,
}: {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string | null;
  adults?: number;
  children?: number;
  infants?: number;
  cabinClass?: "economy" | "business" | "first";
  airlineCode?: string;
  currency?: string;
  max?: number;
}) {
  try {
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: departureDate,
      returnDate: returnDate,
      adults: adults,
      children: children,
      infants: infants,
      travelClass: cabinClass.toUpperCase(),
      max: max,
      currencyCode: currency,
      airlineCode: airlineCode,
    });
    console.log("Flight offers response:", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// The price and availability of airfare fluctuate constantly, so it's necessary to confirm the real-time price before proceeding to book.

export async function confirmFlightPrice({ flight }: { flight: any }) {
  const response = await amadeus.shopping.flightOffers.pricing.post(
    JSON.stringify({ data: flight })
  );

  return response;
}
