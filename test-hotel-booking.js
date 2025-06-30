// Test script to verify hotel booking structure
const testHotelBooking = {
  checkInDate: "2025-07-15",
  checkOutDate: "2025-07-18",
  guests: 2,
  totalPrice: 599.99,
  hotelDetails: {
    hotelName: "Grand Plaza Hotel",
    hotelAddress: "123 Main Street, Downtown",
    hotelCity: "New York",
    hotelCountry: "USA",
    hotelRating: 4.5,
    roomType: "Deluxe Suite",
    roomDescription: "Spacious suite with city view and modern amenities",
    maxOccupancy: 4,
    nights: 3,
    basePrice: 535.70,
    discounts: 0,
    tax: 64.29,
    amenities: ["Free WiFi", "Free Parking", "Restaurant", "Fitness Center", "Swimming Pool"],
    images: ["/des1.jpg", "/des2.jpg", "/des4.jpg"],
    checkInTime: "3:00 PM",
    checkOutTime: "11:00 AM"
  }
};

console.log("Test hotel booking data:");
console.log(JSON.stringify(testHotelBooking, null, 2));

// The hotelDetails will be stored as JSONB in the database:
console.log("\nHotel details JSONB structure:");
const jsonbData = {
  ...testHotelBooking.hotelDetails,
  totalPrice: testHotelBooking.totalPrice,
  bookingDetails: {
    checkInDate: testHotelBooking.checkInDate,
    checkOutDate: testHotelBooking.checkOutDate,
    guests: testHotelBooking.guests
  }
};

console.log(JSON.stringify(jsonbData, null, 2));
