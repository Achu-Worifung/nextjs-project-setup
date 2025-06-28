import { generateHotel, generateHotels } from './lib/hotel-generator.js';

console.log('Testing single hotel generation...');
try {
  const hotel = generateHotel();
  console.log('✅ Single hotel generated successfully!');
  console.log('Hotel name:', hotel.name);
  console.log('Vendor:', hotel.vendor);
  console.log('Rating:', hotel.reviewSummary.averageRating);
  console.log('Number of rooms:', hotel.rooms.length);
  console.log('Number of reviews:', hotel.reviews.length);
} catch (error) {
  console.error('❌ Error generating single hotel:', error.message);
}

console.log('\nTesting multiple hotels generation...');
try {
  const hotels = generateHotels(3);
  console.log('✅ Multiple hotels generated successfully!');
  console.log('Generated', hotels.length, 'hotels');
  hotels.forEach((hotel, index) => {
    console.log(`Hotel ${index + 1}: ${hotel.name} (${hotel.vendor})`);
  });
} catch (error) {
  console.error('❌ Error generating multiple hotels:', error.message);
}
