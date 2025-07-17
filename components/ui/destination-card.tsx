'use client';
import { MapPin, Clock, Heart } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface DestinationCardProps {
  image: string;
  title: string;
  price: string;
  days: string;
  description?: string;
}

export function DestinationCard({
  image,
  title,
  price,
  days,
  description
}: DestinationCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    // Enhanced with proper dark mode support - using specific dark utilities
    <div className="group relative flex flex-col bg-white dark:bg-[rgb(25,30,36)] rounded-2xl shadow-lg hover:shadow-2xl dark:shadow-brand-dark-lg dark:hover:shadow-brand-dark-xl transition-all duration-500 ease-in-out h-[450px] w-[300px] cursor-pointer overflow-hidden">
      {/* Favorite Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-3 right-3 p-2 z-50 rounded-full bg-white/80 dark:bg-brand-overlay/90 backdrop-blur-sm hover:bg-white dark:hover:bg-brand-overlay transition-all duration-200 shadow-lg dark:shadow-brand-dark"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isLiked ? 'fill-brand-error text-brand-error' : 'text-brand-gray-600 dark:text-brand-gray-600'
            }`}
          />
        </button>

        {/* Price Badge */}
        <div className="absolute top-3 left-3 px-3 py-1 z-50 bg-brand-pink-500 dark:bg-brand-pink-500 text-white rounded-full text-sm font-semibold shadow-lg dark:shadow-brand-dark dark:glow-brand-pink">
          ${price}k
        </div>
      
      {/* Image Container */}
      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-brand-gray-200 dark:to-brand-gray-300 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
          <div className="text-center text-brand-pink-600 dark:text-brand-pink-400">
            <div className="text-4xl mb-2">🎯</div>
            <p className="text-sm font-medium px-4 text-brand-gray-700 dark:text-white">{title}</p>
          </div>
        </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col justify-between bg-white dark:bg-[rgb(25,30,36)]">
        <div>
          <h3 className="font-bold text-brand-gray-900 dark:text-white text-lg mb-2 line-clamp-1">
            {title}
          </h3>
          {description && (
            <p className="text-brand-gray-600 dark:text-brand-gray-300 text-sm mb-3 line-clamp-2">
              {description}
            </p>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-brand-gray-500 dark:text-brand-gray-400">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{days}</span>
          </div>
          <div className="flex items-center gap-1 text-brand-pink-500 dark:text-brand-pink-400">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">Explore</span>
          </div>
        </div>
      </div>
      
      {/* Dark mode glow effect */}
      <div className="absolute inset-0 rounded-2xl dark:group-hover:glow-brand-pink transition-all duration-500 pointer-events-none"></div>
    </div>
  )
}

