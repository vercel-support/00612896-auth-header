'use client';

import { useState } from 'react';

export default function Home() {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testWithoutAuth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setTestResult({
        type: 'Without Authorization',
        data,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      setError(`Error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const testWithAuth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token-123456789',
        },
      });
      const data = await response.json();
      setTestResult({
        type: 'With Authorization Bearer Token',
        data,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      setError(`Error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Authorization Header Test
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            This page tests whether Authorization headers are properly received by the API endpoint.
            Click the buttons below to test different scenarios.
          </p>

          <div className="flex gap-4 mb-6">
            <button
              onClick={testWithoutAuth}
              disabled={loading}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Testing...' : 'Test Without Auth Header'}
            </button>
            
            <button
              onClick={testWithAuth}
              disabled={loading}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Testing...' : 'Test With Bearer Token'}
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}

          {testResult && (
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Test Result: {testResult.type}
              </h2>
              <div className="mb-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Tested at: {testResult.timestamp}
                </span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    Authorization Header Received: 
                    <span className={`ml-2 px-2 py-1 rounded text-sm ${
                      testResult.data.authorizationHeaderReceived 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {testResult.data.authorizationHeaderReceived ? 'YES' : 'NO'}
                    </span>
                  </h3>
                </div>

                {testResult.data.authentication && (
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Authentication Details:</h3>
                    <pre className="bg-gray-200 dark:bg-gray-600 p-3 rounded text-sm overflow-x-auto">
                      {JSON.stringify(testResult.data.authentication, null, 2)}
                    </pre>
                  </div>
                )}

                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">All Headers:</h3>
                  <pre className="bg-gray-200 dark:bg-gray-600 p-3 rounded text-sm overflow-x-auto max-h-40 overflow-y-auto">
                    {JSON.stringify(testResult.data.allHeaders, null, 2)}
                  </pre>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Full Response:</h3>
                  <pre className="bg-gray-200 dark:bg-gray-600 p-3 rounded text-sm overflow-x-auto max-h-60 overflow-y-auto">
                    {JSON.stringify(testResult.data, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            How to Test Externally
          </h2>
          <div className="space-y-4 text-gray-600 dark:text-gray-300">
            <p>You can also test this API endpoint using external tools like Postman or curl:</p>
            
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Without Authorization:</h3>
              <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
                curl -X GET "http://localhost:3000/api/test" -H "Content-Type: application/json"
              </pre>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">With Authorization:</h3>
              <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
                curl -X GET "http://localhost:3000/api/test" \<br/>
                  -H "Content-Type: application/json" \<br/>
                  -H "Authorization: Bearer your-token-here"
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
