import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Product, ProductListItem } from '../../models/product.model';
import { ApiService } from './api.service';
import { CacheService } from '../cache/cache.service';
import { API_CONFIG } from '../../config/api.config';

const CACHE_TTL = API_CONFIG.cache.ttlMs;

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly api = inject(ApiService);
  private readonly cache = inject(CacheService);

  getProducts(): Observable<ProductListItem[]> {
    const cacheKey = API_CONFIG.endpoints.products;
    const cached = this.cache.get<ProductListItem[]>(cacheKey);
    if (cached) {
      return of(cached);
    }
    return this.api.get<Product[]>(API_CONFIG.endpoints.products).pipe(
      map((products) =>
        products.map((p) => ({
          id: p.id,
          brand: p.brand,
          model: p.model,
          price: p.price,
          imageUrl: p.imageUrl,
        })),
      ),
      tap((products) => this.cache.set(cacheKey, products, CACHE_TTL)),
    );
  }

  getProductById(id: string): Observable<Product> {
    const cacheKey = `${API_CONFIG.endpoints.products}/${id}`;
    const cached = this.cache.get<Product>(cacheKey);
    if (cached) {
      return of(cached);
    }
    return this.api
      .get<Product>(API_CONFIG.endpoints.productDetail(id))
      .pipe(tap((product) => this.cache.set(cacheKey, product, CACHE_TTL)));
  }

  refreshProducts(): Observable<ProductListItem[]> {
    this.cache.invalidate(API_CONFIG.endpoints.products);
    return this.getProducts();
  }
}
