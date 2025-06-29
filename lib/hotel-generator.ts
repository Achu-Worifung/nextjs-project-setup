import { HotelData, Vendor, RoomDetails, Attraction, Review } from './types';

function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const hotelNames = [
  'Azure Coast Retreat', 'Golden Bay Suites', 'CityView Inn', 'Palm Garden Lodge',
  'Ocean Breeze Hotel', 'Downtown Deluxe', 'Harbor Haven', 'Skyline Resort',
  'Desert Rose Oasis', 'Mountain Crest Lodge', 'Riverside Rendezvous',
  'The Grand Central', 'Sunset Serenity Suites', 'Aqua Vista Resort',
  'The Urban Nook', 'Tranquil Pines Inn', 'Crimson Sky Hotel',
  'Sapphire Sands Resort', 'Emerald Gardens Hotel', 'Pinnacle Peak Lodge',
  'Canyon Ridge Inn', 'Starfall Hotel & Suites', 'Lakeview Manor',
  'The Gilded Compass', 'Vivid Bloom Resort', 'Orchid Heights Hotel',
  'Moonlit Cove Inn', 'Terra Nova Suites',
  'The Obsidian Palace', 'Whispering Pines Resort', 'Metropolitan Grand',
  'Coral Sands Beachfront', 'Stone Creek Inn', 'The Beacon Hotel',
  'Harmony Heights Retreat', 'Silver Stream Lodge', 'Olympus Towers',
  'Mystic Falls Hotel', 'The Royal Bloom', 'Copperleaf Residences',
  'Zephyr Sands Resort', 'Polaris Grand Hotel', 'Ironwood Manor',
  'The Sanctuary Suites', 'Cascading Waters Hotel', 'The Velvet Sparrow Inn'
];

const descriptions = [
  'A luxurious stay near the city’s heart, featuring modern rooms and exceptional service.',
  'Coastal bliss with scenic views and beach access.',
  'Budget-friendly comfort close to major attractions and public transit.',
  'Perfect for families and business travelers alike.',
  'Contemporary hotel with full-service dining and rooftop views.',
  'Nestled in a peaceful desert landscape, offering a serene escape with stunning views.',
  'An eco-friendly retreat with lush gardens and sustainable practices.',
  'Historic charm meets modern convenience in this beautifully restored hotel.',
  'Ideal for adventurers, with easy access to hiking trails and outdoor activities.',
  'Sophisticated urban living with state-of-the-art facilities and vibrant nightlife nearby.',
  'Family-friendly resort featuring a water park, kids\' club, and diverse dining options.',
  'Exclusive boutique hotel offering personalized service and unique, artfully designed rooms.',
  'Overlooking the tranquil lake, a perfect spot for relaxation and water sports.',
  'Experience unparalleled luxury with personalized concierge service and gourmet dining.',
  'A vibrant and artistic hotel, perfect for creatives and those seeking inspiration.',
  'Comfortable and convenient, located just minutes from the airport with shuttle service.',
  'Charming countryside inn offering a cozy atmosphere and delicious home-cooked meals.',
  'Modern design meets ultimate comfort in this new downtown hotspot.',
  'Discover a hidden gem offering unparalleled tranquility, complete with a private beach and holistic wellness programs.',
  'The quintessential business hotel, providing state-of-the-art conference facilities, executive lounges, and seamless connectivity.',
  'Immerse yourself in local culture at this charming guesthouse, a short walk from historical landmarks and bustling markets.',
  'An all-inclusive paradise designed for ultimate relaxation, featuring multiple pools, gourmet restaurants, and evening entertainment.',
  'Your home away from home, these spacious suites come with fully equipped kitchens and separate living areas, perfect for extended stays.',
  'Perched high above the city, enjoy panoramic skyline views from every room, complemented by a Michelin-starred restaurant and a rooftop bar.',
  'A pet-friendly establishment that goes above and beyond, offering pet amenities, designated play areas, and special treats for your furry friends.',
  'Experience sustainable luxury at its finest, with locally sourced cuisine, solar-powered facilities, and a commitment to environmental preservation.',
  'This vibrant and trendy hotel boasts unique themed rooms, a lively lobby bar, and is situated in the heart of the city\'s entertainment district.',
  'Designed for the discerning traveler, our hotel features bespoke services, an exclusive members-only lounge, and direct access to high-end shopping.',
];

