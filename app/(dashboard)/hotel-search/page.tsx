'use client';
import { useSearchParams, useRouter } from "next/navigation";
import {getHotelList} from "@/components/api/hotel/hotels";
import { useEffect, useState } from "react";

export default function HotelSearchPage()
{
    const searchParams = useSearchParams();
    const router = useRouter();
    const city = searchParams?.get("city") || "New York City";
    const startDate = searchParams?.get("startDate") ||new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0];
    const endDate = searchParams?.get("endDate") || new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0];
    const guests = searchParams?.get("guests") || "1";
    const rooms = searchParams?.get("rooms") || "1";

    const [hotels, setHotels] = useState([]);
    useEffect(() =>
    {
        async function fetchHotels() {
            try {
                const hotelList = await getHotelList({
                    citycode: city,
                    // checkinDate: startDate,
                    // checkoutDate: endDate,
                    // adults: parseInt(guests, 10),
                    // roomQuantity: parseInt(rooms, 10),
                });
                setHotels(hotelList);
                console.log("Fetched hotels:", hotelList);
            } catch (error) {
                console.error("Error fetching hotels:", error);
            }
        }

        fetchHotels();
    }, [])

    return (
        <>
        <p>{JSON.stringify(hotels)}</p>
        </>
    )
}