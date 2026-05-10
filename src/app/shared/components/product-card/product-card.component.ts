import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ProductListItem } from '../../../models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  template: `
    <a
      [routerLink]="['/product', product().id]"
      class="group block cursor-pointer rounded-xl border border-gray-100 bg-white p-4 transition-all duration-200 hover:border-gray-200 hover:shadow-sm"
    >
      <div class="aspect-square overflow-hidden rounded-lg bg-gray-50">
        <img
          [src]="product().imageUrl"
          [alt]="product().brand + ' ' + product().model"
          class="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div class="mt-4 space-y-1">
        <p class="text-xs font-medium uppercase tracking-wider text-gray-400">
          {{ product().brand }}
        </p>
        <h3 class="font-medium text-gray-900 group-hover:text-gray-600">
          {{ product().model }}
        </h3>
        <p class="text-lg font-semibold text-gray-900">
          {{ product().price | currency }}
        </p>
      </div>
    </a>
  `,
})
export class ProductCardComponent {
  readonly product = input.required<ProductListItem>();
}
