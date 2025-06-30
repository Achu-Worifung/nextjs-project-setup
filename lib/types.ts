export type flight_type = {
  name: string;
};

export type hotel_type = {
  hotel_id: number;
  accessibilityLabel: string;
  property: {
    countryCode: string;
    mainPhotoId: number;
    photoUrls: string[];
    longitude: number;
    latitude: number;
    currency: string;
    reviewCount: number;
    qualityClass: number;
    reviewScoreWord: string;
    blockIds: string[];
    propertyClass: number;
    checkout: {
      fromTime: string;
      untilTime: string;
    };
    name: string;
    isFirstPage: boolean;
    ufi: number;
    checkin: {
      fromTime: string;
      untilTime: string;
    };
    rankingPosition: number;
    id: number;
    wishlistName: string;
    accuratePropertyClass: number;
    checkoutDate: string;
    checkinDate: string;
    reviewScore: number;
    optOutFromGalleryChanges: number;
    position: number;
    priceBreakdown: {
      strikethroughPrice?: {
        currency: string;
        value: number;
      };

      benefitBadges: {
        text: string;
        variant: string;
        explanation: string;
        identifier: string;
      }[];
      grossPrice: {
        currency: string;
        value: number;
      };
      excludedPrice: {
        value: number;
        currency: string;
      };
      taxExceptions: unknown[]; 
    };
  };
};


export type authContextType = 
{
  token: string | null;
  setToken: (token: string | null) => void;
  isSignedIn: boolean;
}


//--------------------------------------------------------------------
// this is the type for the hotel details response from the API

type Icon = {
  icon: string;
  size?: number;
};

type PropertyHighlight = {
  context: number;
  name: string;
  icon_list: Icon[];
};

type Facility = {
  icon: string;
  name: string;
};

type TopBenefit = {
  icon: string;
  translated_name: string;
};

type HouseRule = {
  icon: string;
  title: string;
  type: string;
  description: string;
};

type CheckinMethodAdditionalInfoLocation = {
  off_location: number;
};

type CheckinMethodAdditionalInfo = {
  location: CheckinMethodAdditionalInfoLocation;
};

type CheckinMethod = {
  updated_by_script: string | null;
  external_references: any[]; // unknown structure
  stream_variation_name: string;
  unit_id: number;
  updated_at: string;
  checkin_method: string;
  stream_name: string;
  created_at: string;
  additional_info: CheckinMethodAdditionalInfo;
};

type BookingHome = {
  is_vacation_rental: number;
  group: string;
  is_aparthotel: number;
  quality_class: number | null;
  is_single_unit_property: number;
  is_booking_home: number;
  segment: number;
  house_rules: HouseRule[];
  keycollection_how_to_collect: string;
  checkin_methods: CheckinMethod[];
  is_single_type_property: number;
};

type AggregatedData = {
  common_kitchen_fac: any[]; // unknown structure
  has_seating: number;
  has_refundable: number;
  has_nonrefundable: number;
  has_kitchen: number;
};

type LastReservation = {
  countrycode: string | null;
  time: string;
  country: string | null;
};

type FacilityCancelBreakfast = {
  facility_id: number;
};

type BreakfastReviewScore = {
  review_count: number;
  review_score: number;
  review_score_word: string;
  review_number: number;
  review_snippet: string;
  rating: number;
};

type WifiReviewScore = {
  rating: number;
};

type MinRoomDistribution = {
  children: any[]; // unknown structure, empty array in example
  adults: number;
};

type HotelImportantInformationWithCode = {
  phrase: string;
  executing_phase: number;
  sentence_id?: number;
};

type RawDataCheckinCheckout = {
  untilTime: string;
  fromTime: string;
};

type RawData = {
  currency: string;
  wishlistName: string;
  isSoldout: boolean;
  checkoutDate: string;
  reviewScoreWord: string;
  latitude: number;
  isHighlightedHotel: boolean;
  rankingPosition: number;
  mainPhotoId: number;
  ufi: number;
  photoUrls: string[];
  name: string;
  reviewCount: number;
  propertyClass: number;
  optOutFromGalleryChanges: number;
  reviewScore: number;
  qualityClass: number;
  countryCode: string;
  checkin: RawDataCheckinCheckout;
  checkout: RawDataCheckinCheckout;
  isFirstPage: boolean;
  longitude: number;
  id: number;
  checkinDate: string;
  position: number;
  blockIds: number[];
  accuratePropertyClass: number;
};

