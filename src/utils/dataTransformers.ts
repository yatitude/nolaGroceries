import {
  NormalizedProduct,
  StoreData,
  BreauxMartData,
  BreauxMartItem,
  RobertFreshItem,
  ZuppardosItem,
  DorignacsItem,
  RawStoreData
} from '@/types/store';

export function transformBreauxMartData(data: BreauxMartData, storeName: string): StoreData {
  const products: NormalizedProduct[] = data.items.map((item: BreauxMartItem) => ({
    id: item.id,
    name: item.name,
    size: item.size || '',
    price: item.sale_price || item.price,
    salePrice: item.sale_price,
    originalPrice: item.base_price ? `$${item.base_price.toFixed(2)}` : undefined,
    storeName,
    imageUrl: item.cover_image_url,
    validFrom: item.display_start_date,
    validTo: item.display_finish_date
  }));

  return {
    storeName,
    validFrom: products[0]?.validFrom,
    validTo: products[0]?.validTo,
    products
  };
}

export function transformRobertFreshData(data: RobertFreshItem[], storeName: string): StoreData {
  const products: NormalizedProduct[] = data.map((item: RobertFreshItem) => {
    // Extract price from name if price field is empty
    const nameMatch = item.name.match(/\$[\d,]+\.?\d*/);
    const extractedPrice = nameMatch ? nameMatch[0] : item.price || '';
    
    return {
      id: item.id.toString(),
      name: item.name.replace(/\$[\d,]+\.?\d*/, '').trim(),
      size: '',
      price: extractedPrice,
      salePrice: extractedPrice,
      storeName,
      imageUrl: item.cutout_image_url,
      validFrom: item.valid_from,
      validTo: item.valid_to
    };
  });

  return {
    storeName,
    validFrom: products[0]?.validFrom,
    validTo: products[0]?.validTo,
    products
  };
}

export function transformZuppardosData(data: ZuppardosItem[], storeName: string): StoreData {
  const products: NormalizedProduct[] = data.map((item: ZuppardosItem) => {
    // Parse price from the name field which contains formatted prices like "339999" (meaning $3.99)
    const priceMatch = item.name.match(/(\d+)999/);
    let formattedPrice = '';
    
    if (priceMatch) {
      const priceValue = parseInt(priceMatch[1]);
      formattedPrice = `$${priceValue}.99`;
    }
    
    return {
      id: item.id.toString(),
      name: item.name.replace(/\d+999/, '').replace(/\n/g, ' ').trim(),
      size: '',
      price: formattedPrice || item.price || '',
      salePrice: formattedPrice || item.price || '',
      storeName,
      imageUrl: item.cutout_image_url,
      validFrom: item.valid_from,
      validTo: item.valid_to
    };
  });

  return {
    storeName,
    validFrom: products[0]?.validFrom,
    validTo: products[0]?.validTo,
    products
  };
}

export function transformDorignacsData(data: DorignacsItem[], storeName: string): StoreData {
  const products: NormalizedProduct[] = data.map((item: DorignacsItem) => {
    // Extract price from name if needed
    const priceMatch = item.name.match(/\$[\d,]+\.?\d*/);
    const extractedPrice = priceMatch ? priceMatch[0] : item.price || '';
    
    return {
      id: item.id.toString(),
      name: item.name.replace(/\$[\d,]+\.?\d*/, '').trim(),
      size: '',
      price: extractedPrice,
      salePrice: extractedPrice,
      storeName,
      imageUrl: item.cutout_image_url,
      validFrom: item.valid_from,
      validTo: item.valid_to
    };
  });

  return {
    storeName,
    validFrom: products[0]?.validFrom,
    validTo: products[0]?.validTo,
    products
  };
}

export function transformStoreData(
  rawData: RawStoreData,
  storeName: string,
  dataType: string
): StoreData {
  switch (dataType) {
    case 'breaux-mart':
      return transformBreauxMartData(rawData as BreauxMartData, storeName);
    case 'robert-fresh':
      return transformRobertFreshData(rawData as RobertFreshItem[], storeName);
    case 'zuppardos':
      return transformZuppardosData(rawData as ZuppardosItem[], storeName);
    case 'dorignacs':
      return transformDorignacsData(rawData as DorignacsItem[], storeName);
    case 'rouses':
      // Assuming same format as Dorignacs for now
      return transformDorignacsData(rawData as DorignacsItem[], storeName);
    case 'winn-dixie':
      // Assuming same format as Dorignacs for now
      return transformDorignacsData(rawData as DorignacsItem[], storeName);
    default:
      throw new Error(`Unsupported data type: ${dataType}`);
  }
}