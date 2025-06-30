'use client'
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import hotedetails from "./hoteldetailsampledata.json"
import {generateHotels} from "@/lib/hotel-generator";

export default function HotelPage() {
  const searchparams = useSearchParams();

  const hotel_id = searchparams?.get("hotel_id");
  const start_date = searchparams?.get("start_date");
  const end_date = searchparams?.get("end_date");
  const room_qty = searchparams?.get("room_qty") || "1";
  const adults = searchparams?.get("adults") || "1";

  const [hotel, setHotel] = useState([]);
  const [loading, setLoading] = useState(true);
          console.log("Hotel ", hotedetails);

  useEffect(() => {
    async function getHotelDetails() {
      try {
       const hotels = generateHotels(10);
       setHotel(hotels);
       console.log("Generated Hotels: ", hotels); 
      } catch (error) {
        console.error("Error fetching hotel details:", error);
      }
    }
    getHotelDetails();
  }, [hotel_id, start_date, end_date, room_qty, adults]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading hotel details...</p>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="text-6xl mb-4">🏨</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Hotel not found</h2>
          <p className="text-gray-600">Please check your search parameters and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section with Images */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Hotel Info */}
            <div className="flex flex-col justify-center">
              <div className="flex items-center mb-2">
                <h1 className="text-2xl font-bold text-gray-900 mr-3">{hotel.hotel_name}</h1>
                <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                  <span className="ml-2 text-xs font-medium text-gray-700">5.0</span>
                </div>
              </div>
              <div className="flex items-center text-gray-600 mb-3">
                <svg className="w-4 h-4 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                </svg>
                <span className="text-sm">{hotel.city}, {hotel.country_trans}</span>
              </div>
              <div className="flex items-center space-x-3">
                <a 
                  href={hotel.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md text-sm"
                >
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
                  </svg>
                  View on Booking.com
                </a>
                <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
                  </svg>
                  Save
                </button>
              </div>
            </div>

            {/* Hotel Images Gallery */}
            <div className="grid grid-cols-2 gap-3 h-60">
              <div className="col-span-1 row-span-2">
                <img 
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=600&fit=crop&crop=center" 
                  alt="Hotel main view"
                  width={500}
                  height={600}
                  className="w-full h-full object-cover rounded-2xl shadow-lg"
                />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=250&h=185&fit=crop&crop=center" 
                  alt="Hotel room"
                  width={250}
                  height={185}
                  className="w-full h-full object-cover rounded-xl shadow-md"
                />
                <img 
                  src="https://images.unsplash.com/photo-1578774204375-f8803ac4e1a9?w=250&h=185&fit=crop&crop=center" 
                  alt="Hotel lobby"
                  width={250}
                  height={185}
                  className="w-full h-full object-cover rounded-xl shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-4">
            {/* Stay Information Card */}
            <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                </svg>
                Stay Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Address</p>
                      <p className="font-medium text-gray-900 text-sm">{hotel.address}</p>
                      <p className="text-xs text-gray-500">{hotel.zip}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Check-in / Check-out</p>
                      <p className="font-medium text-gray-900 text-sm">{hotel.arrival_date} → {hotel.departure_date}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Currency</p>
                      <p className="font-medium text-gray-900 text-sm">{hotel.currency_code}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Room Size</p>
                      <p className="font-medium text-gray-900 text-sm">{hotel.average_room_size_for_ufi_m2} m²</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.148.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Property Type</p>
                      <p className="font-medium text-gray-900 text-sm">{hotel.accommodation_type_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Distance to Center</p>
                      <p className="font-medium text-gray-900 text-sm">{hotel.distance_to_cc.toFixed(1)} km</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Property Features */}
            <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Property Features
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* WiFi Rating */}
                {hotel.wifi_review_score && hotel.wifi_review_score.rating > 0 && (
                  <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">WiFi Quality</p>
                    <p className="font-bold text-lg text-blue-600">{hotel.wifi_review_score.rating}/10</p>
                  </div>
                )}
                
                {/* Reviews Count */}
                <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                  <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7z"/>
                    </svg>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">Total Reviews</p>
                  <p className="font-bold text-lg text-yellow-600">{hotel.review_nr}</p>
                </div>

                {/* Max Rooms */}
                <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
                    </svg>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">Max Rooms</p>
                  <p className="font-bold text-lg text-purple-600">{hotel.max_rooms_in_reservation}</p>
                </div>

                {/* Vacation Rental */}
                {hotel.booking_home && hotel.booking_home.is_vacation_rental && (
                  <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                      </svg>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">Type</p>
                    <p className="font-bold text-sm text-green-600">Vacation Rental</p>
                  </div>
                )}

                {/* Kitchen Available */}
                {hotel.aggregated_data && hotel.aggregated_data.has_kitchen && (
                  <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-100">
                    <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                      </svg>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">Kitchen</p>
                    <p className="font-bold text-sm text-orange-600">Available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Languages Spoken */}
            {hotel.spoken_languages && hotel.spoken_languages.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd"/>
                  </svg>
                  Languages Spoken
                </h2>
                <div className="flex flex-wrap gap-2">
                  {hotel.spoken_languages.map((lang, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
                    >
                      {lang === 'en-gb' ? 'English' : lang === 'pl' ? 'Polish' : lang.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Family Facilities */}
            {hotel.family_facilities && hotel.family_facilities.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                  </svg>
                  Family Facilities
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {hotel.family_facilities.map((facility, index) => (
                    <div key={index} className="flex items-center p-2 bg-pink-50 rounded-lg border border-pink-100">
                      <div className="w-6 h-6 bg-pink-600 rounded-lg flex items-center justify-center mr-2">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <span className="text-gray-700 text-sm font-medium">{facility}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Facilities */}
            <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                </svg>
                {hotel.facilities_block.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {hotel.facilities_block.facilities.map((fac, i) => {
                  // Icon mapping for common facilities
                  const getIcon = (facilityName: string) => {
                    const name = facilityName.toLowerCase();
                    if (name.includes('wifi') || name.includes('internet')) {
                      return (
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"/>
                        </svg>
                      );
                    }
                    if (name.includes('pool') || name.includes('swimming')) {
                      return (
                        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                        </svg>
                      );
                    }
                    if (name.includes('gym') || name.includes('fitness')) {
                      return (
                        <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017.88 10.88 3 3 0 0112.12 15.12z" clipRule="evenodd"/>
                        </svg>
                      );
                    }
                    if (name.includes('parking')) {
                      return (
                        <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm3 2h4a3 3 0 110 6h-1v2a1 1 0 11-2 0V6a1 1 0 011-1zm0 2v2h3a1 1 0 000-2H7z" clipRule="evenodd"/>
                        </svg>
                      );
                    }
                    if (name.includes('restaurant') || name.includes('dining')) {
                      return (
                        <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6 2a1 1 0 000 2h8a1 1 0 100-2H6zM6 6a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2V8a2 2 0 00-2-2H6zM6 8h8v6H6V8z"/>
                        </svg>
                      );
                    }
                    if (name.includes('air') || name.includes('conditioning')) {
                      return (
                        <svg className="w-5 h-5 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                        </svg>
                      );
                    }
                    if (name.includes('spa') || name.includes('wellness')) {
                      return (
                        <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      );
                    }
                    // Default icon
                    return (
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    );
                  };

                  return (
                    <div key={i} className="flex items-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                      <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center mr-2 shadow-sm">
                        {getIcon(fac.name)}
                      </div>
                      <span className="text-gray-700 text-sm font-medium">{fac.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Guest Reviews Section */}
            <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"/>
                </svg>
                Guest Reviews
              </h2>
              
              {/* Overall Rating */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center mb-2">
                      <span className="text-2xl font-bold text-gray-900">4.8</span>
                      <span className="text-sm text-gray-600 ml-2">/ 5.0</span>
                    </div>
                    <div className="flex items-center mb-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-600 text-xs">Based on 2,431 reviews</p>
                  </div>
                  <div className="text-right">
                    <div className="space-y-1">
                      {[
                        { label: "Location", rating: 4.9 },
                        { label: "Cleanliness", rating: 4.8 },
                        { label: "Service", rating: 4.7 },
                        { label: "Value", rating: 4.6 }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center text-sm">
                          <span className="w-20 text-gray-600">{item.label}</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2 mx-2">
                            <div 
                              className="bg-yellow-400 h-2 rounded-full" 
                              style={{ width: `${(item.rating / 5) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-gray-700 font-medium">{item.rating}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Individual Reviews */}
              <div className="space-y-3">
                {[
                  {
                    name: "Sarah Johnson",
                    rating: 5,
                    date: "March 2024",
                    review: "Absolutely stunning hotel! The location is perfect, just steps away from the main attractions. The staff was incredibly friendly and helpful throughout our stay.",
                    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
                  },
                  {
                    name: "Michael Chen",
                    rating: 4,
                    date: "February 2024", 
                    review: "Great value for money. The room was clean and comfortable. The breakfast buffet had excellent variety. Only minor issue was the WiFi speed in some areas.",
                    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                  },
                  {
                    name: "Emma Wilson",
                    rating: 5,
                    date: "January 2024",
                    review: "Exceptional service and beautiful facilities. The spa was amazing and the restaurant served delicious local cuisine. Will definitely return!",
                    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
                  }
                ].map((review, i) => (
                  <div key={i} className="border-l-4 border-blue-500 pl-4 py-3 bg-gray-50 rounded-r-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={review.avatar} 
                            alt={review.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">{review.name}</h4>
                          <p className="text-xs text-gray-500">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {[...Array(review.rating)].map((_, j) => (
                          <svg key={j} className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{review.review}</p>
                  </div>
                ))}
              </div>

              {/* View More Reviews Button */}
              <div className="text-center mt-4">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                  </svg>
                  View All 2,431 Reviews
                </button>
              </div>
            </div>

            {/* House Rules */}
            {hotel.booking_home && hotel.booking_home.house_rules.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  House Rules
                </h2>
                <ul className="space-y-2">
                  {hotel.booking_home.house_rules.map((rule, i) => (
                    <li key={i} className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                      <strong className="text-red-900 text-sm">{rule.title}:</strong>
                      <span className="text-red-800 ml-2 text-sm">{rule.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Important Information */}
            {(() => {
              // Filter out COVID-related information
              const filteredInfo = hotel.hotel_important_information_with_codes.filter(item => {
                const phrase = item.phrase.toLowerCase();
                return !phrase.includes('covid') && 
                       !phrase.includes('coronavirus') && 
                       !phrase.includes('pandemic') && 
                       !phrase.includes('vaccination') && 
                       !phrase.includes('vaccine') && 
                       !phrase.includes('pcr test') && 
                       !phrase.includes('health protocol') && 
                       !phrase.includes('social distancing') && 
                       !phrase.includes('face mask') && 
                       !phrase.includes('sanitiz') && 
                       !phrase.includes('quarantine');
              });
              
              return filteredInfo.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                    Important Information
                  </h2>
                  <ul className="space-y-2">
                    {filteredInfo.map((item, i) => (
                      <li key={i} className="p-2 bg-amber-50 rounded-lg border-l-4 border-amber-500">
                        <span className="text-amber-900 font-medium text-sm">{item.phrase}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })()}
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-4">
              {/* Quick Info Card */}
              <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                <h3 className="text-md font-bold text-gray-900 mb-3">Quick Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Type:</span>
                    <span className="font-medium text-sm">{hotel.accommodation_type_name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Timezone:</span>
                    <span className="font-medium text-sm">{hotel.timezone.split('/')[1]}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Rooms:</span>
                    <span className="font-medium text-sm">{room_qty}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Adults:</span>
                    <span className="font-medium text-sm">{adults}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Country:</span>
                    <span className="font-medium text-sm">{hotel.country_trans}</span>
                  </div>
                  {hotel.soldout === 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Available Rooms:</span>
                      <span className="font-medium text-sm text-green-600">{hotel.available_rooms}</span>
                    </div>
                  )}
                  {hotel.soldout === 1 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Status:</span>
                      <span className="font-medium text-sm text-red-600">Sold Out</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Location & Distance */}
              <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                <h3 className="text-md font-bold text-gray-900 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                  </svg>
                  Location Details
                </h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500">Distance to City Center</p>
                    <p className="font-medium text-sm">{hotel.distance_to_cc.toFixed(1)} km</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Coordinates</p>
                    <p className="font-mono text-xs text-gray-600">
                      {hotel.latitude.toFixed(4)}, {hotel.longitude.toFixed(4)}
                    </p>
                  </div>
                </div>
                <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-gray-600 border-2 border-dashed border-gray-300 mt-3">
                  <div className="text-center">
                    <svg className="w-8 h-8 mx-auto mb-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                    </svg>
                    <p className="text-xs font-medium">Interactive Map</p>
                  </div>
                </div>
              </div>

              {/* Booking Policies */}
              <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                <h3 className="text-md font-bold text-gray-900 mb-3">Booking Policies</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-green-500 mr-2 flex items-center justify-center">
                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                        <path d="m6.564.75-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z"/>
                      </svg>
                    </div>
                    <span className="text-xs text-gray-600">Max {hotel.max_rooms_in_reservation} rooms per booking</span>
                  </div>
                  {hotel.hotel_include_breakfast === 1 && (
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-orange-500 mr-2 flex items-center justify-center">
                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                          <path d="m6.564.75-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z"/>
                        </svg>
                      </div>
                      <span className="text-xs text-gray-600">Breakfast included</span>
                    </div>
                  )}
                  {hotel.qualifies_for_no_cc_reservation === 1 && (
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-blue-500 mr-2 flex items-center justify-center">
                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                          <path d="m6.564.75-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z"/>
                        </svg>
                      </div>
                      <span className="text-xs text-gray-600">No credit card required</span>
                    </div>
                  )}
                  {hotel.is_family_friendly === 1 && (
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-pink-500 mr-2 flex items-center justify-center">
                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                          <path d="m6.564.75-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z"/>
                        </svg>
                      </div>
                      <span className="text-xs text-gray-600">Family friendly</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Card */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-4 text-white">
                <h3 className="text-md font-bold mb-2">Need Help?</h3>
                <p className="text-blue-100 mb-3 text-xs">Have questions about your booking or need assistance?</p>
                <button className="w-full bg-white text-blue-600 py-2 px-3 rounded-lg font-medium hover:bg-blue-50 transition-colors text-sm">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
