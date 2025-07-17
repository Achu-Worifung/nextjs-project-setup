// import Image from "next/image";
// import {ModeToggle} from "@/components/mode-to-toggle";
// import {MyPlane} from "@/components/ui/my-plane";
// import { FlightSelection } from "@/components/ui/flight-selection";
'use client';
import {TopDestinations} from "@/components/ui/top-destinations";
import { TopHotels } from "@/components/ui/top-hotels";
import { InfiniteScroll } from "@/components/ui/infinite-scroll";
import { TravelPoint } from "@/components/ui/travel-point";
import { Footer } from "@/components/ui/footer";
import {FlightSelection} from "@/components/ui/flight-selection";
import { SelectVehicle } from "@/components/ui/select-vehicle";
import { SelectHotel } from "@/components/ui/select-hotel";
import {useState, useEffect} from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels' | 'vehicles'>('flights');

  // Handle hash changes for direct navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'hotels' || hash === 'vehicles' || hash === 'flights') {
        setActiveTab(hash);
      }
    };

    // Check initial hash on mount
    handleHashChange();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Update URL hash when tab changes
  const handleTabChange = (tab: 'flights' | 'hotels' | 'vehicles') => {
    setActiveTab(tab);
    window.history.pushState(null, '', `#${tab}`);
  };

  const renderBookingComponent = () => {
    switch (activeTab) {
      case 'flights':
        return <FlightSelection />;
      case 'hotels':
        return <SelectHotel />;
      case 'vehicles':
        return <SelectVehicle />;
      default:
        return <FlightSelection />;
    }
  };
  return (
    <div className="w-full flex flex-col items-center justify-center px-6 pt-10">
      {/* Tab Navigation */}
      <div className="w-full max-w-7xl ">
        <div className="flex justify-center">
          <div className="inline-flex bg-brand-gray-100 rounded-lg p-1 my-2">
            <button
              onClick={() => handleTabChange('flights')}
              className={`px-6 py-1 text-sm font-medium rounded-md transition-all ${
                activeTab === 'flights'
                  ? 'bg-white text-pink-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 hover:dark:text-gray-100'
              }`}
            >
              ✈️ Flights
            </button>
            <button
              onClick={() => handleTabChange('hotels')}
              className={`px-6 py-1 text-sm font-medium rounded-md transition-all ${
                activeTab === 'hotels'
                  ? 'bg-white text-pink-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 hover:dark:text-gray-100'
              }`}
            >
              🏨 Hotels
            </button>
            <button
              onClick={() => handleTabChange('vehicles')}
              className={`px-6 py-1 text-sm font-medium rounded-md transition-all ${
                activeTab === 'vehicles'
                  ? 'bg-white text-pink-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 hover:dark:text-gray-100'
              }`}
            >
              🚗 Vehicles
            </button>
          </div>
        </div>
      </div>

      {/* Booking Component */}
      <div className="w-full mb-12">
        {renderBookingComponent()}
      </div>

      {/* Additional Sections */}
      <TopDestinations />
      <TopHotels />
      <InfiniteScroll />
      <TravelPoint />
      <Footer />
    </div>
  );
}

