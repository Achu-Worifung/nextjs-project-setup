#!/usr/bin/env node

// Import the test function
import { testAllServices } from './lib/api-config.js';

// Run the test
console.log('🔍 Testing microservices connectivity...\n');

testAllServices()
  .then(results => {
    console.log('\n📊 Detailed Results:');
    results.forEach(result => {
      console.log(`Service: ${result.service}`);
      console.log(`URL: ${result.url}`);
      console.log(`Status: ${result.status}`);
      console.log(`HTTP Status: ${result.httpStatus}`);
      console.log(`Message: ${result.message}`);
      console.log('---');
    });
  })
  .catch(error => {
    console.error('❌ Error testing services:', error);
  });
