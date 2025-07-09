import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { jwtDecode } from "jwt-decode";
import { MapPin, Mail, User, Globe, Building2, HomeIcon } from "lucide-react";

interface UserData {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  iat?: number;
}

const defaultUserData: UserData = {
  userId: '',
  firstName: '',
  lastName: '',
  email: '',
};


export default function EditProfileForm() {
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [profileImage, setProfileImage] = useState<string>("https://randomuser.me/api/portraits/men/32.jpg");

  useEffect(() => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODliZjUxMy1lOTQ3LTQzZDQtODhiMy02ZjJmOWRjMDUxMjQiLCJmaXJzdE5hbWUiOiJBbGFuIiwibGFzdE5hbWUiOiJSaXZlcmEiLCJlbWFpbCI6ImFsYW5yaXZlcmExMjM0QGdtYWlsLmNvbSIsImlhdCI6MTc1MTkyMDY2MH0.Cj8uz2jBPnz0H9hKh97dLghYqeQcu_LLh0Td33NM0Qc';
    
    const initializeProfile = () => {
      try {
        // Decode JWT token to get user data
        const decoded = jwtDecode(token) as UserData;
        setUserData(decoded);
        
        console.log('Decoded JWT payload:', decoded);
      } catch (error) {
        console.error('Error decoding token:', error);
        // Fallback to default data if token is invalid
        setUserData(defaultUserData);
      }
      
      // Mock countries data
      const mockCountries = [
        'United States',
        'Canada',
        'United Kingdom',
        'Australia',
        'Germany',
        'France',
        'Japan',
        'Brazil',
        'Mexico',
        'India'
      ];
      
      setCountries(mockCountries);
      setLoading(false);
    };

    initializeProfile();
  }, []);

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
      'United States': ['California', 'Texas', 'New York', 'Florida', 'Illinois'],
      'Canada': ['Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Manitoba'],
      'United Kingdom': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
      'Australia': ['New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'South Australia'],
      'Germany': ['Bavaria', 'North Rhine-Westphalia', 'Baden-Württemberg', 'Lower Saxony', 'Hesse']
    };
    
    const states = mockStatesData[country] || [];
    setStates(states);
  };

  const fetchCities = (country: string, state: string) => {
    // Mock cities data based on country and state
    const mockCitiesData: { [key: string]: { [key: string]: string[] } } = {
      'United States': {
        'California': ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'Oakland'],
        'Texas': ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth'],
        'New York': ['New York City', 'Buffalo', 'Rochester', 'Syracuse', 'Albany'],
        'Florida': ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Tallahassee'],
        'Illinois': ['Chicago', 'Aurora', 'Peoria', 'Rockford', 'Springfield']
      },
      'Canada': {
        'Ontario': ['Toronto', 'Ottawa', 'Hamilton', 'London', 'Windsor'],
        'Quebec': ['Montreal', 'Quebec City', 'Laval', 'Gatineau', 'Sherbrooke'],
        'British Columbia': ['Vancouver', 'Victoria', 'Burnaby', 'Surrey', 'Richmond']
      }
    };
    
    const cities = mockCitiesData[country]?.[state] || [];
    setCities(cities);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call delay
    setTimeout(() => {
      console.log('Profile updated successfully (mock):', {
        userId: userData.userId,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        country: selectedCountry,
        state: selectedState,
        city: selectedCity,
        profileImage
      });
      setIsSubmitting(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-6 px-4 sm:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 px-6 py-8 sm:px-10 sm:py-12">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Edit Your Profile</h1>
              <p className="text-blue-100 text-sm sm:text-base">Update your personal information and preferences</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 lg:p-10">
            {/* Profile Image Section */}
            <div className="mb-8 sm:mb-12 flex flex-col items-center">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative">
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-white shadow-2xl"
                  />
                  <label htmlFor="profile-image" className="absolute bottom-1 right-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-2.5 cursor-pointer shadow-lg hover:scale-110 transform transition-all duration-200 group">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </label>
                </div>
                <input
                  type="file"
                  id="profile-image"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm sm:text-base font-medium text-gray-700">Profile Picture</p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Click the edit icon to update your photo</p>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 sm:gap-10">
              {/* Personal Information */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 sm:p-8 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-100 rounded-lg p-2 mr-3">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
                </div>
                
                <div className="space-y-5">
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        type="text"
                        className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base bg-white/50 backdrop-blur-sm hover:bg-white focus:bg-white"
                        value={userData.firstName}
                        onChange={e => setUserData({ ...userData, firstName: e.target.value })}
                        placeholder="Enter your first name"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        type="text"
                        className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base bg-white/50 backdrop-blur-sm hover:bg-white focus:bg-white"
                        value={userData.lastName}
                        onChange={e => setUserData({ ...userData, lastName: e.target.value })}
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        type="email"
                        className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base bg-white/50 backdrop-blur-sm hover:bg-white focus:bg-white"
                        value={userData.email}
                        onChange={e => setUserData({ ...userData, email: e.target.value })}
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-xl p-6 sm:p-8 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="bg-purple-100 rounded-lg p-2 mr-3">
                    <MapPin className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Location Details</h3>
                </div>
                
                <div className="space-y-5">
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                      <select
                        className="w-full pl-11 pr-8 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base bg-white/50 backdrop-blur-sm hover:bg-white focus:bg-white appearance-none"
                        value={selectedCountry}
                        onChange={e => setSelectedCountry(e.target.value)}
                      >
                        <option value="">Select your country</option>
                        {countries.map(country => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State/Province
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                      <select
                        className="w-full pl-11 pr-8 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base bg-white/50 backdrop-blur-sm hover:bg-white focus:bg-white appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                        value={selectedState}
                        onChange={e => setSelectedState(e.target.value)}
                        disabled={!selectedCountry}
                      >
                        <option value="">Select your state/province</option>
                        {states.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <div className="relative">
                      <HomeIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                      <select
                        className="w-full pl-11 pr-8 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base bg-white/50 backdrop-blur-sm hover:bg-white focus:bg-white appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                        value={selectedCity}
                        onChange={e => setSelectedCity(e.target.value)}
                        disabled={!selectedState}
                      >
                        <option value="">Select your city</option>
                        {cities.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                className="w-full sm:w-auto px-6 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}