import { Component } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  template: `
    <div class="animate-pulse rounded-xl bg-gray-100 p-4">
      <div class="aspect-square rounded-lg bg-gray-200"></div>
      <div class="mt-4 space-y-2">
        <div class="h-3 w-2/3 rounded bg-gray-200"></div>
        <div class="h-4 w-1/2 rounded bg-gray-200"></div>
        <div class="h-4 w-1/3 rounded bg-gray-200"></div>
      </div>
    </div>
  `,
})
export class SkeletonComponent {}
