"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronRight, ChevronLeft, Hotel } from "lucide-react";
import { HotelDestinationCard } from "@/components/ui/hotel-destination-card";
import { useTheme } from "next-themes";

export function TopHotels() {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const firstItemRef = useRef<HTMLDivElement>(null);
  const lastItemRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const topHotels = [
    {
      image: "/des1.jpg",
      title: "Sunset Resort",
      price: 120,
      description: "A serene beachfront resort perfect for relaxation.",
      location: "Malibu, California",
      capacity: 2,
      days: "3 nights",
    },
    {
      image: "/des2.jpg",
      title: "Mountain Lodge",
      price: 95,
      description: "A cozy mountain lodge surrounded by scenic views.",
      location: "Aspen, Colorado",
      capacity: 4,
      days: "5 nights",
    },
    {
      image: "/des4.jpg",
      title: "City Central Hotel",
      price: 150,
      description:
        "Modern hotel in the heart of the city with great amenities.",
      location: "New York, NY",
      capacity: 3,
      days: "2 nights",
    },
    {
      image: "/des6.png",
      title: "Desert Oasis",
      price: 110,
      description:
        "A tranquil escape in the desert with stunning architecture.",
      location: "Sedona, Arizona",
      capacity: 2,
      days: "4 nights",
    },
    
    {
      image: "/des6.png",
      title: "Desert Oasis",
      price: 110,
      description:
        "A tranquil escape in the desert with stunning architecture.",
      location: "Sedona, Arizona",
      capacity: 2,
      days: "4 nights",
    },
  ];

  // Set up Intersection Observer to detect scroll boundaries
  useEffect(() => {
    const container = containerRef.current;
    const firstItem = firstItemRef.current;
    const lastItem = lastItemRef.current;

    if (!container || !firstItem || !lastItem) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === firstItem) {
            // If first item is fully visible, can't scroll left
            setCanScrollLeft(!entry.isIntersecting);
          }
          if (entry.target === lastItem) {
            // If last item is fully visible, can't scroll right
            setCanScrollRight(!entry.isIntersecting);
          }
        });
      },
      {
        root: container,
        threshold: 1.0, // Item is fully visible
        rootMargin: "0px",
      }
    );

    observer.observe(firstItem);
    observer.observe(lastItem);

    return () => {
      observer.disconnect();
    };
  }, []);

  const scrollLeft = useCallback(() => {
    if (containerRef.current && canScrollLeft) {
      containerRef.current.scrollBy({
        left: -280,
        behavior: "smooth",
      });
    }
  }, [canScrollLeft]);

  const scrollRight = useCallback(() => {
    if (containerRef.current && canScrollRight) {
      containerRef.current.scrollBy({
        left: 280,
        behavior: "smooth",
      });
    }
  }, [canScrollRight]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 dark:py-10">
      <div className="grid grid-cols-2 items-center justify-between w-full mb-4 dark:mb-6">
        <span>
          <h1 className="text-xl font-bold text-brand-pink-500 dark:text-brand-pink-400 flex "><Hotel/>Top Hotels</h1>
          <h1 className={`text-3xl md:text-4xl font-bold leading-tight ${
              theme === "dark" ? "text-white" : "text-brand-gray-900"
            }`}>Explore top hotels</h1>
        </span>        
        <span className="flex items-end justify-end gap-2">
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`size-9 rounded-full border-2 border-brand-pink-500 dark:border-brand-pink-400 text-white hover:bg-brand-pink-600 dark:hover:bg-brand-pink-500 transition-colors duration-300 flex items-center justify-center cursor-pointer dark:hover:shadow-brand-dark dark:hover:glow-brand-pink hover:scale-105 ${
              canScrollLeft ? 'bg-brand-pink-500 dark:bg-brand-pink-500' : 'bg-brand-gray-300 dark:bg-brand-gray-300 border-brand-gray-300 dark:border-brand-gray-300 cursor-not-allowed'
            }`}
          >
            <ChevronLeft />
          </button>
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`size-9 rounded-full border-2 border-brand-pink-500 dark:border-brand-pink-400 text-white hover:bg-brand-pink-600 dark:hover:bg-brand-pink-500 transition-colors duration-300 flex items-center justify-center cursor-pointer dark:hover:shadow-brand-dark dark:hover:glow-brand-pink hover:scale-105 ${
              canScrollRight ? 'bg-brand-pink-500 dark:bg-brand-pink-500' : 'bg-brand-gray-300 dark:bg-brand-gray-300 border-brand-gray-300 dark:border-brand-gray-300 cursor-not-allowed'
            }`}
          >
            <ChevronRight />
          </button>
        </span>
      </div>      <div className="relative">
        <div
          ref={containerRef}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          className="flex gap-6 overflow-x-auto pb-4 dark:pb-6 scrollbar-hide"
        >
          {topHotels.map((hotel, index) => (
            <div 
              key={index} 
              className="flex-shrink-0"
              ref={index === 0 ? firstItemRef : index === topHotels.length - 1 ? lastItemRef : undefined}
            >
              <HotelDestinationCard
                image={hotel.image}
                title={hotel.title}
                price={hotel.price}
                description={hotel.description}
                location={hotel.location}
                capacity={hotel.capacity}
                days={hotel.days}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


