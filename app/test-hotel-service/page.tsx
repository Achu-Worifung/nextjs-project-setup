// Test page to verify hotel microservice connectivity
"use client";

import { useState } from 'react';
import { testHotelService, testHotelServiceHealth } from '@/lib/test-hotel-service';

export default function TestHotelService() {
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runHealthCheck = async () => {
    setIsLoading(true);
    const result = await testHotelServiceHealth();
    setTestResult({ type: 'health', ...result });
    setIsLoading(false);
  };

  const runHotelSearch = async () => {
    setIsLoading(true);
    const result = await testHotelService();
    setTestResult({ type: 'search', ...result });
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Hotel Microservice Test</h1>
      
      <div className="space-y-4 mb-6">
        <button
          onClick={runHealthCheck}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-4"
        >
          {isLoading ? 'Testing...' : 'Test Health Check'}
        </button>
        
        <button
          onClick={runHotelSearch}
          disabled={isLoading}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          {isLoading ? 'Testing...' : 'Test Hotel Search'}
        </button>
      </div>

      {testResult && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">
            Test Result ({testResult.type}):
          </h2>
          <div className={`p-4 rounded ${testResult.success ? 'bg-green-100' : 'bg-red-100'}`}>
            <p className={`font-medium ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
              {testResult.success ? '✅ Success' : '❌ Failed'}
            </p>
            {testResult.error && (
              <p className="text-red-600 mt-2">Error: {testResult.error}</p>
            )}
            {testResult.data && (
              <pre className="mt-2 text-sm bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(testResult.data, null, 2)}
              </pre>
            )}
          </div>
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Make sure your hotel microservice is running on port 8002</li>
          <li>Run the health check to verify the service is accessible</li>
          <li>Run the hotel search to test the hotels endpoint</li>
          <li>Check the console for additional debug information</li>
        </ol>
      </div>
    </div>
  );
}
