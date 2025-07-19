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
    // Removed hover:scale-[1.02] and hover:-translate-y-3 from the main div
    <div className="group relative flex flex-col bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 ease-in-out h-[450px] w-[300px] cursor-pointer overflow-hidden border border-gray-100">
      {/* Favorite Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-3 right-3 p-2 z-50 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200 shadow-lg"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </button>

        {/* Price Badge */}
        <div className="absolute top-3 left-3 px-3 py-1 z-50 bg-pink-500 text-white rounded-full text-sm font-semibold shadow-lg">
          ${price}k
        </div>
      
      {/* Image Container */}
      <div className="relative w-full h-[70%] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          // The image itself will scale on group hover
          className={`object-cover transition-all duration-300 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        {!imageLoaded && (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center animate-pulse">
            <div className="w-12 h-12 bg-gray-400 rounded-full opacity-50" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1">
            {title}
          </h3>
          {description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {description}
            </p>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-gray-500">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{days}</span>
          </div>
          <div className="flex items-center gap-1 text-pink-500">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">Explore</span>
          </div>
        </div>
      </div>
    </div>
  )
}