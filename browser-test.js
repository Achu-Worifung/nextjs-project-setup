// Browser console test - copy and paste this into your browser console
// when your Next.js app is running

// Test individual service
async function testSingleService(serviceName, url) {
  try {
    const response = await fetch(`${url}/docs`);
    const status = response.ok ? 'connected' : 'error';
    console.log(`${status === 'connected' ? '✅' : '❌'} ${serviceName}: ${status === 'connected' ? 'Service is running' : `HTTP ${response.status}`}`);
    return { serviceName, url, status, httpStatus: response.status };
  } catch (error) {
    console.log(`❌ ${serviceName}: Connection failed - ${error.message}`);
    return { serviceName, url, status: 'error', httpStatus: null, message: error.message };
  }
}

// Test all services
async function testAllMicroservices() {
  const services = [
    { name: 'Flight Service', url: 'http://localhost:8000' },
    { name: 'Car Booking Service', url: 'http://localhost:8001' },
    { name: 'Hotel Service', url: 'http://localhost:8002' },
    { name: 'User Service', url: 'http://localhost:8004' },
    { name: 'Flight Booking Service', url: 'http://localhost:8006' },
    { name: 'Car Service', url: 'http://localhost:8010' },
    { name: 'Trip Service', url: 'http://localhost:8012' },
  ];

  console.log('🔍 Testing microservices connectivity...\n');
  
  const results = [];
  for (const service of services) {
    const result = await testSingleService(service.name, service.url);
    results.push(result);
  }
  
  const connected = results.filter(r => r.status === 'connected').length;
  console.log(`\n📊 Summary: ${connected}/${results.length} services are running`);
  
  return results;
}

// Run the test
testAllMicroservices();
