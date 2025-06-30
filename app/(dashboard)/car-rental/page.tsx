import { SelectVehicle } from "@/components/ui/select-vehicle";

export default function CarRentalPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Perfect Rental Car</h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Search our wide selection of rental vehicles to find the perfect match for your journey.
          Compare prices, features, and availability in real-time.
        </p>
      </div>
      
      <SelectVehicle />
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <div className="w-12 h-12 mx-auto bg-pink-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Booking Process</h3>
          <p className="text-gray-600">Book your rental car in just a few clicks with our streamlined process.</p>
        </div>
        
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <div className="w-12 h-12 mx-auto bg-pink-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">24/7 Customer Support</h3>
          <p className="text-gray-600">Our team is available around the clock to assist with any questions or concerns.</p>
        </div>
        
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <div className="w-12 h-12 mx-auto bg-pink-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Flexible Payment Options</h3>
          <p className="text-gray-600">Choose from multiple payment methods to suit your preferences and needs.</p>
        </div>
      </div>
    </div>
  );
}
