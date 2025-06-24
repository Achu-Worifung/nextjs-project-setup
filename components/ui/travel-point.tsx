'use client';

import Image from "next/image";
import { Star } from "lucide-react";
import { useTheme } from "next-themes";
export function TravelPoint() {
    const { theme } = useTheme();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 items-center py-4  w-11/12 md:w-9/12">
      <div className="relative min-h-[350px] sm:min-h-[400px] ml-5 md:block hidden">
        <Image
          src="/rome.svg"
          alt="Rome"
          width={250}
          height={280}
          className="object-cover rounded-lg shadow-lg absolute top-0 left-0 z-10 w-[60%] h-auto max-w-[200px] sm:max-w-[250px]"
        />
        <Image
          src="/dubai.svg"
          alt="Dubai"
          width={250}
          height={280}
          className="object-cover rounded-lg shadow-lg absolute top-16 sm:top-20 left-16 sm:left-20 z-20 w-[60%] h-auto max-w-[200px] sm:max-w-[250px]"
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xl  text-pink-600">Travel Points</p>
        <p className={`text-3xl md:text-4xl font-bold leading-tight ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}>
          We help you find your <br /> dream destination
        </p>
        <p className="text-base text-left">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit
          possimus deleniti necessitatibus provident! Reprehenderit sed harum
          illo ab assumenda aspernatur dolore autem obcaecati, quo in saepe
          nesciunt, natus distinctio doloremque?
        </p>
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-pink-500 mb-1">
              50+
            </div>
            <div className="text-gray-600 text-sm">Destinations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-pink-500 mb-1">
              10k+
            </div>
            <div className="text-gray-600 text-sm">Happy Travelers</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <span className="text-2xl md:text-3xl font-bold text-pink-500">
                4.9
              </span>
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            </div>
            <div className="text-gray-600 text-sm">Rating</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-pink-500 mb-1">
              24/7
            </div>
            <div className="text-gray-600 text-sm">Support</div>
          </div>
        </div>
      </div>
    </div>
  );
}
