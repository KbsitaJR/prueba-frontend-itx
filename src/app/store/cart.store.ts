import { Injectable, signal, computed, effect } from '@angular/core';
import { CartItem, AddToCartRequest, AddToCartResponse } from '../models/product.model';
import { ApiService } from '../core/api/api.service';
import { API_CONFIG } from '../config/api.config';

const CART_STORAGE_KEY = 'mobile-store-cart';

@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly items = signal<CartItem[]>(this.loadCart());
  readonly cartCount = computed(() =>
    this.items().reduce((sum, item) => sum + item.quantity, 0),
  );
  readonly cartItems = this.items.asReadonly();

  constructor(private readonly api: ApiService) {
    effect(() => {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.items()));
      } catch {
        // silently fail
      }
    });
  }

  addToCart(request: AddToCartRequest): void {
    this.api.post<AddToCartResponse, AddToCartRequest>(
      API_CONFIG.endpoints.cart,
      request,
    ).subscribe({
      next: (response) => {
        this.items.update((current) => {
          const existing = current.find(
            (item) =>
              item.productId === request.productId &&
              item.colorCode === request.colorCode &&
              item.storageCode === request.storageCode,
          );
          if (existing) {
            return current.map((item) =>
              item === existing
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            );
          }
          return [
            ...current,
            {
              productId: request.productId,
              colorCode: request.colorCode,
              storageCode: request.storageCode,
              quantity: 1,
            },
          ];
        });
      },
      error: (err) => console.error('Failed to add item to cart:', err),
    });
  }

  private loadCart(): CartItem[] {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
}
