'use client';

import React, { useState } from "react";
import { Button } from "./button";

const categories = ["All vehicles", "Sedan", "Cabriolet", "Pickup", "Suv", "Minivan"];

const VehicleGroupSelector: React.FC = () => {
  const [selected, setSelected] = useState(categories[0]);

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-6">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selected === category ? "destructive" : "outline"}
          size="sm"
          className="rounded-full text-black"
          onClick={() => setSelected(category)}
        >
          {category}
        </Button>

      ))}
    </div>
  );
};

export default VehicleGroupSelector;