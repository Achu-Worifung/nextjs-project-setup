"use client";
// import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { useState } from "react";

import { hotel_type } from "@/lib/types";
export function HotelCard({ hotel }: { hotel: hotel_type }) {

  //getting the difference between the days
  const checkinDate = new Date(hotel.property.checkinDate);
  const checkoutDate = new Date(hotel.property.checkoutDate);

  const diffTime = Math.abs(checkoutDate.getTime() - checkinDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));



  return (
    <div className="flex max-w-4xl w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden mb-4 hover:shadow-lg transition-shadow">
      {/* Hotel Image Section */}
      <div className="relative flex items-center justify-center w-60 h-48 overflow-hidden flex-shrink-0">
        
        <img
          src={hotel.property.photoUrls[hotel.property.photoUrls.length - 1] || 0}
          alt={hotel.property.name}
          className="w-full h-full object-cover"
        />
        
      </div>

      {/* Hotel Info Section */}
      <div className="flex-1 p-4 flex justify-between">
        <div className="flex-1">
          {/* Hotel Name and Location */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
              {hotel.property.name}
            </h3>
            <p className="text-sm text-gray-600 flex items-center">
              📍 {hotel.property.wishlistName}
            </p>
          </div>

          {/* Rating Section */}
          <div className="flex items-center gap-3 mb-3">
            {hotel.property.reviewScore && (
              <div className="flex items-center gap-2">
                <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-medium">
                  {hotel.property.reviewScore}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {hotel.property.reviewScoreWord}
                  </p>
                  <p className="text-xs text-gray-500">
                    {hotel.property.reviewCount?.toLocaleString()} reviews
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Amenities or Features */}
          <div className="flex flex-wrap gap-1 mb-2">
            {/* <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
              {diffDays} night{diffDays > 1 ? 's' : ''}
            </span> */}
            {hotel.property.priceBreakdown.benefitBadges
              ?.slice(0, 2)
              .map((badge, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                >
                  {badge.text}
                </span>
              ))}
          </div>
        </div>

        {/* Price Section */}
        <div className="text-right flex flex-col justify-between ml-4">
          <div>
            {hotel.property.priceBreakdown.strikethroughPrice && (
              <div className="mb-1">
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                  Save $
                  {(
                    hotel.property.priceBreakdown.strikethroughPrice.value -
                    hotel.property.priceBreakdown.grossPrice.value
                  ).toLocaleString()}
                </span>
              </div>
            )}

            <div className="text-right flex items-end justify-end">
              <p className="text-2xl font-bold text-green-600">
                $
                {Math.round(
                  hotel.property.priceBreakdown.grossPrice.value / diffDays
                ).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">/ night</p>
            </div>

            <span className="flex justify-center items-baseline gap-1">
              {hotel.property.priceBreakdown.strikethroughPrice && (
                <p className=" text-gray-500 line-through">
                  $
                  {hotel.property.priceBreakdown.strikethroughPrice.value.toLocaleString()}
                </p>
              )}
              <p className="text-lg font-semibold text-gray-900 mt-1">
                $
                {hotel.property.priceBreakdown.grossPrice.value.toLocaleString()}{" "}
                total
              </p>
            </span>

            {hotel.property.priceBreakdown.excludedPrice && (
              <p className="text-xs text-gray-500">
                +$
                {hotel.property.priceBreakdown.excludedPrice.value.toLocaleString()}{" "}
                taxes & fees
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
