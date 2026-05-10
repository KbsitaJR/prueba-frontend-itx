import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ProductService } from '../../core/api/product.service';
import { ProductListItem } from '../../models/product.model';
import { LoadingState } from '../../shared/types/api.types';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductCardComponent, SkeletonComponent],
  template: `
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">Products</h1>
        <p class="mt-2 text-gray-500">Browse our collection of mobile devices.</p>
      </div>

      <div class="relative mb-8">
        <input
          type="text"
          placeholder="Search by brand or model..."
          (input)="onSearch($event)"
          class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pl-11 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-gray-300 focus:outline-none focus:ring-0"
          aria-label="Search products"
        />
        <svg
          class="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </div>

      @switch (loadingState()) {
        @case ('loading') {
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            @for (_ of [1, 2, 3, 4, 5, 6, 7, 8]; track _) {
              <app-skeleton />
            }
          </div>
        }
        @case ('error') {
          <div class="flex flex-col items-center justify-center py-20 text-center">
            <svg class="mb-4 h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <p class="text-lg font-medium text-gray-900">Something went wrong</p>
            <p class="mt-1 text-sm text-gray-500">Failed to load products. Please try again.</p>
            <button
              (click)="loadProducts()"
              class="mt-4 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Try again
            </button>
          </div>
        }
        @case ('success') {
          @if (filteredProducts().length === 0) {
            <div class="flex flex-col items-center justify-center py-20 text-center">
              <svg class="mb-4 h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
              </svg>
              <p class="text-lg font-medium text-gray-900">No products found</p>
              <p class="mt-1 text-sm text-gray-500">Try adjusting your search terms.</p>
            </div>
          } @else {
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              @for (product of filteredProducts(); track product.id) {
                <app-product-card [product]="product" />
              }
            </div>
          }
        }
      }
    </div>
  `,
})
export default class ProductListComponent implements OnInit, OnDestroy {
  private readonly productService = inject(ProductService);

  protected readonly loadingState = signal<LoadingState>('idle');
  protected readonly products = signal<ProductListItem[]>([]);
  protected readonly searchQuery = signal('');
  protected readonly filteredProducts = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) {
      return this.products();
    }
    return this.products().filter(
      (p) =>
        p.brand.toLowerCase().includes(query) ||
        p.model.toLowerCase().includes(query),
    );
  });

  private readonly searchSubject = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  constructor() {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
      )
      .subscribe((query) => this.searchQuery.set(query));
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value);
  }

  protected loadProducts(): void {
    this.loadingState.set('loading');
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loadingState.set('success');
      },
      error: () => {
        this.loadingState.set('error');
      },
    });
  }
}
