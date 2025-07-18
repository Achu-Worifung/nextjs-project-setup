import { NextRequest, NextResponse } from 'next/server';
import { testServiceConnectionServer, MICROSERVICES_CONFIG } from '../../../lib/api-config';

export async function GET() {
  try {
    const services = [
      { name: 'Flight Service', url: MICROSERVICES_CONFIG.FLIGHT_SERVICE },
      { name: 'Car Booking Service', url: MICROSERVICES_CONFIG.CAR_BOOKING_SERVICE },
      { name: 'Hotel Service', url: MICROSERVICES_CONFIG.HOTEL_SERVICE },
      { name: 'User Service', url: MICROSERVICES_CONFIG.USER_SERVICE },
      { name: 'Flight Booking Service', url: MICROSERVICES_CONFIG.FLIGHT_BOOKING_SERVICE },
      { name: 'Car Service', url: MICROSERVICES_CONFIG.CAR_SERVICE },
      { name: 'Trip Service', url: MICROSERVICES_CONFIG.TRIP_SERVICE },
    ];

    console.log('🔍 Testing microservices connectivity...\n');
    
    const results = [];
    
    for (const service of services) {
      const result = await testServiceConnectionServer(service.name, service.url);
      results.push(result);
      
      const statusIcon = result.status === 'connected' ? '✅' : '❌';
      console.log(`${statusIcon} ${result.service}: ${result.message}`);
    }
    
    const connected = results.filter(r => r.status === 'connected').length;
    const total = results.length;
    console.log(`\n📊 Test Summary: ${connected}/${total} services are running`);
    
    return NextResponse.json({
      success: true,
      summary: `${connected}/${total} services are running`,
      results
    });
  } catch (error) {
    console.error('Error testing services:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to test services',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
