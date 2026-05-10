import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartStore } from '../../store/cart.store';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a
          routerLink="/"
          class="flex items-center gap-2 text-xl font-semibold tracking-tight text-gray-900 transition-colors hover:text-gray-600"
        >
          <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-xs font-bold text-white">
            MS
          </span>
          MobileStore
        </a>

        <nav class="flex items-center gap-6">
          <a
            routerLink="/"
            class="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
          >
            Products
          </a>

          <a
            routerLink="/cart"
            class="relative flex items-center gap-2 rounded-full border border-gray-200 px-4 py-1.5 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50"
            aria-label="Shopping cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            @if (cartCount() > 0) {
              <span
                class="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gray-900 px-1 text-[11px] font-semibold text-white"
              >
                {{ cartCount() }}
              </span>
            }
          </a>
        </nav>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  private readonly cartStore = inject(CartStore);
  readonly cartCount = this.cartStore.cartCount;
}
