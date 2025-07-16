'use client';

import React, { useState } from "react";
import Header from "../ui/Header";
import VehicleCard from "../ui/VehicleCard";
import { apiHelpers, API_ENDPOINTS } from '../../lib/api-config';


interface Car {
  name: string;
  type: string;
  transmission: "Automat" | "Manual";
  price: number;
  photo?: string;
}

const CarRentalPage: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);

  const handleResults = (results: any) => {
    if (results?.data && Array.isArray(results.data)) {
      const mapped = results.data.map((car: any) => ({
        name: car.name,
        type: car.car_type || "Unknown",
        price: parseFloat(car.price_total),
        transmission: car.transmission === "Automatic" ? "Automat" : "Manual",
        photo: car.photo,
      }));
      setCars(mapped);
    }
  };

  return (
    <div className="w-full max-w-[1240px] mx-auto">
      <Header onSearchResults={handleResults} />

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cars.length > 0 ? (
          cars.map((car, idx) => (
            <VehicleCard
              key={idx}
              name={car.name}
              type={car.type}
              price={car.price}
              transmission={car.transmission}
            />
          ))
        ) : (
          <p className="text-gray-500 col-span-full">No cars found yet. Try searching.</p>
        )}
      </div>
    </div>
  );
};

export default CarRentalPage;
