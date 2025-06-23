import { Label } from "@/components/ui/label";
import { MapPin, Calendar, Users, Building2 } from "lucide-react";

export function SelectHotel() {
    return (
        <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Find Your Perfect Hotel</h2>
                <p className="text-gray-600">Search hotels for your next adventure</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                {/* Destination */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="destination" className="flex items-center text-sm font-medium text-gray-700">
                        <MapPin className="mr-2 h-4 w-4 text-pink-500" />
                        Destination
                    </Label>
                    <input
                        type="text"
                        id="destination"
                        placeholder="Where are you going?"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                </div>

                {/* Check-in Date */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="checkin" className="flex items-center text-sm font-medium text-gray-700">
                        <Calendar className="mr-2 h-4 w-4 text-pink-500" />
                        Check-in
                    </Label>
                    <input
                        type="date"
                        id="checkin"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                </div>

                {/* Check-out Date */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="checkout" className="flex items-center text-sm font-medium text-gray-700">
                        <Calendar className="mr-2 h-4 w-4 text-pink-500" />
                        Check-out
                    </Label>
                    <input
                        type="date"
                        id="checkout"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                </div>

                {/* Guests */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="guests" className="flex items-center text-sm font-medium text-gray-700">
                        <Users className="mr-2 h-4 w-4 text-pink-500" />
                        Guests
                    </Label>
                    <select
                        id="guests"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                        <option value="1">1 Guest</option>
                        <option value="2">2 Guests</option>
                        <option value="3">3 Guests</option>
                        <option value="4">4 Guests</option>
                        <option value="5">5+ Guests</option>
                    </select>
                </div>

                {/* Rooms */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="rooms" className="flex items-center text-sm font-medium text-gray-700">
                        <Building2 className="mr-2 h-4 w-4 text-pink-500" />
                        Rooms
                    </Label>
                    <select
                        id="rooms"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                        <option value="1">1 Room</option>
                        <option value="2">2 Rooms</option>
                        <option value="3">3 Rooms</option>
                        <option value="4">4+ Rooms</option>
                    </select>
                </div>
            </div>

            {/* Hotel Preferences */}
            {/* <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hotel Preferences</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"> */}
                    {/* Budget */}
                    {/* <div className="border border-gray-200 rounded-lg p-4 hover:border-pink-500 hover:shadow-md transition-all cursor-pointer">
                        <div className="text-center">
                            <div className="text-2xl mb-2">💰</div>
                            <h4 className="font-semibold text-gray-900">Budget</h4>
                            <p className="text-sm text-gray-600 mb-2">Economy hotels</p>
                            <p className="text-lg font-bold text-pink-500">$30-60/night</p>
                        </div>
                    </div> */}

                    {/* Mid-Range */}
                    {/* <div className="border border-gray-200 rounded-lg p-4 hover:border-pink-500 hover:shadow-md transition-all cursor-pointer">
                        <div className="text-center">
                            <div className="text-2xl mb-2">🏨</div>
                            <h4 className="font-semibold text-gray-900">Mid-Range</h4>
                            <p className="text-sm text-gray-600 mb-2">Comfort & amenities</p>
                            <p className="text-lg font-bold text-pink-500">$60-120/night</p>
                        </div>
                    </div> */}

                    {/* Luxury */}
                    {/* <div className="border border-gray-200 rounded-lg p-4 hover:border-pink-500 hover:shadow-md transition-all cursor-pointer">
                        <div className="text-center">
                            <div className="text-2xl mb-2">✨</div>
                            <h4 className="font-semibold text-gray-900">Luxury</h4>
                            <p className="text-sm text-gray-600 mb-2">Premium experience</p>
                            <p className="text-lg font-bold text-pink-500">$120-300/night</p>
                        </div>
                    </div> */}

                    {/* Resort */}
                    {/* <div className="border border-gray-200 rounded-lg p-4 hover:border-pink-500 hover:shadow-md transition-all cursor-pointer">
                        <div className="text-center">
                            <div className="text-2xl mb-2">🏖️</div>
                            <h4 className="font-semibold text-gray-900">Resort</h4>
                            <p className="text-sm text-gray-600 mb-2">All-inclusive</p>
                            <p className="text-lg font-bold text-pink-500">$200+/night</p>
                        </div>
                    </div> */}
                {/* </div>
            </div> */}

            {/* Additional Filters */}
            {/* <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-pink-500 focus:ring-pink-500" />
                        <span className="text-sm text-gray-700">WiFi</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-pink-500 focus:ring-pink-500" />
                        <span className="text-sm text-gray-700">Pool</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-pink-500 focus:ring-pink-500" />
                        <span className="text-sm text-gray-700">Gym</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-pink-500 focus:ring-pink-500" />
                        <span className="text-sm text-gray-700">Spa</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-pink-500 focus:ring-pink-500" />
                        <span className="text-sm text-gray-700">Parking</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-pink-500 focus:ring-pink-500" />
                        <span className="text-sm text-gray-700">Restaurant</span>
                    </label>
                </div>
            </div> */}

            {/* Search Button */}
            <div className="flex justify-center">
                <button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-8 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2">
                    Search Hotels
                </button>
            </div>
        </div>
    );
}