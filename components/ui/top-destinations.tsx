'use client';

import { ChevronRight, ChevronLeft, Plane } from "lucide-react";
import { DestinationCard } from "@/components/ui/destination-card";
import { useState, useRef, useEffect, useCallback } from "react";
import { useTheme } from "next-themes";

export function TopDestinations() {
  const { theme } = useTheme();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const firstItemRef = useRef<HTMLDivElement>(null);
  const lastItemRef = useRef<HTMLDivElement>(null);

  const destinations = [
    {
      image: "/des1.jpg",
      title: "Rome, Italy",
      price: "2.3",
      days: "7 days",
      description: "Explore ancient history and stunning architecture in the Eternal City"
    },
    {
      image: "/des5.webp",
      title: "Kyoto, Japan",
      price: "3.4",
      days: "10 days",
      description: "Discover traditional temples, zen gardens, and authentic Japanese culture"
    },
    {
      image: "/des4.jpg",
      title: "London, UK",
      price: "2.8",
      days: "7 days",
      description: "Experience royal heritage, world-class museums, and vibrant city life"
    },
    {
      image: "/des6.png",
      title: "Sydney, Australia",
      price: "4.2",
      days: "12 days",
      description: "Enjoy iconic landmarks, beautiful beaches, and unique wildlife"
    },
    {
      image: "/des2.jpg",
      title: "Paris, France",
      price: "3.1",
      days: "8 days",
      description: "Romance, art, cuisine, and the city of lights await you"
    },
    {
      image: "/des7.webp",
      title: "Bali, Indonesia",
      price: "1.8",
      days: "14 days",
      description: "Tropical paradise with stunning beaches and rich cultural heritage"
    }
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
    <div className="w-full max-w-7xl mx-auto px-4 py-8 pt-16">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div className="mb-4 md:mb-0">
          <div className="flex items-center gap-2 mb-2">
            <Plane className="w-5 h-5 text-pink-500" />
            <span className="text-pink-500 font-semibold text-sm uppercase tracking-wide">
              Top Destinations
            </span>
          </div>
          <h2
            className={`text-3xl md:text-4xl font-bold leading-tight ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Explore top destinations
          </h2>
          <p className="text-gray-600 mt-2 max-w-md">
            Discover amazing places around the world with our curated collection of premium destinations
          </p>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex items-center gap-3">
          {/* <div className="flex items-center gap-2 mr-4">
            {Array.from({ length: Math.ceil(destinations.length / itemsPerView) }).map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  Math.floor(currentIndex / itemsPerView) === index
                    ? 'bg-pink-500 w-6'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div> */}          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`group relative size-9 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
              !canScrollLeft
                ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                : 'border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white hover:shadow-lg hover:scale-105'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`group relative size-9 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
              !canScrollRight
                ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                : 'border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white hover:shadow-lg hover:scale-105'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>      {/* Destinations Grid */}
      <div className="relative">
        <div
          ref={containerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {destinations.map((destination, index) => (
            <div 
              key={index} 
              className="flex-shrink-0"
              ref={index === 0 ? firstItemRef : index === destinations.length - 1 ? lastItemRef : undefined}
            >
              <DestinationCard
                image={destination.image}
                title={destination.title}
                price={destination.price}
                days={destination.days}
                description={destination.description}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      
    </div>
  );
}
