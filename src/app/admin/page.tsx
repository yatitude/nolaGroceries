'use client';

import { useState, useEffect } from 'react';
import { StoreConfig, AppData } from '@/types/store';
import { loadFromStorage, saveToStorage, initializeStorage, exportData, importData } from '@/utils/storage';

export default function AdminPage() {
  const [appData, setAppData] = useState<AppData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const data = initializeStorage();
    setAppData(data);
  }, []);

  const updateStoreConfig = (storeId: string, updates: Partial<StoreConfig>) => {
    if (!appData) return;

    const updatedStores = appData.stores.map(store =>
      store.id === storeId ? { ...store, ...updates } : store
    );

    const updatedData = { ...appData, stores: updatedStores };
    setAppData(updatedData);
    saveToStorage(updatedData);
  };

  const fetchStoreData = async (store: StoreConfig) => {
    if (!store.apiUrl) {
      setMessage(`No API URL configured for ${store.name}`);
      return;
    }

    setIsLoading(true);
    setMessage(`Fetching data for ${store.name}...`);

    try {
      const response = await fetch(store.apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const rawData = await response.json();
      
      // Transform the data based on store type
      const { transformStoreData } = await import('@/utils/dataTransformers');
      const transformedData = transformStoreData(rawData, store.name, store.dataType);
      
      // Update app data
      if (appData) {
        const updatedStoreData = appData.storeData.filter(s => s.storeName !== store.name);
        updatedStoreData.push(transformedData);
        
        const updatedAppData = {
          ...appData,
          storeData: updatedStoreData,
          lastGlobalUpdate: new Date().toISOString()
        };
        
        // Update last updated for this store
        updateStoreConfig(store.id, { lastUpdated: new Date().toISOString() });
        
        setAppData(updatedAppData);
        saveToStorage(updatedAppData);
        setMessage(`Successfully updated ${store.name} with ${transformedData.products.length} products`);
      }
    } catch (error) {
      console.error(`Error fetching data for ${store.name}:`, error);
      setMessage(`Error fetching data for ${store.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllStoreData = async () => {
    if (!appData) return;
    
    const activeStores = appData.stores.filter(store => store.isActive && store.apiUrl);
    
    for (const store of activeStores) {
      await fetchStoreData(store);
      // Add small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  const handleExport = () => {
    const dataStr = exportData();
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nola-groceries-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setMessage('Data exported successfully');
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (importData(content)) {
        const data = loadFromStorage();
        setAppData(data);
        setMessage('Data imported successfully');
      } else {
        setMessage('Error importing data - invalid format');
      }
    };
    reader.readAsText(file);
  };

  if (!appData) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {message && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Store Configuration */}
        <div className="bg-white p-4 border border-gray-200 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Store Configuration</h2>
          
          <div className="space-y-4">
            {appData.stores.map((store) => (
              <div key={store.id} className="border border-gray-100 p-3 rounded">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{store.name}</h3>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={store.isActive}
                      onChange={(e) => updateStoreConfig(store.id, { isActive: e.target.checked })}
                      className="mr-2"
                    />
                    Active
                  </label>
                </div>
                
                <input
                  type="url"
                  placeholder="API URL"
                  value={store.apiUrl}
                  onChange={(e) => updateStoreConfig(store.id, { apiUrl: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
                
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {store.lastUpdated ? `Updated: ${new Date(store.lastUpdated).toLocaleDateString()}` : 'Never updated'}
                  </span>
                  <button
                    onClick={() => fetchStoreData(store)}
                    disabled={!store.apiUrl || isLoading}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    Fetch Data
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white p-4 border border-gray-200 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          
          <div className="space-y-3">
            <button
              onClick={fetchAllStoreData}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              {isLoading ? 'Fetching...' : 'Fetch All Store Data'}
            </button>
            
            <button
              onClick={handleExport}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Export Data
            </button>
            
            <div>
              <label className="block text-sm font-medium mb-1">Import Data</label>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Data Summary */}
      <div className="mt-6 bg-white p-4 border border-gray-200 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Data Summary</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{appData.stores.filter(s => s.isActive).length}</div>
            <div className="text-gray-600">Active Stores</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{appData.storeData.length}</div>
            <div className="text-gray-600">Stores with Data</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {appData.storeData.reduce((total, store) => total + store.products.length, 0)}
            </div>
            <div className="text-gray-600">Total Products</div>
          </div>
        </div>
        
        {appData.lastGlobalUpdate && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Last updated: {new Date(appData.lastGlobalUpdate).toLocaleString()}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-6 text-center">
        <button
          onClick={() => window.location.href = '../'}
          className="inline-block px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          View Public Site
        </button>
      </div>
    </div>
  );
}