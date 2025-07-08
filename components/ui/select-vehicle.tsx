"use client";

import { useState, useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";
import { MapPin, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { 
  mockAvailableCars, 
  getLocationSuggestions, 
  carTypes, 
  type CarData 
} from "@/data/car-rental-data";

const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-in-out;
  }
`;

export function SelectVehicle() {
	const router = useRouter();
	const [minSeats, setMinSeats] = useState(0);
	const [maxPrice, setMaxPrice] = useState(100);
	const [selectedType, setSelectedType] = useState("All");
	
	// Date state
	const [pickupDate, setPickupDate] = useState("");
	const [dropoffDate, setDropoffDate] = useState("");
	
	// Location state
	const [pickupLocation, setPickupLocation] = useState("");
	const [dropoffLocation, setDropoffLocation] = useState("");
	const [pickupSuggestions, setPickupSuggestions] = useState<string[]>([]);
	const [dropoffSuggestions, setDropoffSuggestions] = useState<string[]>([]);
	const [isPickupFocused, setIsPickupFocused] = useState(false);
	const [isDropoffFocused, setIsDropoffFocused] = useState(false);
	
	const pickupRef = useRef<HTMLDivElement>(null);
	const dropoffRef = useRef<HTMLDivElement>(null);

	const handleSearch = () => {
		// Validate required fields
		if (!pickupLocation) {
			alert("Please enter a pickup location");
			return;
		}
		
		if (!dropoffLocation) {
			alert("Please enter a dropoff location");
			return;
		}
		
		if (!pickupDate) {
			alert("Please select a pickup date and time");
			return;
		}
		
		if (!dropoffDate) {
			alert("Please select a dropoff date and time");
			return;
		}
		
		// Validate date order
		if (new Date(dropoffDate) <= new Date(pickupDate)) {
			alert("Dropoff date must be after pickup date");
			return;
		}
		
		// Build query string with search parameters
		const params = new URLSearchParams();
		params.set("pickup", pickupLocation);
		params.set("dropoff", dropoffLocation);
		params.set("minSeats", minSeats.toString());
		params.set("maxPrice", maxPrice.toString());
		params.set("vehicleType", selectedType);
		
		if (pickupDate) {
			params.set("pickupDate", pickupDate);
		}
		
		if (dropoffDate) {
			params.set("dropoffDate", dropoffDate);
		}
		
		// Navigate to search results page with query parameters
		router.push(`/car-search-results?${params.toString()}`);
	};

	// Effect for pickup location suggestions
	useEffect(() => {
		const fetchSuggestions = async () => {
			if (pickupLocation.length > 1) {
				const suggestions = await getLocationSuggestions(pickupLocation);
				setPickupSuggestions(suggestions);
			} else {
				setPickupSuggestions([]);
			}
		};
		
		fetchSuggestions();
	}, [pickupLocation]);

	// Effect for dropoff location suggestions
	useEffect(() => {
		const fetchSuggestions = async () => {
			if (dropoffLocation.length > 1) {
				const suggestions = await getLocationSuggestions(dropoffLocation);
				setDropoffSuggestions(suggestions);
			} else {
				setDropoffSuggestions([]);
			}
		};
		
		fetchSuggestions();
	}, [dropoffLocation]);

	// Click outside handlers
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (pickupRef.current && !pickupRef.current.contains(event.target as Node)) {
				setIsPickupFocused(false);
			}
			if (dropoffRef.current && !dropoffRef.current.contains(event.target as Node)) {
				setIsDropoffFocused(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg my-5">
			<style dangerouslySetInnerHTML={{ __html: animationStyles }} />
			<div className="mb-8">
				<h2 className="text-2xl font-bold text-gray-900 mb-2">
					Book Your Ride
				</h2>
				<p className="text-gray-600">
					Select your pickup and dropoff details
				</p>
			</div>

			{/* Input Fields */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
				{/* Pickup Location */}
				<div className="flex flex-col gap-2" ref={pickupRef}>
					<Label
						htmlFor="pickup-location"
						className="flex items-center text-sm font-medium text-gray-700"
					>
						<MapPin className="mr-2 h-4 w-4 text-pink-500" />
						Pickup Location
					</Label>
					<div className="relative">
						<input
							type="text"
							id="pickup-location"
							placeholder="Enter pickup location"
							className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
							value={pickupLocation}
							onChange={(e) => setPickupLocation(e.target.value)}
							onFocus={() => setIsPickupFocused(true)}
						/>
						{isPickupFocused && pickupSuggestions.length > 0 && (
							<div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
								{pickupSuggestions.map((location, index) => (
									<div
										key={index}
										className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
										onClick={() => {
											setPickupLocation(location);
											setIsPickupFocused(false);
										}}
									>
										<div className="flex items-center">
											<MapPin className="mr-2 h-4 w-4 text-pink-500" />
											{location}
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>

				{/* Dropoff Location */}
				<div className="flex flex-col gap-2" ref={dropoffRef}>
					<Label
						htmlFor="dropoff-location"
						className="flex items-center text-sm font-medium text-gray-700"
					>
						<MapPin className="mr-2 h-4 w-4 text-pink-500" />
						Dropoff Location
					</Label>
					<div className="relative">
						<input
							type="text"
							id="dropoff-location"
							placeholder="Enter dropoff location"
							className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
							value={dropoffLocation}
							onChange={(e) => setDropoffLocation(e.target.value)}
							onFocus={() => setIsDropoffFocused(true)}
						/>
						{isDropoffFocused && dropoffSuggestions.length > 0 && (
							<div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
								{dropoffSuggestions.map((location, index) => (
									<div
										key={index}
										className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
										onClick={() => {
											setDropoffLocation(location);
											setIsDropoffFocused(false);
										}}
									>
										<div className="flex items-center">
											<MapPin className="mr-2 h-4 w-4 text-pink-500" />
											{location}
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>

				{/* Pickup Date */}
				<div className="flex flex-col gap-2">
					<Label
						htmlFor="pickup-from"
						className="flex items-center text-sm font-medium text-gray-700"
					>
						<Calendar className="mr-2 h-4 w-4 text-pink-500" />
						Pickup From
					</Label>
					<input
						type="datetime-local"
						id="pickup-from-date"
						className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
						value={pickupDate}
						onChange={(e) => setPickupDate(e.target.value)}
					/>
				</div>

				{/* Dropoff Date */}
				<div className="flex flex-col gap-2">
					<Label
						htmlFor="pickup-to"
						className="flex items-center text-sm font-medium text-gray-700"
					>
						<Calendar className="mr-2 h-4 w-4 text-pink-500" />
						Pickup To
					</Label>
					<input
						type="datetime-local"
						id="pickup-to"
						className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
						value={dropoffDate}
						onChange={(e) => setDropoffDate(e.target.value)}
					/>
				</div>
			</div>

			{/* Filter Controls */}
			<div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
				<div>
					<Label htmlFor="minSeats">Minimum Seats</Label>
					<select
						id="minSeats"
						value={minSeats}
						onChange={(e) => setMinSeats(parseInt(e.target.value))}
						className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
					>
						<option value={0}>Any</option>
						<option value={2}>2+</option>
						<option value={4}>4+</option>
						<option value={6}>6+</option>
						<option value={8}>8+</option>
					</select>
				</div>

				<div>
					<Label htmlFor="vehicleType">Vehicle Type</Label>
					<select
						id="vehicleType"
						value={selectedType}
						onChange={(e) => setSelectedType(e.target.value)}
						className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
					>
						<option value="All">All Types</option>
						{carTypes.filter(type => type !== "All").map((type) => (
							<option key={type} value={type}>
								{type}
							</option>
						))}
					</select>
				</div>

				<div>
					<Label htmlFor="maxPrice">Max Price (Per Day)</Label>
					<input
						type="number"
						id="maxPrice"
						value={maxPrice}
						min={0}
						max={200}
						onChange={(e) => setMaxPrice(parseInt(e.target.value))}
						className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
					/>
				</div>
			</div>

			{/* Search Button */}
			<div className="flex justify-center mb-8">
				<button
					id="search-vehicles-button"
					onClick={handleSearch}
					className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-8 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
				>
					Search Available Vehicles
				</button>
			</div>

			{/* Quick location swap option */}
			{pickupLocation && dropoffLocation && (
				<div className="flex justify-end mb-2">
					<button 
					
						onClick={() => {
							setPickupLocation(dropoffLocation);
							setDropoffLocation(pickupLocation);
						}}
						className="text-xs text-pink-500 hover:text-pink-700 flex items-center"
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
						</svg>
						Swap pickup & dropoff locations
					</button>
				</div>
			)}
		</div>
	);
}