const reviewsPool = [
  { text: 'Exceptional service and spotless rooms. Truly a five-star experience!', rating: 5 },
  { text: 'Amazing ocean view and very clean! Woke up to paradise every day.', rating: 5 },
  { text: 'Would definitely stay again. Loved the breakfast spread; so many options!', rating: 4 },
  { text: 'Not bad for the price, especially given the good location. A solid choice.', rating: 3 },
  { text: 'Super friendly staff and cozy rooms. Felt very welcomed from arrival to departure.', rating: 4 },
  { text: 'Close to everything important. Comfortable beds ensured a great night\'s sleep.', rating: 4 },
  { text: 'Decent amenities overall, and elevator access was really helpful for our luggage.', rating: 3 },
  { text: 'A bit noisy at night due to its very central location, but otherwise excellent.', rating: 3 },
  { text: 'Loved the smart locks and seamless check-in process. Very modern and efficient.', rating: 5 },
  { text: 'Fantastic pool area and friendly poolside service. The kids absolutely loved it!', rating: 5 },
  { text: 'The hotel restaurant had delicious food and a truly great atmosphere for dinner.', rating: 4 },
  { text: 'Quiet and relaxing, perfect for a peaceful getaway. Just what we needed.', rating: 5 },
  { text: 'Great value for money, genuinely exceeded my expectations for a budget stay.', rating: 4 },
  { text: 'Rooms were spacious and very well maintained, felt fresh and clean.', rating: 4 },
  { text: 'The concierge was incredibly helpful with local tips and reservations. Top-notch assistance.', rating: 5 },
  { text: 'Internet was fast and reliable, which was a huge plus for work and streaming.', rating: 4 },
  { text: 'Parking was a bit tight, especially on busy nights, but we always found a spot eventually.', rating: 3 },
  { text: 'Beautiful decor and very comfortable beds. Felt like a luxury stay without the huge price tag.', rating: 5 },
  { text: 'An excellent choice for business travel; quiet, efficient, and well-equipped for meetings.', rating: 4 },
  { text: 'Loved the direct beach access, truly wonderful to step right onto the sand!', rating: 5 },
  { text: 'My only complaint was the slow check-in process; took longer than expected.', rating: 2 },
  { text: 'The breakfast buffet was absolutely outstanding! Best I\'ve had in a hotel in years.', rating: 5 },
  { text: 'Perfect for a family vacation, lots for the kids to do and great family-friendly amenities.', rating: 4 },
  { text: 'Surprisingly quiet given its central location. Managed to get good rest despite being downtown.', rating: 4 },
  { text: 'Could use an update in some areas, but still very clean and functional for a short stay.', rating: 3 },
  { text: 'The gym facilities were top-notch and well-maintained. A great bonus for fitness enthusiasts.', rating: 4 },
  { text: 'Hassle-free stay from start to finish. Staff went above and beyond to assist us.', rating: 5 },
  { text: 'The view from our balcony was absolutely breathtaking. Worth every penny!', rating: 5 },
  { text: 'Definitely recommend this place for a romantic escape; very charming and private.', rating: 5 },
  { text: 'A bit far from major attractions, requiring taxis or public transport, but very peaceful.', rating: 3 },
  { text: 'Excellent amenities for pets, truly pet-friendly with dedicated areas and treats.', rating: 5 },
  { text: 'Room service was quick and the food was hot and delicious every time.', rating: 4 },
  { text: 'Enjoyed the evening entertainment in the lobby, added a nice touch to the stay.', rating: 4 },
  { text: 'Minor issue with the AC, but it was quickly resolved by maintenance.', rating: 3 },
  { text: 'The beds were incredibly comfortable, honestly the best sleep I\'ve had in ages!', rating: 5 },
  { text: 'Walking distance to many shops and restaurants, made exploring easy and fun.', rating: 4 },
  { text: 'Good security measures in place, felt very safe throughout our stay.', rating: 4 },
  { text: 'Loved the complimentary happy hour! A great way to unwind after a day of sightseeing.', rating: 5 },
  { text: 'Friendly front desk staff but the wait for elevators was often long, especially during peak hours.', rating: 3 },
  { text: 'The hotel grounds are beautiful and meticulously kept, felt very luxurious.', rating: 5 },
  // New Reviews
  { text: 'Housekeeping was inconsistent; skipped our room one day, which was disappointing.', rating: 2 },
  { text: 'The spa facilities were a wonderful addition, very relaxing and well-managed.', rating: 5 },
  { text: 'Our room had a slight mildew smell, but it wasn\'t terrible enough to complain.', rating: 2 },
  { text: 'The kids\' club was a lifesaver! Our children had a fantastic time and were well cared for.', rating: 5 },
  { text: 'Located right next to a busy road, so expect some traffic noise, even on higher floors.', rating: 2 },
  { text: 'The bar staff were incredibly attentive and made excellent cocktails.', rating: 4 },
  { text: 'Pillows were a bit too soft for my liking, but that\'s a minor personal preference.', rating: 3 },
  { text: 'The shuttle service was punctual and very convenient for getting to the convention center.', rating: 4 },
  { text: 'We had an issue with a noisy neighbor, but the front desk handled it promptly and professionally.', rating: 4 },
  { text: 'The decor felt a bit dated, but everything was clean and functional.', rating: 3 },
  { text: 'Absolutely loved the rooftop pool and bar! Perfect for enjoying the sunset.', rating: 5 },
  { text: 'The coffee shop in the lobby was a great perk for a quick morning pick-me-up.', rating: 4 },
  { text: 'Valet parking was efficient and friendly, though a bit pricey.', rating: 3 },
  { text: 'The view was partially obstructed by another building, which wasn\'t clear from the booking description.', rating: 2 },
  { text: 'Every staff member we encountered was genuinely kind and helpful. Outstanding hospitality!', rating: 5 },
  { text: 'The restaurant portions were small for the price, but the quality of food was high.', rating: 3 },
  { text: 'Had a wonderful time exploring the nearby attractions, very convenient location for tourists.', rating: 4 },
  { text: 'The check-out process was quick and smooth, no complaints there.', rating: 4 },
  { text: 'Unfortunately, the hot water pressure was quite low during our stay.', rating: 2 },
  { text: 'The communal areas were beautifully designed and comfortable.', rating: 4 }
];

