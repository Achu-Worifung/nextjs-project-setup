"use server";
// @ts-expect-error - Amadeus SDK doesn't have TypeScript declarations
import Amadeus from "amadeus";
// import axios from "axios";

// const amadeus = new Amadeus({
//   clientId: process.env.AMADEUS_CLIENT_ID,
//   clientSecret: process.env.AMADEUS_CLIENT_SECRET,
// });
const amadeus = new Amadeus({
    clientId: "34I5uNgLLLsHkuNTF27R1knTcTQGZ1Td",
    clientSecret: "Ky4NJP1yQswXeFKE",
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

export async function confirmFlightPrice({ flight }: { flight: unknown }) {
  const response = await amadeus.shopping.flightOffers.pricing.post(
    JSON.stringify({ data: flight })
  );

  return response;
}


export async function getAirPort(input: string)
{
 const response = await fetch(`https://api.aviationstack.com/v1/airports?access_key=1b933a6d32566aabae4eb902b7f4b3f3&search=${input}`);
  const data = await response.json();

  if (data.data) {
    console.log('API response:', data.data);
    return data.data; // This will be an array of airport objects
  } else {
    console.error('API error:', data);
    return [];
  }
}