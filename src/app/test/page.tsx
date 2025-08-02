'use client';

import { useEffect } from 'react';
import { createTestData } from '@/utils/testData';
import { saveToStorage } from '@/utils/storage';

export default function TestPage() {
  useEffect(() => {
    // Load test data into storage
    const testData = createTestData();
    saveToStorage(testData);
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Test Data Loaded</h1>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <p className="text-green-800">
          Test data has been loaded into local storage. This includes sample data from:
        </p>
        <ul className="list-disc list-inside mt-2 text-green-700">
          <li>Breaux Mart (3 items)</li>
          <li>Robert Fresh Market (2 items)</li>
          <li>Zuppardo&apos;s (2 items)</li>
        </ul>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => window.location.href = '/'}
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          View Main Site
        </button>
        
        <br />
        
        <a
          href="/admin"
          className="inline-block px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          View Admin Dashboard
        </a>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded">
        <h2 className="text-lg font-semibold mb-2">Test Instructions:</h2>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Visit the main site to see the sample data displayed</li>
          <li>Try searching for terms like &ldquo;beef&rdquo;, &ldquo;peaches&rdquo;, or &ldquo;ice cream&rdquo;</li>
          <li>Visit the admin dashboard to see the configuration</li>
          <li>Test the export/import functionality</li>
        </ol>
      </div>
    </div>
  );
}