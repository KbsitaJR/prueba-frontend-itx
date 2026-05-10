import { Component, inject, computed } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CartStore } from '../../store/cart.store';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <a
            routerLink="/"
            class="flex items-center gap-2 text-xl font-semibold tracking-tight text-gray-900 transition-colors hover:text-gray-600"
          >
            <span
              class="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-xs font-bold text-white"
            >
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

        @if (breadcrumbs().length > 0) {
          <nav aria-label="Breadcrumb" class="-mt-1 pb-3">
            <ol class="flex items-center gap-2 text-xs text-gray-400">
              @for (crumb of breadcrumbs(); track crumb.path; let last = $last) {
                <li class="flex items-center gap-2">
                  @if (!last) {
                    <a [routerLink]="crumb.path" class="transition-colors hover:text-gray-600">
                      {{ crumb.label }}
                    </a>
                    <svg
                      class="h-3 w-3 text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  } @else {
                    <span class="font-medium text-gray-600" aria-current="page">
                      {{ crumb.label }}
                    </span>
                  }
                </li>
              }
            </ol>
          </nav>
        }
      </div>
    </header>
  `,
})
export class HeaderComponent {
  private readonly router = inject(Router);
  private readonly cartStore = inject(CartStore);
  readonly cartCount = this.cartStore.cartCount;

  readonly breadcrumbs = computed(() => {
    const segments = this.router.url.split('?')[0].split('/').filter(Boolean);
    if (segments.length === 0) return [];

    const crumbs: { label: string; path: string }[] = [{ label: 'Products', path: '/' }];

    if (segments[0] === 'product' && segments[1]) {
      crumbs.push({ label: 'Product Details', path: '' });
    } else if (segments[0] === 'cart') {
      crumbs.push({ label: 'Cart', path: '' });
    }

    return crumbs;
  });
}
