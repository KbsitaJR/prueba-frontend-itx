import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MOCK_PRODUCTS } from './mock.data';
import { AddToCartResponse } from '../../models/product.model';

export const mockApiInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  if (req.url.includes('api.example.com')) {
    const delayMs = 300 + Math.random() * 400;

    if (req.url.endsWith('/products') && req.method === 'GET') {
      return of(new HttpResponse({ status: 200, body: MOCK_PRODUCTS })).pipe(delay(delayMs));
    }

    const productMatch = req.url.match(/\/products\/(.+)$/);
    if (productMatch && req.method === 'GET') {
      const product = MOCK_PRODUCTS.find((p) => p.id === productMatch[1]);
      if (product) {
        return of(new HttpResponse({ status: 200, body: product })).pipe(delay(delayMs));
      }
      return of(new HttpResponse({ status: 404, body: { error: 'Product not found' } }));
    }

    if (req.url.endsWith('/cart') && req.method === 'POST') {
      const response: AddToCartResponse = { cartCount: Math.floor(Math.random() * 5) + 1 };
      return of(new HttpResponse({ status: 200, body: response })).pipe(delay(delayMs));
    }
  }

  return next(req);
};
