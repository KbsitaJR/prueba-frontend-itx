import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartStore } from '../../store/cart.store';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  template: `
    <div class="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold tracking-tight text-gray-900">Cart</h1>

      @if (store.cartItems().length === 0) {
        <div class="flex flex-col items-center justify-center py-20 text-center">
          <svg
            class="mb-4 h-16 w-16 text-gray-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
          <p class="text-lg font-medium text-gray-900">Your cart is empty</p>
          <p class="mt-1 text-sm text-gray-500">Add some products to get started.</p>
          <a
            routerLink="/"
            class="mt-6 rounded-xl bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-gray-800"
          >
            Browse Products
          </a>
        </div>
      } @else {
        <div class="mt-8 space-y-4">
          @for (
            item of store.cartItems();
            track item.productId + item.colorCode + item.storageCode
          ) {
            <div
              class="flex items-center gap-4 rounded-xl border border-gray-100 p-4 transition-all hover:border-gray-200"
            >
              <div class="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                <img
                  [src]="item.imageUrl"
                  [alt]="item.productName"
                  class="h-full w-full object-contain p-2"
                />
              </div>

              <div class="min-w-0 flex-1">
                <p class="text-xs font-medium uppercase tracking-wider text-gray-400">
                  {{ item.brand }}
                </p>
                <h3 class="truncate font-medium text-gray-900">{{ item.productName }}</h3>
                <div class="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-500">
                  <span class="flex items-center gap-1">
                    <span
                      class="h-2.5 w-2.5 rounded-full"
                      [style.background-color]="getColorHex(item.colorCode)"
                    ></span>
                    {{ item.colorName }}
                  </span>
                  <span>{{ item.storageName }}</span>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="flex items-center rounded-lg border border-gray-200">
                  <button
                    (click)="
                      store.updateQuantity(item.productId, item.colorCode, item.storageCode, -1)
                    "
                    class="px-2.5 py-1.5 text-gray-500 transition-colors hover:text-gray-900"
                    aria-label="Decrease quantity"
                  >
                    <svg
                      class="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
                    </svg>
                  </button>
                  <span class="min-w-[2ch] text-center text-sm font-medium text-gray-900">{{
                    item.quantity
                  }}</span>
                  <button
                    (click)="
                      store.updateQuantity(item.productId, item.colorCode, item.storageCode, 1)
                    "
                    class="px-2.5 py-1.5 text-gray-500 transition-colors hover:text-gray-900"
                    aria-label="Increase quantity"
                  >
                    <svg
                      class="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m7-7H5" />
                    </svg>
                  </button>
                </div>

                <p class="min-w-[80px] text-right font-medium text-gray-900">
                  {{ item.price * item.quantity | currency }}
                </p>

                <button
                  (click)="store.removeItem(item.productId, item.colorCode, item.storageCode)"
                  class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                  aria-label="Remove item"
                >
                  <svg
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          }
        </div>

        <div class="mt-8 border-t border-gray-100 pt-6">
          <div class="flex items-center justify-between">
            <p class="text-base text-gray-500">Total</p>
            <p class="text-2xl font-semibold text-gray-900">{{ store.cartTotal() | currency }}</p>
          </div>

          <div class="mt-6 flex gap-4">
            <a
              routerLink="/"
              class="flex-1 rounded-xl border border-gray-200 px-6 py-3 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Continue Shopping
            </a>
            <button
              (click)="store.clearCart()"
              class="rounded-xl border border-gray-200 px-6 py-3 text-sm font-medium text-gray-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              Clear Cart
            </button>
          </div>
        </div>
      }
    </div>
  `,
})
export default class CartComponent {
  readonly store = inject(CartStore);

  getColorHex(code: string): string {
    const colors: Record<string, string> = {
      CBLK: '#1a1a1a',
      CWH: '#f0f0f0',
      CNAT: '#8b8b7a',
      CDES: '#c4a882',
      CTI: '#6b6b72',
      CTB: '#4a6fa5',
      CTW: '#e8e8e8',
      CMI: '#98c5b0',
      CLA: '#c4b5d4',
      CGR: '#4a4a4a',
      COB: '#1c1c1e',
      CPO: '#f5f0e8',
      CHA: '#8b8b7a',
      CRO: '#e8b4b8',
      CSK: '#b8d4e8',
      CBL: '#1a1a1a',
      CGW: '#e8e8f0',
      CSR: '#0a0a0a',
      CMB: '#2d4a7a',
    };
    return colors[code] ?? '#ccc';
  }
}
