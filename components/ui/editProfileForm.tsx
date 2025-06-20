import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function EditProfileForm() {
  const [countries, setCountries] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
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
    if (selectedState) {
      setCities([]);
      setSelectedCity("");
      fetchCities(selectedCountry, selectedState);
    }
  }, [selectedState]);

  const fetchCountries = async () => {
    const res = await fetch("https://countriesnow.space/api/v0.1/countries/positions");
    const data = await res.json();
    setCountries(data.data.map((c: any) => c.name));
  };

  const fetchStates = async (country: string) => {
    const res = await fetch("https://countriesnow.space/api/v0.1/countries/states", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country }),
    });
    const data = await res.json();
    setStates(data.data.states.map((s: any) => s.name));
  };

  const fetchCities = async (country: string, state: string) => {
    const res = await fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country, state }),
    });
    const data = await res.json();
    setCities(data.data);
  };

  return (
    <main className="flex-1 p-10 pl-60 ">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-bold">Edit profile</h1>
        </div>
      </header>

      <form className="grid grid-cols-2 gap-6 max-w-4xl">
        <div>
          <label className="block font-medium">First Name</label>
          <input
            type="text"
            className="mt-1 w-full p-2 border rounded bg-white"
          />
        </div>

        <div>
          <label className="block font-medium">Middle Name</label>
          <input
            type="text"
            className="mt-1 w-full p-2 border rounded bg-white"
            placeholder="Enter middle name"
          />
        </div>

        <div>
          <label className="block font-medium">Last Name</label>
          <input
            type="text"
            className="mt-1 w-full p-2 border rounded bg-white"
          />
        </div>
        <div className="">
          <label className="block font-medium center-text pl-18">Change Profile Picture</label>
          <div className="flex">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              className="w-15 h-15 rounded-full ml-30"
              alt="Profile"
            />
          </div>
        </div>

        <div className="col-span-2">
          <label className="block font-medium">Email</label>
          <div className="relative">
            <input
              type="email"
              className="mt-1 w-full p-2 pr-10 border rounded bg-white"
            />
            <span className="absolute right-2 top-3 text-green-500">✔️</span>
          </div>
        </div>

        <div className="col-span-2">
          <label className="block font-medium">Address</label>
          <input
            type="text"
            className="mt-1 w-full p-2 border rounded bg-white"
          />
        </div>

        <div className="col-span-2">
          <label className="block font-medium ">Contact Number</label>
          <input
            type="text"
            className="mt-1 w-full p-2 border rounded bg-white"
          />
        </div>

        <div>
          <label className="block font-medium">Country</label>
          <select
            className="mt-1 w-full p-2 border rounded bg-white"
            value={selectedCountry}
            onChange={e => setSelectedCountry(e.target.value)}
          >
            <option value="">Select country</option>
            {countries.map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">State</label>
          <select
            className="mt-1 w-full p-2 border rounded bg-white"
            value={selectedState}
            onChange={e => setSelectedState(e.target.value)}
            disabled={!selectedCountry}
          >
            <option value="">Select state</option>
            {states.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">City</label>
          <select
            className="mt-1 w-full p-2 border rounded bg-white"
            value={selectedCity}
            onChange={e => setSelectedCity(e.target.value)}
            disabled={!selectedState}
          >
            <option value="">Select city</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Postal Code</label>
          <input
            type="text"
            className="mt-1 w-full p-2 border rounded bg-white"
            placeholder="Enter postal code"
          />
        </div>
        <div className="col-span-2">
          <label className="block font-medium">Password</label>
          <div className="relative">
            <input
              type="password"
              className="mt-1 w-full p-2 pr-10 border rounded bg-white"
            />
            <span className="absolute right-2 top-3 text-green-500">✔️</span>
          </div>
        </div>

        <div className="col-span-2 flex gap-4">
          <Button
            type="button"
            variant="secondary"
            disabled
            className="cursor-not-allowed"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="default"
          >
            Save
          </Button>
        </div>
      </form>
    </main>
  );
}