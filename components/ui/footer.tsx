import { Facebook, X, Instagram } from "lucide-react";
import Image from "next/image";
export function Footer() {
  return (
    <div className="w-full grid grid-cols-2 items-start justify-around pb-10 w-10/12">
      <div className="pl-5 flex flex-col gap-4">
        <span className="flex items-center gap-2 justify-start">
          <Image src="/logo.svg" alt="logo" width={40} height={40} />
          <p className="font-bold text-2xl">Infosys | Booking</p>
        </span>
        <p className="text-sm/5 text-gray-500 w-10/12">
        © 2025 Infosys Booking. All rights reserved.
        </p>
        <span className="[&>button]:bg-white [&>button]:border [&>button]:border-gray-300 [&>button]:rounded-full [&>button]:p-2 [&>button]:hover:bg-gray-100 flex items-center gap-2 mt-4">
          <button>
            <Facebook className="h-5 w-5" />
          </button>
          <button>
            <Instagram className="h-5 w-5" />
          </button>
          <button>
            <X className="h-5 w-5" />
          </button>
        </span>
      </div>      <div className="w-full pt-1">
        <table className="w-11/12">
          <thead>
            <tr className="text-left">
              <th className="pb-4 font-bold text-2xl">About</th>
              <th className="pb-4 font-bold text-2xl">Products</th>
              <th className="pb-4 font-bold text-2xl">Other</th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            <tr>
              <td className="py-2 hover:text-pink-500 cursor-pointer">How to Book</td>
              <td className="py-2 hover:text-pink-500 cursor-pointer">Flights</td>
              <td className="py-2 hover:text-pink-500 cursor-pointer">Blog</td>
            </tr>
            <tr>
              <td className="py-2 hover:text-pink-500 cursor-pointer">Contact Us</td>
              <td className="py-2 hover:text-pink-500 cursor-pointer">Hotels</td>
              <td className="py-2 hover:text-pink-500 cursor-pointer">Privacy Notice</td>
            </tr>
            <tr>
              <td className="py-2 hover:text-pink-500 cursor-pointer">Help Center</td>
              <td className="py-2 hover:text-pink-500 cursor-pointer">Trains</td>
              <td className="py-2"></td>
            </tr>
            <tr>
              <td className="py-2 hover:text-pink-500 cursor-pointer">Career</td>
              <td className="py-2 hover:text-pink-500 cursor-pointer">Villas</td>
              <td className="py-2"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
