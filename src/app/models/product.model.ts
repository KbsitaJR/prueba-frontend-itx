export interface Product {
  id: string;
  brand: string;
  model: string;
  price: number;
  imageUrl: string;
  cpu?: string;
  ram?: string;
  os?: string;
  screenResolution?: string;
  battery?: string;
  cameras?: string[];
  dimensions?: string;
  weight?: string;
  storageOptions: StorageOption[];
  colorOptions: ColorOption[];
}

export interface StorageOption {
  code: string;
  name: string;
  price: number;
}

export interface ColorOption {
  code: string;
  name: string;
  hex: string;
  imageUrl?: string;
}

export interface CartItem {
  productId: string;
  colorCode: string;
  storageCode: string;
  quantity: number;
  productName: string;
  brand: string;
  price: number;
  imageUrl: string;
  colorName: string;
  storageName: string;
}

export interface AddToCartRequest {
  productId: string;
  colorCode: string;
  storageCode: string;
}

export interface AddToCartResponse {
  cartCount: number;
}

export interface ProductListItem {
  id: string;
  brand: string;
  model: string;
  price: number;
  imageUrl: string;
}
