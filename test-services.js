// Quick test script to check microservices connectivity
import { testAllServices } from './lib/api-config.js';

// Run the test
testAllServices()
  .then(results => {
    console.log('Service test results:', results);
  })
  .catch(error => {
    console.error('Error testing services:', error);
  });