export function generateHotel(): HotelData {
  const id = getRandomInt(10000, 99999);
  const name = getRandom(hotelNames);
  const description = getRandom(descriptions);
  const vendor: Vendor = getRandom(['Hilton', 'Marriott', 'Hyatt', 'Wyndham', 'Choice Hotels', 'InterContinental', 'Accor', 'Radisson Hotel Group', 'Best Western Hotels & Resorts', 'IHG Hotels & Resorts', 'Rosewood Hotel Group', 'Four Seasons Hotels and Resorts', 'MGM Resorts International', 'Shangri-La Hotels and Resorts', 'Minor Hotels', 'NH Hotel Group', 'Banyan Tree Group']);
  
  const address = `${getRandomInt(100, 999)} ${getRandom(['Main St', 'Ocean Blvd', '5th Ave', 'Sunset Rd', 'Market St', 'Elm St', 'Maple Ave', 'Broadway', 'Park Pl', 'Pine Ln', 'Grand Ave', 'University Dr', 'Highland Rd', 'Riverfront Pkwy', 'Liberty St', 'Willow Creek Ln', 'Cedarwood Blvd', 'Mill Pond Rd', 'Silverleaf Way', 'Forest Ridge Dr'])}`;
  const rooms: RoomDetails[] = ['Standard', 'Deluxe', 'Suite'].map((type, i) => {
    const price = getRandomInt(120, 350);
    const original = Math.random() < 0.5 ? price + getRandomInt(30, 70) : undefined;

    return {
      type,
      pricePerNight: price,
      originalPrice: original,
      includes: {
        breakfast: Math.random() < 0.7,
        lunch: Math.random() < 0.3,
      },
      mostPopular: i === 1,
      accessibleFeatures: ['Elevator', 'Ramp Access', 'Visual Alarms in Hallways', 'Wheelchair Accessible Rooms', 'Roll-in Showers', 'Grab Bars in Bathrooms', 'Lowered Sinks', 'Accessible Parking', 'Braille Signage', 'Hearing Impaired Alarms', 'Service Animal Friendly', 'Accessible Route to Entrance', 'Closed Captioning on TVs', 'Accessible Pool Lift'].filter(() => Math.random() < 0.5),
      cancellationPolicy: getRandom(['Free cancellation 24h before check-in', 'Non-refundable', 'Free cancellation up to 48 hours before check-in', 'Free cancellation up to 7 days before check-in', 'Flexible cancellation with full refund before 6 PM on check-in day', 'First night charged if cancelled within 24 hours of check-in', 'Penalty applies if cancelled after booking confirmed', 'Free cancellation up to 14 days before arrival']),
      availableRooms: getRandomInt(2, 5),
      bedCount: getRandomInt(1, 2),
    };
  });

  const attractionsNearby: Attraction[] = [
    { name: 'Beach Access', type: 'Beach' as const, distanceKm: 0.3 },
    { name: 'Downtown Plaza', type: 'Downtown' as const, distanceKm: 1.1 },
    { name: 'Ocean View Park', type: 'Ocean View' as const, distanceKm: 0.4 },
    { name: 'Washer/Dryer Facility', type: 'Washer/Dryer' as const, distanceKm: 0.2 },
    { name: 'Local Art Museum', type: 'Museum' as const, distanceKm: 2.5 },
    { name: 'City Central Market', type: 'Market' as const, distanceKm: 0.8 },
    { name: 'Botanical Gardens', type: 'Park' as const, distanceKm: 3.7 },
    { name: 'Historic Lighthouse', type: 'Landmark' as const, distanceKm: 5.0 },
    { name: 'Children\'s Discovery Center', type: 'Family Attraction' as const, distanceKm: 1.5 },
    { name: 'Shopping Mall', type: 'Shopping' as const, distanceKm: 2.0 },
    { name: 'Public Transit Station', type: 'Transit' as const, distanceKm: 0.6 },
    { name: 'Golf Course', type: 'Sport' as const, distanceKm: 4.2 },
    { name: 'Concert Venue', type: 'Entertainment' as const, distanceKm: 2.9 },
    { name: 'National Park Entrance', type: 'Nature' as const, distanceKm: 10.5 },
    { name: 'Waterfront Promenade', type: 'Walking Area' as const, distanceKm: 0.7 },
    { name: 'Aquarium', type: 'Attraction' as const, distanceKm: 3.1 },
    { name: 'Community Sports Complex', type: 'Sport' as const, distanceKm: 1.8 },
    { name: 'Convention Center', type: 'Business' as const, distanceKm: 1.3 },
    { name: 'University Campus', type: 'Education' as const, distanceKm: 4.8 },
  ].filter(() => Math.random() < 0.8);

  const reviews: Review[] = Array.from({ length: getRandomInt(5, 20) }, () => {
    const reviewData = getRandom(reviewsPool);
    return {
      username: `Guest${getRandomInt(1000, 9999)}`,
      rating: reviewData.rating,
      comment: reviewData.text,
      date: new Date(Date.now() - getRandomInt(1, 100) * 86400000).toISOString().split('T')[0],
    };
  });
  const faqs: Array<{ question: string; answer: string }> = [
      { question: 'Is breakfast included?', answer: 'Depends on the room; please check your specific room details or package for breakfast inclusions.' },
      { question: 'Can I check out late?', answer: 'Yes, late checkout is often available for an additional fee and is subject to hotel availability. Please inquire at the front desk on your departure day.' },
      { question: 'Are pets allowed?', answer: 'Only service animals are permitted. We unfortunately do not allow other pets on the premises.' },
      { question: 'Is there parking available?', answer: 'Yes, we offer complimentary on-site parking for all registered guests. Valet parking may be available for an additional fee.' },
      { question: 'Do you have a pool?', answer: 'Yes, we feature both an indoor heated pool and an outdoor seasonal pool for guest enjoyment. Hours are posted poolside.' },
      { question: 'Is there Wi-Fi access?', answer: 'Yes, complimentary high-speed Wi-Fi is available throughout the entire hotel, including all guest rooms and common areas.' },
      { question: 'What are the check-in and check-out times?', answer: 'Standard check-in is at 3:00 PM, and check-out is at 11:00 AM. Early check-in may be possible based on availability.' },
      { question: 'Do you have a fitness center?', answer: 'Yes, our 24-hour fitness center is fully equipped with modern cardio machines, strength training equipment, and free weights.' },
      { question: 'Is there a restaurant on site?', answer: 'Yes, our hotel features a full-service restaurant, offering breakfast, lunch, and dinner. Room service is also available.' },
      { question: 'Can I store my luggage before check-in or after check-out?', answer: 'Yes, we offer complimentary luggage storage services at the front desk for your convenience.' },
      { question: 'Do you offer airport shuttle service?', answer: 'Yes, we provide a complimentary shuttle service to and from the nearest airport. Please contact the front desk to arrange your pick-up or drop-off time.' },
      { question: 'Are there accessible rooms available?', answer: 'Yes, we offer a variety of accessible rooms designed for guests with disabilities, featuring amenities like roll-in showers, grab bars, and wider doorways. Please specify your needs when booking.' },
      { question: 'Is laundry service available?', answer: 'Yes, we have both self-service coin-operated laundry facilities and professional laundry/dry cleaning services available for a fee.' },
      { question: 'Can I modify or cancel my reservation?', answer: 'Reservation modification and cancellation policies vary by booking type and rate. Please refer to your confirmation email for specific terms, or contact our reservations team for assistance.' },
      { question: 'Do you have meeting or event spaces?', answer: 'Yes, we offer versatile meeting rooms and event spaces suitable for conferences, weddings, and social gatherings. Our events team can assist with planning.' },
      { question: 'Is there a spa or wellness center?', answer: 'Some of our hotels feature a full-service spa offering massages, facials, and other treatments. Please check specific hotel amenities.' },
      { question: 'What payment methods do you accept?', answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover) and debit cards. Cash payments may require a deposit.' },
      { question: 'Do rooms have coffee makers and mini-fridges?', answer: 'Most of our guest rooms include a coffee maker and a mini-fridge for your convenience. Please check your room type for specific amenities.' },
      { question: 'Is smoking allowed in rooms or on property?', answer: 'Our hotel is 100% smoke-free. Smoking is prohibited in all indoor areas and may be restricted in designated outdoor areas.' },
      { question: 'Can I request an extra bed or crib?', answer: 'Yes, extra beds (rollaways) and cribs are available upon request and are subject to availability and a possible nightly fee. Please arrange this in advance.' },
      { question: 'Is there a gift shop or convenience store on site?', answer: 'Yes, we have a small gift shop/convenience store located in the lobby, offering snacks, drinks, and essential travel items.' },
      { question: 'Do you offer a loyalty program?', answer: 'Yes, we participate in our hotel brand loyalty program. Members can earn points and enjoy exclusive benefits during their stay.' },
      { question: 'What security measures are in place?', answer: 'Our hotel features 24/7 security cameras, key card access to guest floors, and on-site security personnel for your safety and peace of mind.' },
      { question: 'Are there connecting rooms available?', answer: 'Connecting rooms can be requested but are subject to availability. Please note this preference when making your reservation.' },
      { question: 'Do you have an ATM on site?', answer: 'Yes, there is an ATM conveniently located in the hotel lobby for guest use.' },
      { question: 'Can I have packages delivered to the hotel?', answer: 'Yes, guests may have packages delivered to the hotel. Please ensure your name and reservation details are clearly marked on the package.' },
    ];
  const getFAQs = Array.from({ length: getRandomInt(5, 15) }, () => {
    const faq = getRandom(faqs);
    return { question: faq.question, answer: faq.answer };
  });

  const avgRating = parseFloat((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1));

  return {
    id,
    vendor,
    name,
    address,
    description,
    rooms,
    attractionsNearby,
    accessibilityLabel: `${name}.\n${avgRating} out of 5 stars.\n${getRandom(attractionsNearby).name} • ${getRandomInt(1, 7)} km from downtown.\nOffered by ${vendor}.\nMost popular room: ${getRandom(rooms).type}.\n`,
    reviewSummary: {
      averageRating: avgRating,
      totalReviews: reviews.length,
      breakdown: {
        cleanliness: getRandomInt(7, 10),
        location: getRandomInt(8, 10),
        comfort: getRandomInt(7, 10),
        staff: getRandomInt(8, 10),
        value: getRandomInt(6, 9),
      },
    },
    reviews,
    policies: {
      checkIn: {
        startTime: '4:00 PM',
        endTime: 'Anytime',
        contactless: true,
        express: true,
        minAge: 21,
      },
      checkOut: {
        time: '11:00 AM',
        contactless: true,
        express: true,
        lateFeeApplicable: true,
      },
      petsAllowed: false,
      childrenPolicy: 'Children up to 18 stay free with parents using existing beds.',
      extraBeds: 'Not available',
      cribAvailability: 'Not available',
      accessMethods: ['Staffed front desk', 'Smart lock', 'Key card access', 'Mobile app check-in', 'Self check-in kiosk', 'Keypad entry', '24/7 security personnel', 'Concierge service', 'Digital key via smartphone'],
      safetyFeatures: ['Smoke detector', 'Security cameras', '24/7 staffed security', 'Carbon monoxide detector', 'Fire extinguisher', 'First aid kit', 'Key card access to rooms and common areas', 'Emergency exit routes clearly marked', 'Sprinkler system', 'Well-lit parking area', 'Safe deposit box in rooms', 'Window and door locks', 'Emergency lighting', 'Alarm system'],
      housekeepingPolicy: 'Follows CleanStay standards',
    },
    fees: {
      depositPerNight: 150,
      resortFeePerNight: 30,
      breakfastFeeRange: [19, 32],
      parkingFeePerDay: 65,
      lateCheckoutFee: 45,
    },
    finePrint: 'Government-issued photo ID and credit card required at check-in. Tax ID - C0014930350. CleanStay protocols in place.',
    faqs: getFAQs,
  };
}

// Function to generate multiple hotels
export function generateHotels(count: number = 5): HotelData[] {
  return Array.from({ length: count }, () => generateHotel());
}
