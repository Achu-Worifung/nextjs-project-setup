import { MapPinHouse, User, MoveRight, Star, Wifi, Car, Coffee } from 'lucide-react';

export function HotelDestinationCard({
  image, 
  title,
  price,
  description,
  location,
  capacity,
  days,
}: {
  image: string;
  title: string;
  price: number;
  description: string;
  days: string;
  key?: string | number;
  location: string;
  capacity: number;
}) {
  return (
    <div className="group relative flex flex-col bg-white dark:bg-[rgb(25,30,36)] rounded-2xl shadow-lg hover:shadow-2xl dark:shadow-brand-dark-lg dark:hover:shadow-brand-dark-xl transition-all duration-500 ease-in-out h-[450px] w-[300px] cursor-pointer overflow-hidden">
      {/* Image Section with Overlay */}
      <div className="relative h-[50%] overflow-hidden rounded-t-2xl">
        {/* This div is now the one that scales */}
        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-brand-gray-200 dark:to-brand-gray-300 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
          <div className="text-center text-brand-pink-600 dark:text-brand-pink-400">
            <div className="text-4xl mb-2">🏨</div>
            <p className="text-sm font-medium px-4 text-brand-gray-700 dark:text-brand-gray-700">{title}</p>
          </div>
        </div>
        {/* Overlay is a sibling of the scaling image, so it won't scale itself, but its opacity changes */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent dark:from-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Rating Badge - Remains static relative to the card */}
        <div className="absolute top-4 left-4 bg-white/90 dark:bg-brand-overlay/95 rounded-full px-3 py-1 flex items-center gap-1 backdrop-blur-sm z-10 dark:shadow-brand-dark">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-semibold text-brand-gray-900 dark:text-brand-gray-700">4.8</span>
        </div>
        
        {/* Amenities - Remain static relative to the card */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <div className="bg-white/90 dark:bg-brand-overlay/95 rounded-full p-1.5 backdrop-blur-sm dark:shadow-brand-dark">
            <Wifi className="h-3 w-3 text-brand-gray-600 dark:text-brand-gray-700" />
          </div>
          <div className="bg-white/90 dark:bg-brand-overlay/95 rounded-full p-1.5 backdrop-blur-sm dark:shadow-brand-dark">
            <Car className="h-3 w-3 text-brand-gray-600 dark:text-brand-gray-700" />
          </div>
          <div className="bg-white/90 dark:bg-brand-overlay/95 rounded-full p-1.5 backdrop-blur-sm dark:shadow-brand-dark">
            <Coffee className="h-3 w-3 text-brand-gray-600 dark:text-brand-gray-700" />
          </div>
        </div>
        
        {/* Days Badge - Remains static relative to the card */}
        <div className="absolute bottom-4 left-4 bg-blue-600 dark:bg-brand-pink-500 text-white px-3 py-1 rounded-full text-xs font-medium z-10 dark:shadow-brand-dark dark:glow-brand-pink">
          {days}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col justify-between p-5 bg-white dark:bg-[rgb(25,30,36)]">
        <div className="space-y-3">
          <div>
            <h3 className="text-xl font-bold text-brand-gray-900 dark:text-brand-gray-900 transition-colors duration-300 group-hover:text-brand-pink-600 dark:group-hover:text-brand-pink-400 line-clamp-1">
              {title}
            </h3>
            <p className="text-sm text-brand-gray-600 dark:text-brand-gray-600 mt-1 line-clamp-2 transition-colors duration-300 group-hover:text-brand-gray-700 dark:group-hover:text-brand-gray-700">
              {description}
            </p>
          </div>
          
          {/* Location and Capacity */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-brand-gray-300">
            <div className="flex items-center gap-1 text-brand-gray-500 dark:text-brand-gray-600 transition-all duration-300 group-hover:text-brand-pink-600 dark:group-hover:text-brand-pink-400">
              <MapPinHouse className="h-4 w-4" />
              <span className="text-xs font-medium truncate max-w-[140px]">{location}</span>
            </div>
            <div className="flex items-center gap-1 text-brand-gray-500 dark:text-brand-gray-600 transition-all duration-300 group-hover:text-brand-pink-600 dark:group-hover:text-brand-pink-400">
              <User className="h-4 w-4" />
              <span className="text-xs font-medium">{capacity} guests</span>
            </div>
          </div>
        </div>

        {/* Price and Book Button */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-brand-gray-300">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-brand-gray-900 dark:text-brand-gray-900 transition-colors duration-300 group-hover:text-brand-pink-600 dark:group-hover:text-brand-pink-400">
                ${price}
              </span>
              <span className="text-sm text-brand-gray-500 dark:text-brand-gray-600 font-medium">/ night</span>
            </div>
            <span className="text-xs text-gray-400 dark:text-brand-gray-500">+ taxes & fees</span>
          </div>
          
          <button className="group/btn relative bg-gradient-to-r from-blue-600 to-blue-700 dark:from-brand-pink-500 dark:to-brand-pink-600 hover:from-blue-700 hover:to-blue-800 dark:hover:from-brand-pink-400 dark:hover:to-brand-pink-500 text-white px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg dark:hover:shadow-brand-dark dark:glow-brand-pink flex items-center gap-2">
            <span className="text-sm font-medium">Book Now</span>
            <MoveRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
            <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
      
      {/* Subtle glow on hover - Enhanced for dark mode */}
      <div className="absolute inset-0 rounded-2xl dark:group-hover:glow-brand-pink transition-all duration-500 pointer-events-none"></div>
    </div>
  );
}

