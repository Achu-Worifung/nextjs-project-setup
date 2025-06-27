'use client'
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import hotedetails from "./hoteldetailsampledata.json"
export default function HotelPage() {
  const searchparams = useSearchParams();
  // {hotel_id, start_date, end_date, room_qty, adults} = searchparams.all();

  const hotel_id = searchparams?.get("hotel_id");
  const start_date = searchparams?.get("start_date");
  const end_date = searchparams?.get("end_date");
  const room_qty = searchparams?.get("room_qty") || "1";
  const adults = searchparams?.get("adults") || "1";

//   print all the parameter 
    // console.log("Hotel ID:", hotel_id);
    // console.log("Start Date:", start_date);
    // console.log("End Date:", end_date);
    // console.log("Room Quantity:", room_qty);
    // console.log("Adults:", adults);
  const [hotel, setHotel] = useState(null);

  useEffect(() => {
    async function getHotelDetails() {
      // --------------------DELETE THIS CODE FOR PRODUCTION-------------------
      setHotel(hotedetails);
      return;
      // --------------------DELETE THIS CODE FOR PRODUCTION-------------------

      const res = await fetch("/api/hotel-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hotel_id,
          start_date,
          end_date,
          room_qty,
          adults,
        }),
      });
      if (res.ok) {
           console.log("here is the response",res)
        const data = await res.json();
        setHotel(data);
           console.log("Hotel Details:", data);
      }
    }
    getHotelDetails();
  }, []);

  return (
    <div>
      <h1>Hotel Details</h1>
      {hotel && <pre>{JSON.stringify(hotel, null, 2)}</pre>}
    </div>
  )
}
