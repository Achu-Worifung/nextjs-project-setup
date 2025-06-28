import { HotelData } from './types';
import { hotel_type } from './types';
import { generateHotels } from './hotel-generator';

/**
 * Converts HotelData from the hotel generator to hotel_type expected by the search page
 */
export function mapHotelDataToHotelType(hotelData: HotelData, checkInDate: string, checkOutDate: string): hotel_type {
  const basePrice = hotelData.rooms[0]?.pricePerNight || 150;
  const nights = Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24));
  const totalPrice = basePrice * Math.max(nights, 1);
  
  // Generate some mock photo URLs
  const photoUrls = [
    '/des1.jpg',
    '/des2.jpg', 
    '/des4.jpg',
    '/des5.webp',
    '/des6.png',
    '/des7.webp'
  ];

  // Generate realistic benefit badges based on hotel features
  const generateBenefitBadges = (hotelData: HotelData) => {
    const badges = [];
    
    // Always include some basic amenities
    badges.push({
      text: 'Free WiFi',
      variant: 'positive',
      explanation: 'Complimentary high-speed internet',
      identifier: 'free_wifi'
    });

    // Random chance for other amenities
    if (Math.random() < 0.6) {
      badges.push({
        text: 'Free Parking',
        variant: 'positive',
        explanation: 'Complimentary on-site parking',
        identifier: 'free_parking'
      });
    }

    if (hotelData.rooms.some(room => room.includes.breakfast)) {
      badges.push({
        text: 'Free Breakfast',
        variant: 'positive',
        explanation: 'Complimentary continental breakfast',
        identifier: 'free_breakfast'
      });
    }

    if (hotelData.name.toLowerCase().includes('resort') || hotelData.name.toLowerCase().includes('aqua')) {
      badges.push({
        text: 'Swimming Pool',
        variant: 'positive',
        explanation: 'Outdoor swimming pool available',
        identifier: 'swimming_pool'
      });
    }

    if (Math.random() < 0.4) {
      badges.push({
        text: 'Fitness Center',
        variant: 'positive',
        explanation: '24/7 fitness center access',
        identifier: 'fitness_center'
      });
    }

    if (Math.random() < 0.5) {
      badges.push({
        text: 'Restaurant',
        variant: 'positive',
        explanation: 'On-site dining available',
        identifier: 'restaurant'
      });
    }

    if (Math.random() < 0.3) {
      badges.push({
        text: 'Airport Shuttle',
        variant: 'positive',
        explanation: 'Complimentary airport transportation',
        identifier: 'airport_shuttle'
      });
    }

    return badges;
  };

  return {
    hotel_id: hotelData.id,
    accessibilityLabel: hotelData.accessibilityLabel,
    property: {
      countryCode: 'US',
      mainPhotoId: 1,
      photoUrls,
      longitude: -74.0059 + (Math.random() - 0.5) * 0.1, // NYC area with some variance
      latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
      currency: 'USD',
      reviewCount: hotelData.reviewSummary.totalReviews,
      qualityClass: Math.floor(hotelData.reviewSummary.averageRating),
      reviewScoreWord: getReviewScoreWord(hotelData.reviewSummary.averageRating),
      blockIds: ['block1', 'block2'],
      propertyClass: Math.floor(hotelData.reviewSummary.averageRating),
      checkout: {
        fromTime: hotelData.policies.checkOut.time,
        untilTime: hotelData.policies.checkOut.time,
      },
      name: hotelData.name,
      isFirstPage: true,
      ufi: hotelData.id,
      checkin: {
        fromTime: hotelData.policies.checkIn.startTime,
        untilTime: hotelData.policies.checkIn.endTime,
      },
      rankingPosition: Math.floor(Math.random() * 100) + 1,
      id: hotelData.id,
      wishlistName: '',
      accuratePropertyClass: Math.floor(hotelData.reviewSummary.averageRating),
      checkoutDate: checkOutDate,
      checkinDate: checkInDate,
      reviewScore: hotelData.reviewSummary.averageRating,
      optOutFromGalleryChanges: 0,
      position: Math.floor(Math.random() * 100) + 1,
      priceBreakdown: {
        strikethroughPrice: hotelData.rooms[0]?.originalPrice ? {
          currency: 'USD',
          value: hotelData.rooms[0].originalPrice * Math.max(nights, 1),
        } : undefined,
        benefitBadges: generateBenefitBadges(hotelData),
        grossPrice: {
          currency: 'USD',
          value: totalPrice,
        },
        excludedPrice: {
          value: hotelData.fees.resortFeePerNight * Math.max(nights, 1),
          currency: 'USD',
        },
        taxExceptions: [],
      },
    },
  };
}

function getReviewScoreWord(score: number): string {
  if (score >= 9) return 'Exceptional';
  if (score >= 8) return 'Excellent';
  if (score >= 7) return 'Very Good';
  if (score >= 6) return 'Good';
  if (score >= 5) return 'Average';
  return 'Poor';
}

/**
 * Generates hotels with location-specific characteristics
 */
export function generateLocationSpecificHotels(city: string, count: number = 15): hotel_type[] {
  const generatedHotels = generateHotels(count);
  
  const now = new Date();
  const checkInDate = new Date(now.setDate(now.getDate() + 1)).toISOString().split('T')[0];
  const checkOutDate = new Date(now.setDate(now.getDate() + 8)).toISOString().split('T')[0];
  
  return generatedHotels.map((hotel: HotelData) => {
    // Modify hotel names to be more location-specific
    const locationAdjustedHotel = {
      ...hotel,
      name: adjustHotelNameForLocation(hotel.name, city),
      address: `${hotel.address}, ${city}`,
    };
    
    return mapHotelDataToHotelType(locationAdjustedHotel, checkInDate, checkOutDate);
  });
}

function adjustHotelNameForLocation(hotelName: string, city: string): string {
  const cityKeywords: { [key: string]: string[] } = {
    'new york': ['Manhattan', 'Brooklyn', 'Times Square', 'Central Park'],
    'los angeles': ['Hollywood', 'Beverly Hills', 'Santa Monica', 'Downtown LA'],
    'chicago': ['Magnificent Mile', 'River North', 'Loop', 'Lincoln Park'],
    'miami': ['South Beach', 'Biscayne Bay', 'Ocean Drive', 'Art Deco'],
    'san francisco': ['Union Square', 'Fisherman\'s Wharf', 'Nob Hill', 'SOMA'],
    'las vegas': ['Strip', 'Downtown', 'Fremont', 'Casino'],
    'orlando': ['Disney World', 'Universal', 'International Drive', 'Lake Buena Vista'],
    'seattle': ['Pike Place', 'Capitol Hill', 'Belltown', 'Queen Anne'],
  };
  
  const normalizedCity = city.toLowerCase();
  const keywords = cityKeywords[normalizedCity] || [city];
  const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
  
  // Sometimes add the location keyword to the hotel name
  if (Math.random() < 0.4) {
    return `${hotelName} ${randomKeyword}`;
  }
  
  return hotelName;
}
