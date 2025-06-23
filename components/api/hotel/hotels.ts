import Amadeus from "amadeus";

const amadeus = new Amadeus({
    clientId: "34I5uNgLLLsHkuNTF27R1knTcTQGZ1Td",
    clientSecret: "Ky4NJP1yQswXeFKE",
});

export  async function getHotels({
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
 export async function getHotelList({
  citycode = "NYC",
  checkinDate = new Date().toISOString().split('T')[0],
  checkoutDate = new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0],
  adults = 1,
  roomQuantity = 1,
  currency = "USD",
}: {
  citycode?: string;
  checkinDate?: string;
  checkoutDate?: string;
  adults?: number;
  roomQuantity?: number;
  currency?: string;
})
 {
  try 
  {
    const response = await amadeus.shopping.hotelOffers.get({
      cityCode: citycode,
      checkInDate: checkinDate,
      checkOutDate: checkoutDate,
      adults: adults,
      roomQuantity: roomQuantity,
      currency: currency,
    });
    console.log("Hotel list response:", response.data);
    return response.data;
  } catch(error) 
  {
    console.error("Error fetching hotel list:", error);
    throw error;
  }
 }