import { NextRequest } from "next/server";
export async function POST(req: NextRequest) {
  const { hotel_id, start_date, end_date, room_qty, adults } = await req.json();
  // print the parameter
  console.log("Hotel ID:", hotel_id);
  console.log("Start Date:", start_date);
  console.log("End Date:", end_date);
  console.log("Room Quantity:", room_qty);
  console.log("Adults:", adults);

  if (!hotel_id || !start_date || !end_date) {
    return new Response(
      JSON.stringify({ error: "Missing required parameters" }),
      { status: 400 }
    );
  }

  try {
    // /api/v1/hotels/getHotelDetails?
     const apiUrl = new URL(
      `https://booking-com15.p.rapidapi.com/api/v1/hotels/getHotelDetails` 
    );

    apiUrl.searchParams.append("hotel_id", hotel_id.toString());
    apiUrl.searchParams.append("arrival_date", start_date.toString());
    apiUrl.searchParams.append("departure_date", end_date.toString());
    apiUrl.searchParams.append("room_qty", room_qty.toString() || "1");
    apiUrl.searchParams.append("adults", adults.toString() || "1");
    apiUrl.searchParams.append("units", "imperial");
    apiUrl.searchParams.append("temperature_unit", "f");
    apiUrl.searchParams.append("languagecode", "en-us");
    apiUrl.searchParams.append("currency_code", "USD");

    const res = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: {
        "x-rapidapi-key": "48908b2aa1msh03bf72b996b7b57p1e15c4jsnab9d2c2445ed",
        "x-rapidapi-host": "booking-com15.p.rapidapi.com",
        "Content-Type": "application/json",
      },
    });

    if(!res.ok) {
      console.error("Failed to fetch hotel details:", res.statusText);
      return new Response(
        JSON.stringify({ error: "Failed to fetch hotel details" }),
        { status: res.status }
      );
    }

    const data = await res.json();
    console.log("API Response:", data);
    //extracting the data
    const hotelDetails = data?.data;
    console.log("Hotel Details:", hotelDetails);
    return new Response(JSON.stringify(hotelDetails), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching hotel details:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch hotel details" }),
      { status: 500 }
    );
  }
}
