export interface NormalizedProduct {
  id: string;
  name: string;
  size: string;
  price: string;
  salePrice: string;
  originalPrice?: string;
  storeName: string;
  imageUrl?: string;
  validFrom?: string;
  validTo?: string;
}

export interface StoreData {
  storeName: string;
  validFrom?: string;
  validTo?: string;
  products: NormalizedProduct[];
}

// Raw data structures from different stores
export interface BreauxMartItem {
  id: string;
  name: string;
  size: string;
  price: string;
  sale_price: string;
  base_price?: number;
  cover_image_url?: string;
  display_start_date?: string;
  display_finish_date?: string;
}

export interface BreauxMartData {
  total: number;
  items: BreauxMartItem[];
}

export interface RobertFreshItem {
  id: number;
  flyer_id: number;
  name: string;
  price: string;
  valid_from: string;
  valid_to: string;
  cutout_image_url?: string;
}

export interface ZuppardosItem {
  id: number;
  flyer_id: number;
  name: string;
  price: string;
  valid_from: string;
  valid_to: string;
  cutout_image_url?: string;
}

export interface DorignacsItem {
  id: number;
  flyer_id: number;
  name: string;
  price: string;
  valid_from: string;
  valid_to: string;
  cutout_image_url?: string;
}

export type RawStoreData = BreauxMartData | RobertFreshItem[] | ZuppardosItem[] | DorignacsItem[];

export interface StoreConfig {
  id: string;
  name: string;
  apiUrl: string;
  dataType: 'breaux-mart' | 'robert-fresh' | 'zuppardos' | 'dorignacs' | 'rouses' | 'winn-dixie';
  isActive: boolean;
  lastUpdated?: string;
}

export interface AppData {
  stores: StoreConfig[];
  storeData: StoreData[];
  lastGlobalUpdate?: string;
}