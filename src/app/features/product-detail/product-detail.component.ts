import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CurrencyPipe, Location } from '@angular/common';
import { Product, StorageOption, ColorOption } from '../../models/product.model';
import { ProductService } from '../../core/api/product.service';
import { CartStore } from '../../store/cart.store';
import { ToastStore } from '../../shared/components/toast/toast.store';
import { LoadingState } from '../../shared/types/api.types';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <button
        (click)="goBack()"
        class="mb-6 flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-900"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
        Back
      </button>

      @switch (loadingState()) {
        @case ('loading') {
          <div class="grid gap-12 lg:grid-cols-2">
            <div class="aspect-square animate-pulse rounded-2xl bg-gray-100"></div>
            <div class="animate-pulse space-y-4">
              <div class="h-4 w-24 rounded bg-gray-100"></div>
              <div class="h-8 w-64 rounded bg-gray-100"></div>
              <div class="h-6 w-32 rounded bg-gray-100"></div>
              <div class="mt-6 space-y-2">
                @for (_ of [1, 2, 3, 4, 5, 6, 7, 8]; track _) {
                  <div class="h-4 w-full rounded bg-gray-100"></div>
                }
              </div>
            </div>
          </div>
        }
        @case ('error') {
          <div class="flex flex-col items-center justify-center py-20 text-center">
            <p class="text-lg font-medium text-gray-900">Failed to load product</p>
            <button
              (click)="loadProduct()"
              class="mt-4 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Try again
            </button>
          </div>
        }
        @case ('success') {
          @let product = productData()!;
          <div class="grid gap-12 lg:grid-cols-2">
            <div class="sticky top-24 aspect-square overflow-hidden rounded-2xl bg-gray-50 p-8">
              <img
                [src]="selectedImage()"
                [alt]="product.brand + ' ' + product.model"
                class="h-full w-full object-contain"
              />
            </div>

            <div>
              <p class="text-xs font-medium uppercase tracking-widest text-gray-400">
                {{ product.brand }}
              </p>
              <h1 class="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                {{ product.model }}
              </h1>
              <p class="mt-3 text-2xl font-semibold text-gray-900">
                {{ product.price | currency }}
              </p>

              <div class="mt-8 space-y-6">
                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700">Storage</label>
                  <div class="flex flex-wrap gap-2">
                    @for (option of storageOptions(); track option.code) {
                      <button
                        (click)="selectStorage(option)"
                        [attr.aria-pressed]="selectedStorage()?.code === option.code"
                        class="rounded-lg border px-4 py-2 text-sm font-medium transition-all"
                        [class]="
                          selectedStorage()?.code === option.code
                            ? 'border-gray-900 bg-gray-900 text-white'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                        "
                      >
                        {{ option.name }}
                      </button>
                    }
                  </div>
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700">Color</label>
                  <div class="flex flex-wrap gap-3">
                    @for (option of colorOptions(); track option.code) {
                      <button
                        (click)="selectColor(option)"
                        [attr.aria-label]="option.name"
                        [attr.aria-pressed]="selectedColor()?.code === option.code"
                        class="relative flex h-10 w-10 items-center justify-center rounded-full transition-all"
                        [style.background-color]="option.hex"
                        [class]="
                          selectedColor()?.code === option.code
                            ? 'ring-2 ring-gray-900 ring-offset-2'
                            : 'ring-1 ring-gray-200 hover:ring-gray-300'
                        "
                      >
                        @if (selectedColor()?.code === option.code) {
                          <svg
                            class="h-4 w-4 text-white mix-blend-difference"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2.5"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M4.5 12.75l6 6 9-13.5"
                            />
                          </svg>
                        }
                      </button>
                    }
                  </div>
                  @if (selectedColor()) {
                    <p class="mt-1.5 text-sm text-gray-500">{{ selectedColor()!.name }}</p>
                  }
                </div>

                <button
                  (click)="addToCart()"
                  [disabled]="addingToCart()"
                  class="w-full rounded-xl px-6 py-3 text-sm font-medium text-white transition-all active:scale-[0.98]"
                  [class]="
                    addingToCart()
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gray-900 hover:bg-gray-800'
                  "
                >
                  @if (addingToCart()) {
                    <span class="flex items-center justify-center gap-2">
                      <svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle
                          class="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                        />
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Adding...
                    </span>
                  } @else {
                    Add to Cart
                  }
                </button>
              </div>

              <div class="mt-10 border-t border-gray-100 pt-8">
                <h2 class="text-sm font-medium uppercase tracking-widest text-gray-400">
                  Specifications
                </h2>
                <dl class="mt-4 space-y-3">
                  @if (product.cpu) {
                    <div class="flex justify-between">
                      <dt class="text-sm text-gray-500">CPU</dt>
                      <dd class="text-sm font-medium text-gray-900">{{ product.cpu }}</dd>
                    </div>
                  }
                  @if (product.ram) {
                    <div class="flex justify-between">
                      <dt class="text-sm text-gray-500">RAM</dt>
                      <dd class="text-sm font-medium text-gray-900">{{ product.ram }}</dd>
                    </div>
                  }
                  @if (product.os) {
                    <div class="flex justify-between">
                      <dt class="text-sm text-gray-500">OS</dt>
                      <dd class="text-sm font-medium text-gray-900">{{ product.os }}</dd>
                    </div>
                  }
                  @if (product.screenResolution) {
                    <div class="flex justify-between">
                      <dt class="text-sm text-gray-500">Screen</dt>
                      <dd class="text-sm font-medium text-gray-900">
                        {{ product.screenResolution }}
                      </dd>
                    </div>
                  }
                  @if (product.battery) {
                    <div class="flex justify-between">
                      <dt class="text-sm text-gray-500">Battery</dt>
                      <dd class="text-sm font-medium text-gray-900">{{ product.battery }}</dd>
                    </div>
                  }
                  @if (product.cameras && product.cameras.length > 0) {
                    <div class="flex justify-between">
                      <dt class="text-sm text-gray-500">Camera</dt>
                      <dd class="text-sm font-medium text-gray-900">
                        {{ product.cameras.join(', ') }}
                      </dd>
                    </div>
                  }
                  @if (product.dimensions) {
                    <div class="flex justify-between">
                      <dt class="text-sm text-gray-500">Dimensions</dt>
                      <dd class="text-sm font-medium text-gray-900">{{ product.dimensions }}</dd>
                    </div>
                  }
                  @if (product.weight) {
                    <div class="flex justify-between">
                      <dt class="text-sm text-gray-500">Weight</dt>
                      <dd class="text-sm font-medium text-gray-900">{{ product.weight }}</dd>
                    </div>
                  }
                </dl>
              </div>
            </div>
          </div>
        }
      }
    </div>
  `,
})
export default class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly productService = inject(ProductService);
  private readonly cartStore = inject(CartStore);
  private readonly toast = inject(ToastStore);

  protected readonly loadingState = signal<LoadingState>('idle');
  protected readonly productData = signal<Product | null>(null);
  protected readonly addingToCart = signal(false);

  protected readonly selectedStorage = signal<StorageOption | null>(null);
  protected readonly selectedColor = signal<ColorOption | null>(null);

  protected readonly storageOptions = computed(() => this.productData()?.storageOptions ?? []);
  protected readonly colorOptions = computed(() => this.productData()?.colorOptions ?? []);
  protected readonly selectedImage = computed(() => {
    const color = this.selectedColor();
    if (color?.imageUrl) return color.imageUrl;
    return this.productData()?.imageUrl ?? '';
  });

  ngOnInit(): void {
    this.loadProduct();
  }

  protected loadProduct(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.loadingState.set('loading');
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.productData.set(product);
        this.loadingState.set('success');
        if (product.storageOptions.length > 0) {
          this.selectedStorage.set(product.storageOptions[0]);
        }
        if (product.colorOptions.length > 0) {
          this.selectedColor.set(product.colorOptions[0]);
        }
      },
      error: () => this.loadingState.set('error'),
    });
  }

  protected selectStorage(option: StorageOption): void {
    this.selectedStorage.set(option);
  }

  protected selectColor(option: ColorOption): void {
    this.selectedColor.set(option);
  }

  protected addToCart(): void {
    const product = this.productData();
    const storage = this.selectedStorage();
    const color = this.selectedColor();
    if (!product || !storage || !color) return;

    this.addingToCart.set(true);
    this.cartStore
      .addToCart(
        {
          productId: product.id,
          colorCode: color.code,
          storageCode: storage.code,
        },
        {
          productName: product.model,
          brand: product.brand,
          price: product.price,
          imageUrl: product.imageUrl,
          colorName: color.name,
          storageName: storage.name,
        },
      )
      .subscribe({
        next: () => {
          this.addingToCart.set(false);
          this.toast.show(
            `${product.brand} ${product.model} (${storage.name}, ${color.name}) added to cart`,
            'success',
          );
        },
        error: () => {
          this.addingToCart.set(false);
          this.toast.show('Failed to add item to cart. Please try again.', 'error');
        },
      });
  }

  protected goBack(): void {
    this.location.back();
  }
}