export interface HotelDetails {
  ufi: number;
  hotel_id: number;
  hotel_name: string;
  url: string;
  hotel_name_trans: string;
  review_nr: number;
  arrival_date: string;
  departure_date: string;
  price_transparency_mode: string;
  accommodation_type_name: string;
  latitude: number;
  longitude: number;
  address: string;
  address_trans: string;
  city: string;
  city_trans: string;
  city_in_trans: string;
  city_name_en: string;
  district: number | null;
  countrycode: string;
  distance_to_cc: number;
  default_language: string;
  country_trans: string;
  currency_code: string;
  zip: string;
  timezone: string;
  soldout: number;
  available_rooms: number;
  max_rooms_in_reservation: number;
  average_room_size_for_ufi_m2: string;
  is_family_friendly: number;
  is_closed: number;
  is_crimea: number;
  is_hotel_ctrip: number;
  is_price_transparent: number;
  is_genius_deal: number;
  qualifies_for_no_cc_reservation: number;
  hotel_include_breakfast: number;
  cc1: string;
  family_facilities: string[];
  property_highlight_strip: PropertyHighlight[];
  facilities_block: {
    type: string;
    facilities: Facility[];
    name: string;
  };
  top_ufi_benefits: TopBenefit[];
  languages_spoken: {
    languagecode: string[];
  };
  spoken_languages: string[];
  breakfast_review_score: BreakfastReviewScore;
  wifi_review_score: WifiReviewScore;
  min_room_distribution: MinRoomDistribution;
  booking_home: BookingHome;
  aggregated_data: AggregatedData;
  last_reservation: LastReservation;
  free_facilities_cancel_breakfast: FacilityCancelBreakfast[];
  hotel_text: Record<string, unknown>;
  districts: number[];
  preferences: any[];
  hotel_important_information_with_codes: HotelImportantInformationWithCode[];
  block: any[];
  rawData: RawData;
}
//--------------------------------------------------FLIGHT GENERATOR TYPES---------------------------------

export type FlightClass = 'Economy' | 'Business' | 'First';

export interface StopDetail {
  airport: string;
  arrivalTime: string;
  departureTime: string;
  layoverDuration: string;
}

export interface Flight {
  airline: string;
  flightNumber: string;
  departureAirport: string;
  destinationAirport: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  numberOfStops: number;
  stops: StopDetail[];
  status: 'On Time' | 'Delayed' | 'Cancelled';
  aircraft: string;
  gate: string;
  terminal: string;
  meal: boolean;
  availableSeats: Record<FlightClass, number>;
  prices: Record<FlightClass, number>;
  bookingUrl: string;
}
// ----------------------------------------------------------------------------------------------------------------------

// ---------------------------------------HOTEL GENERATOR TYPES-----------------------------
export type Vendor = 'Hilton' | 'Marriott' | 'Hyatt' | 'Wyndham' | 'Choice Hotels' | 'InterContinental' | 'Accor' | 'Radisson Hotel Group' | 'Best Western Hotels & Resorts' | 'IHG Hotels & Resorts' | 'Rosewood Hotel Group' | 'Four Seasons Hotels and Resorts' | 'MGM Resorts International' | 'Shangri-La Hotels and Resorts' | 'Minor Hotels' | 'NH Hotel Group' | 'Banyan Tree Group';

export interface RoomDetails {
  type: string;
  pricePerNight: number;
  originalPrice?: number; // for strike-through savings
  includes: {
    breakfast: boolean;
    lunch: boolean;
  };
  mostPopular?: boolean;
  accessibleFeatures: string[];
  cancellationPolicy: string;
  availableRooms: number;
  bedCount: number;
}

export interface Attraction {
  name: string;
  type: 'Beach' | 'Restaurant' | 'Downtown' | 'Museum' | 'Ocean View' | 'Washer/Dryer' | 'Market' | 'Park' | 'Landmark' | 'Family Attraction' | 'Shopping' | 'Transit' | 'Sport' | 'Entertainment' | 'Nature' | 'Walking Area' | 'Attraction' | 'Business' | 'Education';
  distanceKm: number;
}

export interface Review {
  username: string;
  rating: number;
  comment: string;
  date: string;
}

export interface HotelPolicy {
  checkIn: {
    startTime: string;
    endTime: string;
    contactless: boolean;
    express: boolean;
    minAge: number;
  };
  checkOut: {
    time: string;
    contactless: boolean;
    express: boolean;
    lateFeeApplicable: boolean;
  };
  petsAllowed: boolean;
  childrenPolicy: string;
  extraBeds: string;
  cribAvailability: string;
  accessMethods: string[];
  safetyFeatures: string[];
  housekeepingPolicy: string;
}

export interface FeeInfo {
  depositPerNight: number;
  resortFeePerNight: number;
  breakfastFeeRange: [number, number];
  parkingFeePerDay: number;
  lateCheckoutFee: number;
}

export interface HotelData {
  id: number;
  vendor: Vendor;
  name: string;
  address: string;
  description: string;
  rooms: RoomDetails[];
  attractionsNearby: Attraction[];
  accessibilityLabel: string;
  reviewSummary: {
    averageRating: number;
    totalReviews: number;
    breakdown: Record<'cleanliness' | 'location' | 'comfort' | 'staff' | 'value', number>;
  };
  reviews: Review[];
  policies: HotelPolicy;
  fees: FeeInfo;
  finePrint: string;
  faqs: { question: string; answer: string }[];
}