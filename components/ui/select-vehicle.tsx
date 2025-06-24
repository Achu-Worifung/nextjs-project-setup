import { Label } from "@/components/ui/label";
import { MapPin, Calendar } from "lucide-react";

export function SelectVehicle() {
  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg my-5">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Your Ride</h2>
        <p className="text-gray-600">Select your pickup and dropoff details</p>
      </div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Pickup Location */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="pickup-location" className="flex items-center text-sm font-medium text-gray-700">
            <MapPin className="mr-2 h-4 w-4 text-pink-500" />
            Pickup Location
          </Label>
          <input
            type="text"
            id="pickup-location"
            placeholder="Enter pickup location"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>

        {/* Dropoff Location */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="dropoff-location" className="flex items-center text-sm font-medium text-gray-700">
            <MapPin className="mr-2 h-4 w-4 text-pink-500" />
            Dropoff Location
          </Label>
          <input
            type="text"
            id="dropoff-location"
            placeholder="Enter dropoff location"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>

        {/* Pickup Date Range - From */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="pickup-from" className="flex items-center text-sm font-medium text-gray-700">
            <Calendar className="mr-2 h-4 w-4 text-pink-500" />
            Pickup From
          </Label>
          <input
            type="datetime-local"
            id="pickup-from"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>

        {/* Pickup Date Range - To */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="pickup-to" className="flex items-center text-sm font-medium text-gray-700">
            <Calendar className="mr-2 h-4 w-4 text-pink-500" />
            Pickup To
          </Label>
          <input
            type="datetime-local"
            id="pickup-to"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Vehicle Selection Section */}
      {/* <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Vehicle Type</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 hover:border-pink-500 hover:shadow-md transition-all cursor-pointer">
            <div className="text-center">
              <div className="text-2xl mb-2">🚗</div>
              <h4 className="font-semibold text-gray-900">Economy</h4>
              <p className="text-sm text-gray-600 mb-2">4 seats • AC</p>
              <p className="text-lg font-bold text-pink-500">$25/day</p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 hover:border-pink-500 hover:shadow-md transition-all cursor-pointer">
            <div className="text-center">
              <div className="text-2xl mb-2">🚙</div>
              <h4 className="font-semibold text-gray-900">SUV</h4>
              <p className="text-sm text-gray-600 mb-2">7 seats • AC</p>
              <p className="text-lg font-bold text-pink-500">$45/day</p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 hover:border-pink-500 hover:shadow-md transition-all cursor-pointer">
            <div className="text-center">
              <div className="text-2xl mb-2">🚘</div>
              <h4 className="font-semibold text-gray-900">Luxury</h4>
              <p className="text-sm text-gray-600 mb-2">4 seats • Premium</p>
              <p className="text-lg font-bold text-pink-500">$75/day</p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 hover:border-pink-500 hover:shadow-md transition-all cursor-pointer">
            <div className="text-center">
              <div className="text-2xl mb-2">🚐</div>
              <h4 className="font-semibold text-gray-900">Van</h4>
              <p className="text-sm text-gray-600 mb-2">12 seats • AC</p>
              <p className="text-lg font-bold text-pink-500">$65/day</p>
            </div>
          </div>
        </div>
      </div> */}

      {/* Search Button */}
      <div className="flex justify-center">
        <button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-8 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2">
          Search Available Vehicles
        </button>
      </div>
    </div>
  );
}
