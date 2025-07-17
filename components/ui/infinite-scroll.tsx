"use client";
import { useRef } from "react";

export function InfiniteScroll() {
  const logosRef = useRef<HTMLUListElement>(null);

  return (
    <div className="relative font-inter antialiased w-screen">
      <main className="relative min-h-fit flex flex-col justify-center bg-slate-900 overflow-hidden">
        <div className="w-full max-w-5xl mx-auto px-4 md:px-6 py-10">
          <div className="text-center">
            {/* Header */}
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Trusted by Leading Travel Brands
              </h2>
              <p className="text-slate-400 text-lg">
                Join thousands of satisfied travelers who trust these platforms
              </p>
            </div>            
            <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
              <div className="flex animate-infinite-scroll">
                <ul
                  ref={logosRef}
                  className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none whitespace-nowrap"
                >
                  <li>
                    <div className="text-2xl font-bold text-white/80">
                      Booking.com
                    </div>
                  </li>
                  <li>
                    <div className="text-2xl font-bold text-white/80">
                      Expedia
                    </div>
                  </li>
                  <li>
                    <div className="text-2xl font-bold text-white/80">Airbnb</div>
                  </li>
                  <li>
                    <div className="text-2xl font-bold text-white/80">
                      TripAdvisor
                    </div>
                  </li>
                  <li>
                    <div className="text-2xl font-bold text-white/80">
                      Hotels.com
                    </div>
                  </li>
                  <li>
                    <div className="text-2xl font-bold text-white/80">Kayak</div>
                  </li>
                  <li>
                    <div className="text-2xl font-bold text-white/80">
                      Skyscanner
                    </div>
                  </li>
                  <li>
                    <div className="text-2xl font-bold text-white/80">Agoda</div>
                  </li>
                </ul>
                {/* Duplicate for seamless scroll */}
                <ul
                  className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none whitespace-nowrap"
                  aria-hidden="true"
                >
                  <li>
                    <div className="text-2xl font-bold text-white/80">
                      Booking.com
                    </div>
                  </li>
                  <li>
                    <div className="text-2xl font-bold text-white/80">
                      Expedia
                    </div>
                  </li>
                  <li>
                    <div className="text-2xl font-bold text-white/80">Airbnb</div>
                  </li>
                  <li>
                    <div className="text-2xl font-bold text-white/80">
                      TripAdvisor
                    </div>
                  </li>
                  <li>
                    <div className="text-2xl font-bold text-white/80">
                      Hotels.com
                    </div>
                  </li>
                  <li>
                    <div className="text-2xl font-bold text-white/80">Kayak</div>
                  </li>
                  <li>
                    <div className="text-2xl font-bold text-white/80">
                      Skyscanner
                    </div>
                  </li>
                  <li>
                    <div className="text-2xl font-bold text-white/80">Agoda</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


