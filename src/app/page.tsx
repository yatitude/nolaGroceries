'use client';

import { useState, useEffect } from 'react';
import { AppData, StoreData } from '@/types/store';
import { loadFromStorage } from '@/utils/storage';

export default function Home() {
  const [appData, setAppData] = useState<AppData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState<StoreData[]>([]);

  useEffect(() => {
    const data = loadFromStorage();
    setAppData(data);
    setFilteredData(data?.storeData || []);
  }, []);

  useEffect(() => {
    if (!appData?.storeData) return;

    if (searchTerm.trim() === '') {
      setFilteredData(appData.storeData);
    } else {
      const filtered = appData.storeData.map(store => ({
        ...store,
        products: store.products.filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(store => store.products.length > 0);
      
      setFilteredData(filtered);
    }
  }, [searchTerm, appData]);

  const formatDateRange = (validFrom?: string, validTo?: string) => {
    if (!validFrom && !validTo) return '';
    
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };
    
    if (validFrom && validTo) {
      return `${formatDate(validFrom)} - ${formatDate(validTo)}`;
    }
    
    return validFrom ? `From ${formatDate(validFrom)}` : `Until ${formatDate(validTo!)}`;
  };

  const formatPrice = (price: string) => {
    if (!price) return '';
    if (price.startsWith('$')) return price;
    return `$${price}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">New Orleans Groceries</h1>
            <a
              href="/admin"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Admin Dashboard
            </a>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search all stores for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Store Data */}
        {!appData ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : filteredData.length === 0 && appData.storeData.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No store data available.</p>
            <a
              href="/admin"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Configure Stores
            </a>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No products found matching &ldquo;{searchTerm}&rdquo;</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredData.map((store) => (
              <div key={store.storeName} className="bg-white rounded-lg shadow-sm border">
                {/* Store Header */}
                <div className="border-b bg-gray-50 px-6 py-4 rounded-t-lg">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <h2 className="text-xl font-semibold text-gray-900">{store.storeName}</h2>
                    {(store.validFrom || store.validTo) && (
                      <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">
                        {formatDateRange(store.validFrom, store.validTo)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {store.products.length} items on sale
                  </p>
                </div>

                {/* Products */}
                <div className="p-6">
                  <div className="grid gap-3">
                    {store.products.map((product) => (
                      <div key={product.id} className="flex justify-between items-start border-b border-gray-100 pb-3 last:border-b-0">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                          {product.size && (
                            <p className="text-sm text-gray-500">{product.size}</p>
                          )}
                        </div>
                        <div className="flex flex-col items-end ml-4">
                          <div className="text-lg font-semibold text-green-600">
                            {formatPrice(product.salePrice)}
                          </div>
                          {product.originalPrice && product.originalPrice !== product.salePrice && (
                            <div className="text-sm text-gray-500 line-through">
                              {formatPrice(product.originalPrice)}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {appData && appData.storeData.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              Showing deals from {filteredData.length} store{filteredData.length !== 1 ? 's' : ''} 
              {searchTerm && ` matching &ldquo;${searchTerm}&rdquo;`}
            </p>
            {appData.lastGlobalUpdate && (
              <p className="mt-1">
                Last updated: {new Date(appData.lastGlobalUpdate).toLocaleString()}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
