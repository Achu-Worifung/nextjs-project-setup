import { searchDestinations } from '@/components/api/booking/destinations';

// Test function to check destinations data
export async function testDestinations() {
  try {
    console.log('🧪 Testing destination data...');
    
    const destinations = await searchDestinations('manchester');
    
    if (!destinations || destinations.length === 0) {
      console.error('❌ No destinations returned');
      return;
    }

    console.log(`📍 Found ${destinations.length} destinations`);
      // Test each destination
    destinations.slice(0, 3).forEach((dest: unknown, index: number) => {
      const destination = dest as Record<string, unknown>;
      console.log(`\n🏙️ Destination ${index + 1}:`);
      console.log('  dest_id:', destination.dest_id);
      console.log('  city_name:', destination.city_name);
      console.log('  name:', destination.name);
      console.log('  type:', destination.type);
      console.log('  search_type:', destination.search_type);
      console.log('  All keys:', Object.keys(destination));
      
      // Test API call format
      if (destination.dest_id) {
        const testUrl = `https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels?dest_id=${destination.dest_id}&search_type=CITY&adults=1&room_qty=1&page_number=1`;
        console.log('  Test URL:', testUrl);
      }
    });

    // Test with API
    console.log('\n🔍 Testing API call...');
    
    const testResponse = await fetch('/api/test/destinations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ destinations: destinations.slice(0, 2) })
    });

    const testResult = await testResponse.json();
    console.log('🧪 Test API result:', testResult);

  } catch (error) {
    console.error('💥 Test failed:', error);
  }
}

// Call this function in your component to test
// testDestinations();
