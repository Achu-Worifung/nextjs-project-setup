"use client";

import { useState } from "react";

export function HotelSortBy({sortByfunction}: { sortByfunction: (value: string) => void }) {
  const [sortBy, setSortBy] = useState<string>("popularity");
  
  const handleSortChange = (sortValue: string) => {
    sortByfunction(sortValue);
    setSortBy(sortValue);
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Sort by:</label>
        <select
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
          className="px-3 py-1 border rounded-md text-sm"
        >
          <option value="popularity">Popularity</option>
          <option value="price">Price (Low to High)</option>
          <option value="rating">Guest Rating (High to Low)</option>
          <option value="review">Most Reviews</option>
        </select>
      </div>
    </div>
  );
}
