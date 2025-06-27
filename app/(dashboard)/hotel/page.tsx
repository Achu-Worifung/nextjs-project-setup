import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
export default function HotelPage() {
  const searchparams = useSearchParams();
  // {hotel_id, start_date, end_date, room_qty, adults} = searchparams.all();

  const hotel_id = searchparams?.get("hotel_id");
  const start_date = searchparams?.get("start_date");
  const end_date = searchparams?.get("end_date");
  const room_qty = searchparams?.get("room_qty") || "1";
  const adults = searchparams?.get("adults") || "1";
  const [hotel, setHotel] = useState(null);

  useEffect(() => {
    async function getHotelDetails() {
      const res = await fetch(`/api/hotel-details`, {
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
        const data = await res.json();
        setHotel(data);
      }
    }
    getHotelDetails();
  }, []);
}
