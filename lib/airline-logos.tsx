// Airline logo utility functions
import Image from "next/image";
import { useState } from "react";

// Airline code to name mapping
export const airlineNames: Record<string, string> = {
  'AA': 'American Airlines',
  'AT': 'Royal Air Maroc',
  'DL': 'Delta Air Lines',
  'UA': 'United Airlines',
  'BA': 'British Airways',
  'LH': 'Lufthansa',
  'AF': 'Air France',
  'KL': 'KLM',
  'EK': 'Emirates',
  'QR': 'Qatar Airways',
  'TK': 'Turkish Airlines',
  'SQ': 'Singapore Airlines',
  'CX': 'Cathay Pacific',
  'JL': 'Japan Airlines',
  'NH': 'ANA',
  'AC': 'Air Canada',
  'VS': 'Virgin Atlantic',
  'IB': 'Iberia',
  'AZ': 'Alitalia',
  'OS': 'Austrian Airlines',
  'LX': 'Swiss International Air Lines',
  'SK': 'SAS',
  'AY': 'Finnair',
  'TP': 'TAP Air Portugal',
  'EI': 'Aer Lingus',
  'WN': 'Southwest Airlines',
  'B6': 'JetBlue Airways',
  'AS': 'Alaska Airlines',
  'F9': 'Frontier Airlines',
  'NK': 'Spirit Airlines',
};

// Function to get airline logo URL from multiple sources
export const getAirlineLogoUrl = (airlineCode: string): string => {
  // Try multiple sources for better reliability
  const sources = [
    // Clearbit logo API (works for major airlines with websites)
    `https://logo.clearbit.com/${getAirlineDomain(airlineCode)}`,
    // Aviationstack (free tier)
    `https://aviationstack.com/img/airline-logos/${airlineCode.toLowerCase()}.png`,
    // Alternative aviation logo service
    `https://content.airhex.com/content/logos/airlines_${airlineCode}_200_200_s.png`,
  ];
  
  return sources[0]; // Start with Clearbit as it's most reliable
};

// Get airline domain for Clearbit API
const getAirlineDomain = (airlineCode: string): string => {
  const domains: Record<string, string> = {
    'AA': 'aa.com',
    'AT': 'royalairmaroc.com',
    'DL': 'delta.com',
    'UA': 'united.com',
    'BA': 'britishairways.com',
    'LH': 'lufthansa.com',
    'AF': 'airfrance.com',
    'KL': 'klm.com',
    'EK': 'emirates.com',
    'QR': 'qatarairways.com',
    'TK': 'turkishairlines.com',
    'SQ': 'singaporeair.com',
    'CX': 'cathaypacific.com',
    'JL': 'jal.co.jp',
    'NH': 'ana.co.jp',
    'AC': 'aircanada.com',
    'VS': 'virgin-atlantic.com',
    'IB': 'iberia.com',
    'AZ': 'alitalia.com',
    'OS': 'austrian.com',
    'LX': 'swiss.com',
    'SK': 'sas.se',
    'AY': 'finnair.com',
    'TP': 'flytap.com',
    'EI': 'aerlingus.com',
    'WN': 'southwest.com',
    'B6': 'jetblue.com',
    'AS': 'alaskaair.com',
    'F9': 'flyfrontier.com',
    'NK': 'spirit.com',
  };
  
  return domains[airlineCode] || `${airlineCode.toLowerCase()}.com`;
};

// Fallback to local logos if API fails
export const getLocalAirlineLogoUrl = (airlineCode: string): string => {
  return `/airline-logos/${airlineCode.toLowerCase()}.png`;
};

// Get airline name from code
export const getAirlineName = (airlineCode: string): string => {
  return airlineNames[airlineCode] || airlineCode;
};

// Component for airline logo with fallback
export const AirlineLogo = ({ 
  airlineCode, 
  className = "w-8 h-8",
  showName = false 
}: { 
  airlineCode: string; 
  className?: string; 
  showName?: boolean;
}) => {
  const [currentSource, setCurrentSource] = useState(0);
  const [showFallback, setShowFallback] = useState(false);
  
  const logoSources = [
    `https://logo.clearbit.com/${getAirlineDomain(airlineCode)}`,
    `https://content.airhex.com/content/logos/airlines_${airlineCode}_200_200_s.png`,
    getLocalAirlineLogoUrl(airlineCode),
  ];

  const handleImageError = () => {
    if (currentSource < logoSources.length - 1) {
      setCurrentSource(currentSource + 1);
    } else {
      setShowFallback(true);
    }
  };

  if (showFallback) {
    // Final fallback to text
    return (
      <div className="flex items-center gap-2">
        <div 
          className={`${className} bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg flex items-center justify-center text-xs font-bold shadow-sm`}
          title={getAirlineName(airlineCode)}
        >
          {airlineCode}
        </div>
        {showName && (
          <span className="text-sm text-gray-600">
            {getAirlineName(airlineCode)}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Image
        src={logoSources[currentSource]}
        alt={`${getAirlineName(airlineCode)} logo`}
        width={32}
        height={32}
        className={`${className} rounded-sm`}
        onError={handleImageError}
        title={getAirlineName(airlineCode)}
        unoptimized // Since we're loading from external sources
      />
      {showName && (
        <span className="text-sm text-gray-600">
          {getAirlineName(airlineCode)}
        </span>
      )}
    </div>
  );
};
