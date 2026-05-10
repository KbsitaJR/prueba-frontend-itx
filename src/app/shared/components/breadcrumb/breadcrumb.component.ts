import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

interface BreadcrumbItem {
  label: string;
  path: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav aria-label="Breadcrumb" class="mb-6">
      <ol class="flex items-center gap-2 text-sm text-gray-500">
        @for (crumb of breadcrumbs(); track crumb.path; let last = $last) {
          <li class="flex items-center gap-2">
            @if (!last) {
              <a
                [routerLink]="crumb.path"
                class="transition-colors hover:text-gray-900"
              >
                {{ crumb.label }}
              </a>
              <svg class="h-3.5 w-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            } @else {
              <span class="font-medium text-gray-900" aria-current="page">
                {{ crumb.label }}
              </span>
            }
          </li>
        }
      </ol>
    </nav>
  `,
})
export class BreadcrumbComponent {
  readonly breadcrumbs = input.required<BreadcrumbItem[]>();
}
