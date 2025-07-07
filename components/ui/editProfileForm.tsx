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
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODliZjUxMy1lOTQ3LTQzZDQtODhiMy02ZjJmOWRjMDUxMjQiLCJmaXJzdE5hbWUiOiJBbGFuIiwibGFzdE5hbWUiOiJSaXZlcmEiLCJlbWFpbCI6ImFsYW5yaXZlcmExMjM0QGdtYWlsLmNvbSIsImlhdCI6MTc1MTkwNTUyNn0.a9X9xQ8FSscdOKxjHG16Yp1huMKm42HGXyX07sDrN-Q';
    
    try {
      const decoded = jwtDecode(token) as UserData;
      setUserData(decoded);
    } catch (error) {
      console.error('Error decoding token:', error);
    } finally {
      setLoading(false);
    }
    
    fetchCountries();
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

  const fetchCountries = async () => {
    try {
      const res = await fetch("https://countriesnow.space/api/v0.1/countries/positions");
      const data = await res.json();
      if (data.error) {
        console.error('Error fetching countries:', data.msg);
        return;
      }
      setCountries(data.data.map((c: any) => c.name));
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const fetchStates = async (country: string) => {
    try {
      const res = await fetch("https://countriesnow.space/api/v0.1/countries/states", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country }),
      });
      const data = await res.json();
      if (data.error) {
        console.error('Error fetching states:', data.msg);
        return;
      }
      setStates(data.data.states.map((s: any) => s.name));
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  const fetchCities = async (country: string, state: string) => {
    try {
      const res = await fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country, state }),
      });
      const data = await res.json();
      if (data.error) {
        console.error('Error fetching cities:', data.msg);
        return;
      }
      setCities(data.data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
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
    try {
      console.log('Form submitted with data:', {
        ...userData,
        country: selectedCountry,
        state: selectedState,
        city: selectedCity,
        profileImage
      });
      // Add your form submission logic here
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-6">
            <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8">
            {/* Profile Image Section */}
            <div className="mb-8 flex flex-col items-center">
              <div className="relative">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <label htmlFor="profile-image" className="absolute bottom-0 right-0 bg-indigo-500 rounded-full p-2 cursor-pointer shadow-lg hover:bg-indigo-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </label>
                <input
                  type="file"
                  id="profile-image"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">Click the edit icon to change your profile picture</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <User className="inline-block w-4 h-4 mr-2" />
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    value={userData.firstName}
                    onChange={e => setUserData({ ...userData, firstName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <User className="inline-block w-4 h-4 mr-2" />
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    value={userData.lastName}
                    onChange={e => setUserData({ ...userData, lastName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Mail className="inline-block w-4 h-4 mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    value={userData.email}
                    onChange={e => setUserData({ ...userData, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Globe className="inline-block w-4 h-4 mr-2" />
                    Country
                  </label>
                  <select
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    value={selectedCountry}
                    onChange={e => setSelectedCountry(e.target.value)}
                  >
                    <option value="">Select a country</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Building2 className="inline-block w-4 h-4 mr-2" />
                    State/Province
                  </label>
                  <select
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    value={selectedState}
                    onChange={e => setSelectedState(e.target.value)}
                    disabled={!selectedCountry}
                  >
                    <option value="">Select a state</option>
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <HomeIcon className="inline-block w-4 h-4 mr-2" />
                    City
                  </label>
                  <select
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    value={selectedCity}
                    onChange={e => setSelectedCity(e.target.value)}
                    disabled={!selectedState}
                  >
                    <option value="">Select a city</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-8 flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                className="px-6 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
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