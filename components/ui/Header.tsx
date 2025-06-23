'use client';

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "./button";
import { Autocomplete } from "@react-google-maps/api";
import VehicleCard from "./VehicleCard";

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro';
import { Dayjs } from 'dayjs';

type DateRange<T> = [T | null, T | null];

interface HeaderProps {
  onSearchResults: (results: any) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearchResults }) => {
  const pickupRef = useRef<HTMLInputElement>(null);
  const dropoffRef = useRef<HTMLInputElement>(null);

  const [dateRange, setDateRange] = useState<DateRange<Dayjs>>([null, null]);
  const [pickupLatLng, setPickupLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [dropoffLatLng, setDropoffLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyCars, setNearbyCars] = useState<any[]>([]);

  const handlePlaceChanged = (
    type: "pickup" | "dropoff",
    autocomplete: google.maps.places.Autocomplete | null
  ) => {
    if (!autocomplete) return;
    const place = autocomplete.getPlace();
    if (!place.geometry || !place.geometry.location) return;
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    if (type === "pickup") setPickupLatLng({ lat, lng });
    else setDropoffLatLng({ lat, lng });
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          fetchNearbyCars(latitude, longitude);
        },
        (error) => {
          console.warn("User denied geolocation or error occurred:", error);
        }
      );
    } else {
      console.warn("Geolocation is not supported by this browser.");
    }
  }, []);

  const fetchNearbyCars = async (lat: number, lng: number) => {
    try {
      const response = await fetch(`/api/cars?lat=${lat}&lng=${lng}`);
      const data = await response.json();
      setNearbyCars(data);
    } catch (error) {
      console.error("Failed to fetch cars:", error);
    }
  };

  const handleSearch = async () => {
    if (!pickupLatLng || !dropoffLatLng || !dateRange[0] || !dateRange[1]) return;

    const pickUpDate = dateRange[0].format("YYYY-MM-DD");
    const dropOffDate = dateRange[1].format("YYYY-MM-DD");

    const url = `https://booking-com15.p.rapidapi.com/api/v1/cars/searchCarRentals?pick_up_latitude=${pickupLatLng.lat}&pick_up_longitude=${pickupLatLng.lng}&drop_off_latitude=${dropoffLatLng.lat}&drop_off_longitude=${dropoffLatLng.lng}&pick_up_date=${pickUpDate}&drop_off_date=${dropOffDate}&pick_up_time=10:00&drop_off_time=10:00&driver_age=30&currency_code=USD&location=US`;

    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'booking-com15.p.rapidapi.com',
        'x-rapidapi-key': '60adf17008msh63e4a1af385166bp1c2d84jsn4e4c2a9332dc'
      }
    };

    setLoading(true);
    setResults(null);

    try {
      const res = await fetch(url, options);
      const data = await res.json();
      setResults(data);
      onSearchResults(data);
    } catch (err) {
      console.error("Error fetching rental cars:", err);
      alert("Failed to fetch rental cars.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pickupLatLng && dropoffLatLng && dateRange[0] && dateRange[1]) {
      handleSearch();
    }
  }, [pickupLatLng, dropoffLatLng, dateRange]);

  return (
    <div className="w-[1240px] min-h-48 relative mx-auto">
      <div className="w-[1240px] left-0 top-0 absolute inline-flex flex-col justify-start items-start">
        <div className="w-[1266px] px-12 py-9 bg-white shadow-[0px_4px_10px_0px_rgba(218,6,6,0.10)] flex flex-col justify-center items-center gap-2.5">
          <div className="inline-flex justify-center items-center gap-32">
            <div className="flex justify-start items-center gap-12">
              {/* Pickup */}
              <div className="inline-flex flex-col justify-start items-start">
                <label className="p-2.5 text-neutral-500 text-base font-normal">Pickup</label>
                <div className="p-2.5 bg-white flex items-center gap-2.5 border border-gray-200 rounded">
                  <Image src="/location.svg" alt="Location" width={17} height={22} />
                  <Autocomplete
                    onPlaceChanged={() => {
                      const autocomplete = pickupRef.current
                        ? new google.maps.places.Autocomplete(pickupRef.current)
                        : null;
                      handlePlaceChanged("pickup", autocomplete);
                    }}
                  >
                    <input
                      ref={pickupRef}
                      type="text"
                      placeholder="Enter pickup location"
                      className="outline-none w-48 text-zinc-700 text-base font-normal"
                    />
                  </Autocomplete>
                </div>
              </div>

              {/* Dropoff */}
              <div className="inline-flex flex-col justify-start items-start">
                <label className="p-2.5 text-neutral-500 text-base font-normal">Drop Off</label>
                <div className="p-2.5 flex items-center gap-2.5 border border-gray-200 rounded">
                  <Image src="/location.svg" alt="Location" width={17} height={22} />
                  <Autocomplete
                    onPlaceChanged={() => {
                      const autocomplete = dropoffRef.current
                        ? new google.maps.places.Autocomplete(dropoffRef.current)
                        : null;
                      handlePlaceChanged("dropoff", autocomplete);
                    }}
                  >
                    <input
                      ref={dropoffRef}
                      type="text"
                      placeholder="Enter drop-off location"
                      className="outline-none w-48 text-zinc-700 text-base font-normal"
                    />
                  </Autocomplete>
                </div>
              </div>

              {/* Date Picker */}
              <div className="inline-flex flex-col justify-start items-start">
                <label className="p-2.5 text-neutral-500 text-base font-normal">Date Range</label>
                <div className="p-2.5">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateRangePicker
                      calendars={1}
                      value={dateRange}
                      onChange={(newValue) => setDateRange(newValue)}
                      slotProps={{
                        textField: {
                          size: 'small',
                          className: "bg-white rounded border border-gray-200",
                        }
                      }}
                    />
                  </LocalizationProvider>
                </div>
              </div>
            </div>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              variant="destructive"
              size="lg"
              className="font-bold px-8"
              disabled={loading || !pickupLatLng || !dropoffLatLng || !dateRange[0] || !dateRange[1]}
            >
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="w-full mt-8">
          {results?.data?.length > 0 ? (
            <div>
              <h2 className="text-lg font-bold mb-4">Available Cars</h2>
              <ul className="space-y-4">
                {results.data.map((car: any, idx: number) => (
                  <li key={idx} className="border rounded p-4 flex gap-4 items-center">
                    {car.photo && (
                      <img src={car.photo} alt={car.name} className="w-32 h-20 object-cover rounded" />
                    )}
                    <div>
                      <div className="font-semibold">{car.name}</div>
                      <div className="text-sm text-gray-600">{car.supplier_name}</div>
                      <div className="text-sm text-gray-800">
                        ${car.price_total} {car.currency}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : results?.data?.length === 0 ? (
            <div className="text-red-500">No cars found for your search.</div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Header;
