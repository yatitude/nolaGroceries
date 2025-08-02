import { AppData, StoreData } from '@/types/store';
import { transformStoreData } from '@/utils/dataTransformers';

// Sample data for testing
export const sampleBreauxMartData = {
  "total": 3,
  "items": [
    {
      "id": "3684500245963616441",
      "name": "CUCUMBER",
      "size": "ea",
      "price": "$0.59",
      "sale_price": "$0.59",
      "base_price": 0.89,
      "cover_image_url": "https://images.freshop.com/12432/0244b6dff519305a8fd9cd7dd5e9b2b0_medium.png",
      "display_start_date": "2025-07-30",
      "display_finish_date": "2025-08-05"
    },
    {
      "id": "3684500387991138590",
      "name": "Ground Beef Family Pk Fresh Daily",
      "size": "lb",
      "price": "$5.49",
      "sale_price": "$3.99",
      "base_price": 5.49,
      "display_start_date": "2025-07-30",
      "display_finish_date": "2025-08-05"
    },
    {
      "id": "3684500369762693257",
      "name": "Blue Bell Ice Cream, Gold Rim Half Gallon, Assorted Flavors",
      "size": "0.5 gal",
      "price": "$8.99",
      "sale_price": "$5.89",
      "base_price": 8.99,
      "display_start_date": "2025-07-30",
      "display_finish_date": "2025-08-05"
    }
  ]
};

export const sampleRobertFreshData = [
  {
    "id": 947434381,
    "flyer_id": 7414365,
    "name": "USDA Choice Boneless Beef Chuck Roast $5.99",
    "price": "",
    "valid_from": "2025-07-30T00:00:00-04:00",
    "valid_to": "2025-08-05T23:59:59-04:00",
    "cutout_image_url": "https://f.wishabi.net/page_items/385511236/1753857496/extra_large.jpg"
  },
  {
    "id": 947434395,
    "flyer_id": 7414366,
    "name": "Sweet Tree Ripened Yellow Peaches or Yellow Nectarines",
    "price": "",
    "valid_from": "2025-07-30T00:00:00-04:00",
    "valid_to": "2025-08-05T23:59:59-04:00",
    "cutout_image_url": "https://f.wishabi.net/page_items/385511242/1753857500/extra_large.jpg"
  }
];

export const sampleZuppardosData = [
  {
    "id": 947435297,
    "flyer_id": 7414375,
    "name": "Southern\nPeaches\n114949\nLB.",
    "price": "",
    "valid_from": "2025-07-30T00:00:00-04:00",
    "valid_to": "2025-08-05T23:59:59-04:00",
    "cutout_image_url": "https://f.wishabi.net/page_items/385513417/1753857615/extra_large.jpg"
  },
  {
    "id": 947435312,
    "flyer_id": 7414375,
    "name": "RedSeedless\nGrapes\n2lb.\nclamshell\n339999",
    "price": "",
    "valid_from": "2025-07-30T00:00:00-04:00",
    "valid_to": "2025-08-05T23:59:59-04:00",
    "cutout_image_url": "https://f.wishabi.net/page_items/385513418/1753857616/extra_large.jpg"
  }
];

export function createTestData(): AppData {
  const stores = [
    {
      id: 'breaux-mart',
      name: 'Breaux Mart',
      apiUrl: 'test://breaux-mart',
      dataType: 'breaux-mart' as const,
      isActive: true,
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'robert-fresh',
      name: 'Robert Fresh Market',
      apiUrl: 'test://robert-fresh',
      dataType: 'robert-fresh' as const,
      isActive: true,
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'zuppardos',
      name: "Zuppardo's",
      apiUrl: 'test://zuppardos',
      dataType: 'zuppardos' as const,
      isActive: true,
      lastUpdated: new Date().toISOString()
    }
  ];

  const storeData: StoreData[] = [
    transformStoreData(sampleBreauxMartData, 'Breaux Mart', 'breaux-mart'),
    transformStoreData(sampleRobertFreshData, 'Robert Fresh Market', 'robert-fresh'),
    transformStoreData(sampleZuppardosData, "Zuppardo's", 'zuppardos')
  ];

  return {
    stores,
    storeData,
    lastGlobalUpdate: new Date().toISOString()
  };
}