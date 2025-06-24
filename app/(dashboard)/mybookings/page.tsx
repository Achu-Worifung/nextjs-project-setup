'use client'; // only needed if using `app/` directory

import { useState } from 'react';
import { Switch } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

export default function MyBooking() {
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="min-h-screen bg-sky-200 p-10">
      <h1 className="text-3xl font-bold text-center mb-6">
        Welcome [Name] to Your Bookings
      </h1>

      <div className="flex items-center justify-between mb-6 max-w-4xl mx-auto">
        {/* Search Bar */}
        <div className="relative w-full max-w-xl">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search Your For Your Booking"
            className="pl-10 pr-4 py-2 w-full rounded-full border-none shadow focus:outline-none text-gray-700"
          />
        </div>

        {/* Toggle Switch */}
        <div className="ml-4 flex items-center space-x-2">
          <Switch
            checked={enabled}
            onChange={setEnabled}
            className={`${enabled ? 'bg-blue-600' : 'bg-gray-300'}
              relative inline-flex h-6 w-11 items-center rounded-full transition`}
          >
            <span
              className={`${
                enabled ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform bg-white rounded-full transition`}
            />
          </Switch>
          <span className="text-sm text-gray-700">UpComing Bookings</span>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-6xl mx-auto bg-sky-100 rounded-md overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="font-semibold">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Provider</th>
              <th className="px-4 py-3">Amount</th>
            </tr>
          </thead>
          <tbody>
            {/* Example row */}
            {/* Add dynamic rows here */}
          </tbody>
        </table>
      </div>
    </div>
  );
}