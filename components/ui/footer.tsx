import { Facebook, X, Instagram } from "lucide-react";
import Image from "next/image";
export function Footer() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Brand and Social Section */}
        <div className="flex flex-col gap-4 text-center lg:text-left">
          <span className="flex items-center gap-2 justify-center lg:justify-start">
            <Image src="/logo.svg" alt="logo" width={40} height={40} />
            <p className="font-bold text-xl sm:text-2xl">Infosys | Booking</p>
          </span>
          <p className="text-sm sm:text-base text-brand-gray-500 max-w-md mx-auto lg:mx-0">
            © 2025 Infosys Booking. All rights reserved.
          </p>
          <span className="[&>button]:bg-white [&>button]:border [&>button]:border-brand-gray-300 [&>button]:rounded-full [&>button]:p-2 [&>button]:hover:bg-brand-gray-100 flex items-center gap-2 mt-4 justify-center lg:justify-start">
            <button aria-label="Facebook">
              <Facebook className="h-5 w-5" />
            </button>
            <button aria-label="Instagram">
              <Instagram className="h-5 w-5" />
            </button>
            <button aria-label="Twitter">
              <X className="h-5 w-5" />
            </button>
          </span>
        </div>

        {/* Links Section */}
        <div className="w-full">
          {/* Desktop Table View */}
          <div className="hidden sm:block">
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th className="pb-4 font-bold text-lg lg:text-2xl">About</th>
                  <th className="pb-4 font-bold text-lg lg:text-2xl">Products</th>
                  <th className="pb-4 font-bold text-lg lg:text-2xl">Other</th>
                </tr>
              </thead>
              <tbody className="text-brand-gray-600">
                <tr>
                  <td className="py-2 hover:text-brand-pink-500 cursor-pointer transition-colors">How to Book</td>
                  <td className="py-2 hover:text-brand-pink-500 cursor-pointer transition-colors">Flights</td>
                  <td className="py-2 hover:text-brand-pink-500 cursor-pointer transition-colors">Blog</td>
                </tr>
                <tr>
                  <td className="py-2 hover:text-brand-pink-500 cursor-pointer transition-colors">Contact Us</td>
                  <td className="py-2 hover:text-brand-pink-500 cursor-pointer transition-colors">Hotels</td>
                  <td className="py-2 hover:text-brand-pink-500 cursor-pointer transition-colors">Privacy Notice</td>
                </tr>
                <tr>
                  <td className="py-2 hover:text-brand-pink-500 cursor-pointer transition-colors">Help Center</td>
                  <td className="py-2 hover:text-brand-pink-500 cursor-pointer transition-colors">Trains</td>
                  <td className="py-2"></td>
                </tr>
                <tr>
                  <td className="py-2 hover:text-brand-pink-500 cursor-pointer transition-colors">Career</td>
                  <td className="py-2 hover:text-brand-pink-500 cursor-pointer transition-colors">Villas</td>
                  <td className="py-2"></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile Column View */}
          <div className="block sm:hidden space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-3 text-center">About</h3>
              <div className="space-y-2 text-center">
                <div className="py-1 hover:text-brand-pink-500 cursor-pointer transition-colors text-brand-gray-600">How to Book</div>
                <div className="py-1 hover:text-brand-pink-500 cursor-pointer transition-colors text-brand-gray-600">Contact Us</div>
                <div className="py-1 hover:text-brand-pink-500 cursor-pointer transition-colors text-brand-gray-600">Help Center</div>
                <div className="py-1 hover:text-brand-pink-500 cursor-pointer transition-colors text-brand-gray-600">Career</div>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3 text-center">Products</h3>
              <div className="space-y-2 text-center">
                <div className="py-1 hover:text-brand-pink-500 cursor-pointer transition-colors text-brand-gray-600">Flights</div>
                <div className="py-1 hover:text-brand-pink-500 cursor-pointer transition-colors text-brand-gray-600">Hotels</div>
                <div className="py-1 hover:text-brand-pink-500 cursor-pointer transition-colors text-brand-gray-600">Trains</div>
                <div className="py-1 hover:text-brand-pink-500 cursor-pointer transition-colors text-brand-gray-600">Villas</div>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3 text-center">Other</h3>
              <div className="space-y-2 text-center">
                <div className="py-1 hover:text-brand-pink-500 cursor-pointer transition-colors text-brand-gray-600">Blog</div>
                <div className="py-1 hover:text-brand-pink-500 cursor-pointer transition-colors text-brand-gray-600">Privacy Notice</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


