// Simple test to verify hotel microservice is working
import { MICROSERVICES_CONFIG } from '@/lib/api-config';

export async function testHotelService() {
  try {
    const response = await fetch(`${MICROSERVICES_CONFIG.HOTEL_SERVICE}/hotels?count=5&city=New York&state=NY`, {
      headers: {
        'X-Client-ID': 'nextjs-app'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const hotels = await response.json();
    console.log('Hotel service test successful:', hotels);
    return { success: true, data: hotels };
  } catch (error) {
    console.error('Hotel service test failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function testHotelServiceHealth() {
  try {
    const response = await fetch(`${MICROSERVICES_CONFIG.HOTEL_SERVICE}/`, {
      headers: {
        'X-Client-ID': 'nextjs-app'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const healthInfo = await response.json();
    console.log('Hotel service health check successful:', healthInfo);
    return { success: true, data: healthInfo };
  } catch (error) {
    console.error('Hotel service health check failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
