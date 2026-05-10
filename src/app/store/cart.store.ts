import { Injectable, signal, computed } from '@angular/core';
import { Observable } from 'rxjs';
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
  readonly cartTotal = computed(() =>
    this.items().reduce((sum, item) => sum + item.price * item.quantity, 0),
  );

  constructor(private readonly api: ApiService) {}

  addToCart(request: AddToCartRequest, display: Omit<CartItem, keyof AddToCartRequest | 'quantity'>): Observable<AddToCartResponse> {
    const optimistic = this.applyOptimisticUpdate(request, display);

    return new Observable<AddToCartResponse>((observer) => {
      this.api.post<AddToCartResponse, AddToCartRequest>(
        API_CONFIG.endpoints.cart,
        request,
      ).subscribe({
        next: (response) => {
          observer.next(response);
          observer.complete();
        },
        error: (err) => {
          this.rollback(optimistic);
          observer.error(err);
        },
      });
    });
  }

  removeItem(productId: string, colorCode: string, storageCode: string): void {
    this.items.update((current) =>
      current.filter(
        (item) =>
          !(item.productId === productId &&
            item.colorCode === colorCode &&
            item.storageCode === storageCode),
      ),
    );
    this.persist(this.items());
  }

  updateQuantity(productId: string, colorCode: string, storageCode: string, delta: number): void {
    this.items.update((current) => {
      const updated = current
        .map((item) => {
          if (item.productId === productId && item.colorCode === colorCode && item.storageCode === storageCode) {
            const newQty = item.quantity + delta;
            return newQty <= 0 ? null : { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
      this.persist(updated);
      return updated;
    });
  }

  clearCart(): void {
    this.items.set([]);
    this.persist([]);
  }

  private applyOptimisticUpdate(request: AddToCartRequest, display: Omit<CartItem, keyof AddToCartRequest | 'quantity'>): CartItem[] {
    const previous = [...this.items()];
    this.items.update((current) => {
      const existing = current.find(
        (item) =>
          item.productId === request.productId &&
          item.colorCode === request.colorCode &&
          item.storageCode === request.storageCode,
      );
      const updated = existing
        ? current.map((item) =>
            item === existing
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          )
        : [
            ...current,
            {
              ...request,
              ...display,
              quantity: 1,
            },
          ];
      this.persist(updated);
      return updated;
    });
    return previous;
  }

  private rollback(previous: CartItem[]): void {
    this.items.set(previous);
    this.persist(previous);
  }

  private persist(items: CartItem[]): void {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // silently fail
    }
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
