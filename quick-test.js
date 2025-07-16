// Simple test script for microservices connectivity
// You can run this in your browser console or as a Node.js script

import { testAllServices } from './lib/api-config.js';

console.log('🔍 Testing microservices connectivity...\n');

// Run the test
testAllServices()
  .then(results => {
    console.log('\n✅ Test completed successfully!');
    console.log('Results:', results);
  })
  .catch(error => {
    console.error('❌ Error testing services:', error);
  });
