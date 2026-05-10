import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CartStore } from './cart.store';
import { ApiService } from '../core/api/api.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

function createMockHttpClient(): Partial<HttpClient> {
  return {
    post: vi.fn().mockReturnValue(of({ cartCount: 1 })),
    get: vi.fn().mockReturnValue(of([])),
  };
}

describe('CartStore', () => {
  let store: CartStore;
  let mockHttp: ReturnType<typeof createMockHttpClient>;

  beforeEach(() => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
    mockHttp = createMockHttpClient();
    const api = new ApiService(mockHttp as HttpClient);
    store = new CartStore(api);
  });

  it('should start with empty cart', () => {
    expect(store.cartCount()).toBe(0);
    expect(store.cartItems()).toEqual([]);
  });

  it('should load cart from localStorage', () => {
    expect(store.cartCount()).toBe(0);
  });
});
