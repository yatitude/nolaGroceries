'use client';

import { useState, useEffect } from 'react';

export default function AdminAccess() {
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    // Check for admin access via URL parameter or key combination
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true') {
      setShowAdmin(true);
    }

    // Check for Ctrl+Shift+A key combination
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setShowAdmin(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!showAdmin) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-red-600 text-white p-2 rounded shadow-lg text-xs">
      <div className="flex gap-2">
        <button
          onClick={() => window.location.href = './admin/'}
          className="px-3 py-1 bg-red-700 rounded hover:bg-red-800"
        >
          Admin
        </button>
        <button
          onClick={() => window.location.href = './test/'}
          className="px-3 py-1 bg-red-700 rounded hover:bg-red-800"
        >
          Test
        </button>
        <button
          onClick={() => setShowAdmin(false)}
          className="px-3 py-1 bg-red-700 rounded hover:bg-red-800"
        >
          Hide
        </button>
      </div>
    </div>
  );
}