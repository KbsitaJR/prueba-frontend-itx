import { describe, it, expect } from 'vitest';
import { Product, CartItem, AddToCartRequest, AddToCartResponse, ProductListItem, StorageOption, ColorOption } from './product.model';

describe('ProductModel', () => {
  const storageOption: StorageOption = { code: 'S256', name: '256GB', price: 100 };
  const colorOption: ColorOption = { code: 'CBLK', name: 'Black', hex: '#000' };

  const product: Product = {
    id: '1',
    brand: 'Test',
    model: 'Test Pro',
    price: 999,
    imageUrl: 'https://example.com/img.png',
    cpu: 'A18',
    ram: '8GB',
    os: 'iOS',
    storageOptions: [storageOption],
    colorOptions: [colorOption],
  };

  it('should create a valid product', () => {
    expect(product.id).toBe('1');
    expect(product.brand).toBe('Test');
    expect(product.price).toBe(999);
    expect(product.storageOptions).toHaveLength(1);
    expect(product.colorOptions).toHaveLength(1);
  });

  it('should create a cart item', () => {
    const item: CartItem = {
      productId: '1',
      colorCode: 'CBLK',
      storageCode: 'S256',
      quantity: 1,
    };
    expect(item.productId).toBe('1');
    expect(item.quantity).toBe(1);
  });

  it('should create add to cart request', () => {
    const request: AddToCartRequest = {
      productId: '1',
      colorCode: 'CBLK',
      storageCode: 'S256',
    };
    expect(request.productId).toBe('1');
  });

  it('should create add to cart response', () => {
    const response: AddToCartResponse = { cartCount: 3 };
    expect(response.cartCount).toBe(3);
  });

  it('should create a product list item', () => {
    const listItem: ProductListItem = {
      id: '1',
      brand: 'Test',
      model: 'Test Pro',
      price: 999,
      imageUrl: 'https://example.com/img.png',
    };
    expect(listItem.id).toBe('1');
  });
});
