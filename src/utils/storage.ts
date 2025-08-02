import { AppData, StoreConfig } from '@/types/store';

const STORAGE_KEY = 'nola-groceries-data';

export function saveToStorage(data: AppData): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

export function loadFromStorage(): AppData | null {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Error parsing stored data:', error);
        return null;
      }
    }
  }
  return null;
}

export function exportData(): string {
  const data = loadFromStorage();
  return JSON.stringify(data, null, 2);
}

export function importData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString) as AppData;
    saveToStorage(data);
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
}

export function getDefaultStoreConfigs(): StoreConfig[] {
  return [
    {
      id: 'breaux-mart',
      name: 'Breaux Mart',
      apiUrl: '',
      dataType: 'breaux-mart',
      isActive: true
    },
    {
      id: 'robert-fresh',
      name: 'Robert Fresh Market',
      apiUrl: '',
      dataType: 'robert-fresh',
      isActive: true
    },
    {
      id: 'zuppardos',
      name: "Zuppardo's",
      apiUrl: '',
      dataType: 'zuppardos',
      isActive: true
    },
    {
      id: 'dorignacs',
      name: "Dorignac's",
      apiUrl: '',
      dataType: 'dorignacs',
      isActive: true
    },
    {
      id: 'rouses',
      name: 'Rouses',
      apiUrl: '',
      dataType: 'rouses',
      isActive: true
    },
    {
      id: 'winn-dixie',
      name: 'Winn-Dixie',
      apiUrl: '',
      dataType: 'winn-dixie',
      isActive: true
    }
  ];
}

export function initializeStorage(): AppData {
  const existing = loadFromStorage();
  if (existing) {
    return existing;
  }

  const initialData: AppData = {
    stores: getDefaultStoreConfigs(),
    storeData: [],
    lastGlobalUpdate: undefined
  };

  saveToStorage(initialData);
  return initialData;
}