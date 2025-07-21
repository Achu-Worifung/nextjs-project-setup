import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { jwtDecode } from "jwt-decode";
import { MapPin, User, Globe, Building2, HomeIcon } from "lucide-react";
import {useAuth} from "@/context/AuthContext"
import { JwtPayload } from 'jsonwebtoken';
import { bookingService } from "@/lib/booking-service";

interface UserData {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  iat?: number;
}

const defaultUserData: UserData = {
  userId: "",
  firstName: "",
  lastName: "",
  email: "",
};


export default function EditProfileForm() {
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const [countries, setCountries] = useState<string[]>( [
        "United States",
        "Canada",
        "United Kingdom",
        "Australia",
        "Germany",
        "France",
        "Japan",
        "Brazil",
        "Mexico",
        "India",
      ]);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [street, setStreet] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");
  const {token, isSignedIn} = useAuth();
  const [decodedToken, setDecodedToken] = useState<JwtPayload | null>(null);


  // Prefill address fields from localStorage or fetch from DB
  useEffect(() => {
    if (token && isSignedIn) {
      try {
        const decoded = jwtDecode(token);
        setDecodedToken(decoded);
      } catch (error) {
        console.error("Error decoding token:", error);
      }

      // Try to load address from localStorage first
      const cached = localStorage.getItem("user_address");
      if (cached) {
        try {
          const addr = JSON.parse(cached);
          setSelectedCountry(addr.country || "");
          setSelectedState(addr.state || "");
          setSelectedCity(addr.city || "");
          setStreet(addr.street || "");
          setZipCode(addr.zipCode || "");
          return;
        } catch (e) {
          // Ignore parse error, fall through to fetch
        }
      }

      // If not in localStorage, fetch from DB
      (async () => {
        const res = await bookingService.getAddress(token);
        if (res && res.addresses && res.addresses.length > 0) {
          const addr = res.addresses[0];
          setSelectedCountry(addr.country || "");
          setSelectedState(addr.state || "");
          setSelectedCity(addr.city || "");
          setStreet(addr.street || "");
          setZipCode(addr.zipcode || addr.zipCode || "");
          // Store in localStorage for future use
          localStorage.setItem("user_address", JSON.stringify({
            country: addr.country || "",
            state: addr.state || "",
            city: addr.city || "",
            street: addr.street || "",
            zipCode: addr.zipcode || addr.zipCode || ""
          }));
        }
      })();
    }
  }, [token, isSignedIn]);



  useEffect(() => {
    if (selectedCountry) {
      setStates([]);
      setSelectedState("");
      setCities([]);
      setSelectedCity("");
      fetchStates(selectedCountry);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState && selectedCountry) {
      setCities([]);
      setSelectedCity("");
      fetchCities(selectedCountry, selectedState);
    }
  }, [selectedState, selectedCountry]);

  const fetchStates = (country: string) => {
    // Mock states data based on country
    const mockStatesData: { [key: string]: string[] } = {
      "United States": [
        "California",
        "Texas",
        "New York",
        "Florida",
        "Illinois",
      ],
      Canada: ["Ontario", "Quebec", "British Columbia", "Alberta", "Manitoba"],
      "United Kingdom": ["England", "Scotland", "Wales", "Northern Ireland"],
      Australia: [
        "New South Wales",
        "Victoria",
        "Queensland",
        "Western Australia",
        "South Australia",
      ],
      Germany: [
        "Bavaria",
        "North Rhine-Westphalia",
        "Baden-Württemberg",
        "Lower Saxony",
        "Hesse",
      ],
    };

    const states = mockStatesData[country] || [];
    setStates(states);
  };

  const fetchCities = (country: string, state: string) => {
    // Mock cities data based on country and state
    const mockCitiesData: { [key: string]: { [key: string]: string[] } } = {
      "United States": {
        California: [
          "Los Angeles",
          "San Francisco",
          "San Diego",
          "Sacramento",
          "Oakland",
        ],
        Texas: ["Houston", "Dallas", "Austin", "San Antonio", "Fort Worth"],
        "New York": [
          "New York City",
          "Buffalo",
          "Rochester",
          "Syracuse",
          "Albany",
        ],
        Florida: ["Miami", "Orlando", "Tampa", "Jacksonville", "Tallahassee"],
        Illinois: ["Chicago", "Aurora", "Peoria", "Rockford", "Springfield"],
      },
      Canada: {
        Ontario: ["Toronto", "Ottawa", "Hamilton", "London", "Windsor"],
        Quebec: ["Montreal", "Quebec City", "Laval", "Gatineau", "Sherbrooke"],
        "British Columbia": [
          "Vancouver",
          "Victoria",
          "Burnaby",
          "Surrey",
          "Richmond",
        ],
      },
    };

    const cities = mockCitiesData[country]?.[state] || [];
    setCities(cities);
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await bookingService.saveAddress({
      country: selectedCountry,
      state: selectedState,
      city: selectedCity,
      street: street,
      zipCode: zipCode,
      token: token || "",
    });

    // Store in localStorage for future use
    localStorage.setItem("user_address", JSON.stringify({
      country: selectedCountry,
      state: selectedState,
      city: selectedCity,
      street: street,
      zipCode: zipCode
    }));

    setIsSubmitting(false);
  };



  return (
    <div className="min-h-screen  py-6  sm:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="   overflow-hidden ">
          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">
            Edit Your Profile
          </h1>
          <p className="text-black text-sm sm:text-base">
            Update your personal information and preferences
          </p>
          <p className="py-1">
            signed in as {decodedToken?.email}
          </p>
          
        </div>
        <hr className="my-6 text-black h-0.5 border border-black" />

        <form onSubmit={handleSubmit} className="">

          <div className="grid grid-cols-1 ">
            {/* Personal Information */}
            <div className=" rounded-xl mt-4">
              <div className="flex items-center mb-6">
                <div className="bg-brand-pink-100 rounded-lg p-2 mr-3">
                  <User className="w-5 h-5 text-brand-pink-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Personal Information
                </h3>
              </div>

              <div className="space-y-5">
                <div className="group">
                  <label className="block text-sm font-medium text-brand-gray-700 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full pl-1 pr-1 py-3   focus:ring-2 focus:ring-brand-pink-500 focus:border-transparent transition-all text-sm sm:text-base rounded-md hover:bg-white focus:bg-white"
                      value={decodedToken?.firstName || decodedToken?.fname || ""}
                      onChange={(e) =>
                        setUserData({ ...userData, firstName: e.target.value })
                      }
                      placeholder="Enter your first name"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-brand-gray-700 mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full pl-1 pr-1 py-3 focus:ring-2 focus:ring-brand-pink-500 focus:border-transparent transition-all text-sm sm:text-base rounded-md cursor-text  "
                      value={decodedToken?.lastName || decodedToken?.lname || ""}
                      onChange={(e) =>
                        setUserData({ ...userData, lastName: e.target.value })
                      }
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-brand-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      className="w-full pl-1 pr-1 py-3 focus:ring-2 focus:ring-brand-pink-500 focus:border-transparent transition-all text-sm sm:text-base rounded-md hover:bg-white focus:bg-white"
                      value={decodedToken?.email || decodedToken?.email || ""}
                      onChange={(e) =>
                        setUserData({ ...userData, email: e.target.value })
                      }
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <hr className="my-6 text-black h-0.5 border border-black" />


            {/* Location Information */}
            <div className="">
              <div className="flex items-center mb-6">
                <div className="bg-purple-100 rounded-lg p-2 mr-3">
                  <MapPin className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Location Details
                </h3>
              </div>

              <div className="space-y-5">
                <div className="group">
                  <label className="block text-sm font-medium text-brand-gray-700 mb-2">
                    Country
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                    <select
                      className="w-full pl-2 pr-8 py-3 rounded-lg border border-brand-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base bg-white/50 backdrop-blur-sm hover:bg-white focus:bg-white appearance-none"
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                    >
                      <option value="">Select your country</option>
                      {countries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-3 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-brand-gray-700 mb-2">
                    State/Province
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                    <select
                      className="w-full pl-2 pr-8 py-3 rounded-lg border border-brand-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base bg-white/50 backdrop-blur-sm hover:bg-white focus:bg-white appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      disabled={!selectedCountry}
                    >
                      <option value="">Select your state/province</option>
                      {states.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-3 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-brand-gray-700 mb-2">
                    City
                  </label>
                  <div className="relative">
                    <HomeIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                    <select
                      className="w-full pl-2 pr-8 py-3 rounded-lg border border-brand-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base bg-white/50 backdrop-blur-sm hover:bg-white focus:bg-white appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      disabled={!selectedState}
                    >
                      <option value="">Select your city</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-3 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Street Input */}
                <div className="group">
                  <label className="block text-sm font-medium text-brand-gray-700 mb-2">
                    Street
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full pl-1 disabled:cursor-not-allowed pr-1 py-3 focus:ring-2 focus:ring-brand-pink-500 focus:border-transparent transition-all text-sm sm:text-base rounded-md hover:bg-white focus:bg-white"
                      value={street || ""}
                      onChange={e => setStreet(e.target.value)}
                      placeholder="Enter your street address"
                      required
                      disabled={!selectedCity && !selectedState && !selectedCountry}
                    />
                  </div>
                </div>

                {/* Zip Code Input */}
                <div className="group">
                  <label className="block text-sm font-medium text-brand-gray-700 mb-2">
                    Zip Code
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full pl-1 disabled:cursor-not-allowed pr-1 py-3 focus:ring-2 focus:ring-brand-pink-500 focus:border-transparent transition-all text-sm sm:text-base rounded-md hover:bg-white focus:bg-white"
                      value={zipCode || ""}
                      onChange={e => setZipCode(e.target.value)}
                      placeholder="Enter your zip code"
                      required
                      disabled={!selectedCity && !selectedState && !selectedCountry}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">

            <Button
              type="submit"
              variant="default"
              className="w-full sm:w-auto px-6 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}


