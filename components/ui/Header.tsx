'use client';

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "./button";
import { Autocomplete } from "@react-google-maps/api";
import VehicleCard from "./VehicleCard";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from "dayjs";

interface LatLng {
  lat: number;
  lng: number;
}

const Header: React.FC = () => {
  const pickupRef = useRef<HTMLInputElement>(null);
  const dropoffRef = useRef<HTMLInputElement>(null);
  const pickupAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
const dropoffAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [pickupLatLng, setPickupLatLng] = useState<LatLng | null>(null);
  const [dropoffLatLng, setDropoffLatLng] = useState<LatLng | null>(null);
  const [pickupTime, setPickupTime] = useState("");
const [dropoffTime, setDropoffTime] = useState("");

  const [pickupDate, setPickupDate] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");
   const [pickupDateTime, setPickupDateTime] = useState<Dayjs | null>(null);
  const [dropoffDateTime, setDropoffDateTime] = useState<Dayjs | null>(null);

  const [loading, setLoading] = useState(false);
  const [availableCars, setAvailableCars] = useState<any[]>([]);

  const getCoordinatesForLocation = async (locationName: string): Promise<LatLng | null> => {
    if (!locationName) return null;

    try {
      const response = await fetch(`/api/v1/cars/searchDestination?query=${encodeURIComponent(locationName)}`);
      if (!response.ok) {
        console.error("API error:", response.statusText);
        return null;
      }
      const data = await response.json();

      if (data && data.length > 0) {
        const loc = data[0];
        return {
          lat: loc.coordinates.latitude,
          lng: loc.coordinates.longitude,
        };
      }
    } catch (error) {
      console.error("Failed to fetch coordinates:", error);
    }
    return null;
  };


const searchAvailableCars = async () => {
  if (
    !pickupLatLng ||
    !dropoffLatLng ||
    !pickupDateTime ||
    !dropoffDateTime
  ) {
    alert("Please enter all fields, valid locations, and times.");
    return;
  }

  setLoading(true);

  const body = {
    pickup_latitude: pickupLatLng.lat,
    pickup_longitude: pickupLatLng.lng,
    dropoff_latitude: dropoffLatLng.lat,
    dropoff_longitude: dropoffLatLng.lng,
    pick_up_date: pickupDateTime.format("YYYY-MM-DD"),
    drop_off_date: dropoffDateTime.format("YYYY-MM-DD"),
    pick_up_time: pickupDateTime.format("HH:mm"),
    drop_off_time: dropoffDateTime.format("HH:mm"),
  };

  console.log("Sending search request with:", body);

  try {
    const response = await fetch("/api/v1/cars/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    console.log("API status:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API error response:", errorData);
      alert(`Search failed: ${JSON.stringify(errorData)}`);
      return;
    }

    const json = await response.json();
console.log("API full response:", JSON.stringify(json, null, 2));

    setAvailableCars(json.cars ?? []);
  } catch (error) {
    console.error("Search failed:", error);
    alert("Failed to search available cars.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="w-[1240px] min-h-48 relative mx-auto">
      <div className="w-[1240px] left-0 top-0 absolute inline-flex flex-col justify-start items-start">
        <div className="w-[1266px] px-12 py-9 bg-white shadow-[0px_4px_10px_0px_rgba(218,6,6,0.10)] flex flex-col justify-center items-center gap-2.5">
          <div className="inline-flex justify-center items-center gap-32">
            <div className="flex justify-start items-center gap-12">

              {/* Pickup */}
<div className="inline-flex flex-col justify-start items-start">
  <label className="block font-semibold mb-1 text-black">Pickup Location</label>
  <Autocomplete
  onLoad={(autocomplete) => {
    pickupAutocompleteRef.current = autocomplete;
  }}
  onPlaceChanged={() => {
    const autocomplete = pickupAutocompleteRef.current;
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) {
        alert("Please select a location from the dropdown suggestions.");
        return;
      }
      setPickupLatLng({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    }
  }}
>
  <input
    ref={pickupRef}
    type="text"
    placeholder="Enter pickup location"
    className="border rounded px-3 py-2 w-full text-black"
  />
</Autocomplete>
</div>
{/* Drop-off */}
<div className="inline-flex flex-col justify-start items-start">
  <label className="block font-semibold mb-1 text-black">Drop-off Location</label>
  <Autocomplete
  onLoad={(autocomplete) => {
    dropoffAutocompleteRef.current = autocomplete;
  }}
  onPlaceChanged={() => {
    const autocomplete = dropoffAutocompleteRef.current;
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) {
        alert("Please select a location from the dropdown suggestions.");
        return;
      }
      setDropoffLatLng({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    }
  }}
>
  <input
    ref={dropoffRef}
    type="text"
    placeholder="Enter drop-off location"
    className="border rounded px-3 py-2 w-full text-black"
  />
</Autocomplete>
</div>

              {/* Date Picker */}
              <div className="inline-flex flex-col justify-start items-start">
                <label className="p-2.5 text-black text-base font-normal">Date & Time Range</label>
                <div className="p-2.5">
                 <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DateTimePicker']}>
            <DateTimePicker
              label="pickup Date & time"
              disablePast={true}
              value={pickupDateTime}
              onChange={(newValue) => {
                setPickupDateTime(newValue);
                if (newValue) {
                  setPickupDate(newValue.format("YYYY-MM-DD"));
                  setPickupTime(newValue.format("HH:mm"));
                } else {
                  setPickupDate("");
                  setPickupTime("");
                }
              }}
            />
          </DemoContainer>
        </LocalizationProvider>
<LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DateTimePicker']}>
            <DateTimePicker
              label="dropoff Date & time"
              disablePast={true}
              value={dropoffDateTime}
              onChange={(newValue) => {
                setDropoffDateTime(newValue);
                if (newValue) {
                  setDropoffDate(newValue.format("YYYY-MM-DD"));
                  setDropoffTime(newValue.format("HH:mm"));
                } else {
                  setDropoffDate("");
                  setDropoffTime("");
                }
              }}
            />
          </DemoContainer>
        </LocalizationProvider>
                </div>
              </div>
            </div>

            {/* Search Button */}
            <button
              onClick={searchAvailableCars}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Searching..." : "Search Cars"}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Available Cars</h3>
          {availableCars.length === 0 && <p>No cars found yet.</p>}
          <ul>
  {availableCars.map((car, index) => (
    <li key={index} className="border p-2 mb-2 rounded">
      <strong>{car.name || "Unnamed Car"}</strong><br />
      {car.description ?? "No description"}
    </li>
  ))}
</ul>

        </div>

        {/* Debug Coordinates Display */}
        <div className="mt-8 p-4 bg-gray-100 rounded w-full text-black max-h-64 overflow-auto">
  <h4 className="font-semibold mb-2">Debug Info</h4>
  <p><strong>Pickup Latitude:</strong> {pickupLatLng?.lat ?? "N/A"}</p>
  <p><strong>Pickup Longitude:</strong> {pickupLatLng?.lng ?? "N/A"}</p>
  <p><strong>Drop-off Latitude:</strong> {dropoffLatLng?.lat ?? "N/A"}</p>
  <p><strong>Drop-off Longitude:</strong> {dropoffLatLng?.lng ?? "N/A"}</p>
  <p><strong>Pickup Date:</strong> {pickupDate || "N/A"}</p>
  <p><strong>Pickup Time:</strong> {pickupTime || "N/A"}</p>
  <p><strong>Drop-off Date:</strong> {dropoffDate || "N/A"}</p>
  <p><strong>Drop-off Time:</strong> {dropoffTime || "N/A"}</p>

  <h5 className="mt-4 font-semibold text-black">API Response (Available Cars):</h5>
  {availableCars.length === 0 ? (
    <p>No cars returned from API yet.</p>
  ) : (
    <pre className="whitespace-pre-wrap text-sm bg-white p-2 rounded border max-h-48 overflow-auto">
      {JSON.stringify(availableCars, null, 2)}
    </pre>
  )}
</div>
      </div>
    </div>
  );
};

export default Header;
