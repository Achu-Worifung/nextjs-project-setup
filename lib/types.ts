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
