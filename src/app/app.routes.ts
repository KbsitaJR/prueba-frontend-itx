import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/product-list/product-list.component'),
    title: 'Products - MobileStore',
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./features/product-detail/product-detail.component'),
    title: 'Product Details - MobileStore',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
