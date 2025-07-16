'use client';

import { useState } from 'react';
import { testAllServices, testServiceConnection, MICROSERVICES_CONFIG } from '../../../lib/api-config';

interface TestResult {
  service: string;
  url: string;
  status: 'connected' | 'error';
  httpStatus: number | null;
  message: string;
}

export default function ServiceTestPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleTestAllServices = async () => {
    setIsLoading(true);
    try {
      const results = await testAllServices();
      setTestResults(results as TestResult[]);
    } catch (error) {
      console.error('Error testing services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestSingleService = async (serviceName: string, url: string) => {
    setIsLoading(true);
    try {
      const result = await testServiceConnection(serviceName, url);
      setTestResults(prev => {
        const existing = prev.findIndex(r => r.service === serviceName);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = result as TestResult;
          return updated;
        }
        return [...prev, result as TestResult];
      });
    } catch (error) {
      console.error(`Error testing ${serviceName}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          🔍 Microservices Connectivity Test
        </h1>
        
        <div className="mb-6">
          <button
            onClick={handleTestAllServices}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            {isLoading ? 'Testing...' : 'Test All Services'}
          </button>
        </div>

        <div className="grid gap-4">
          {Object.entries(MICROSERVICES_CONFIG).map(([key, url]) => (
            <div key={key} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="font-semibold text-gray-800">{key.replace('_', ' ')}</h3>
                  <p className="text-sm text-gray-600">{url}</p>
                </div>
                <button
                  onClick={() => handleTestSingleService(key, url)}
                  disabled={isLoading}
                  className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Test
                </button>
              </div>
              
              {/* Show result for this service */}
              {(() => {
                const result = testResults.find(r => r.service === key);
                return result ? (
                  <div className="mt-2">
                    <div className={`p-3 rounded ${
                      result.status === 'connected' 
                        ? 'bg-green-100 border-green-300' 
                        : 'bg-red-100 border-red-300'
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {result.status === 'connected' ? '✅' : '❌'}
                        </span>
                        <span className="font-medium">
                          {result.status === 'connected' ? 'Connected' : 'Error'}
                        </span>
                        {result.httpStatus && (
                          <span className="text-sm text-gray-600">
                            (HTTP {result.httpStatus})
                          </span>
                        )}
                      </div>
                      <p className="text-sm mt-1">{result.message}</p>
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          ))}
        </div>

        {/* Summary */}
        {testResults.length > 0 && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">📊 Test Summary</h3>
            <p>
              {testResults.filter(r => r.status === 'connected').length} / {testResults.length} services are running
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
