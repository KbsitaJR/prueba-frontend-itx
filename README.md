# MobileStore

Premium e-commerce SPA for mobile devices built with Angular 21, Signals, Standalone Components, and TailwindCSS v4.

## Tech Stack

| Technology | Purpose |
|---|---|
| Angular 21 | Framework (Standalone Components) |
| TypeScript 5.9 | Language (strict mode) |
| Angular Signals | State management |
| RxJS 7 | Reactive programming |
| TailwindCSS v4 | Styling |
| Vitest | Unit/Integration tests |
| ESLint + Prettier | Code quality |
| Husky + lint-staged | Git hooks |

## Quick Start

```bash
npm install
npm start        # http://localhost:4200
```

## Scripts

| Command | Description |
|---|---|
| `npm start` | Development server |
| `npm run build` | Production build |
| `npm test` | Run unit tests |
| `npm run test:watch` | Watch mode tests |
| `npm run lint` | ESLint check |
| `npm run format` | Prettier check |
| `npm run format:fix` | Format all files |

## Architecture

```
src/
├── app/
│   ├── config/          # App configuration (API endpoints, cache TTL)
│   ├── core/
│   │   ├── api/         # ApiService, interceptors, mock data
│   │   └── cache/       # Client cache with 1h expiration
│   ├── features/
│   │   ├── product-list/ # PLP - Product List Page (lazy)
│   │   └── product-detail/ # PDP - Product Details Page (lazy)
│   ├── layout/          # App shell (header, footer)
│   ├── models/          # Domain models and DTOs
│   ├── shared/
│   │   ├── components/  # ProductCard, Skeleton, Breadcrumb
│   │   ├── types/       # Shared type utilities
│   │   └── utils/       # Debounce utility
│   └── store/           # Cart store (Signals + localStorage)
```

### Key Decisions

**Angular Signals over NgRx**: For an app of this scope, Signals provide lightweight, type-safe state management without NgRx boilerplate. The CartStore uses `signal()` + `computed()` with automatic localStorage persistence via `effect()`.

**Standalone Components**: No NgModules. Every component declares its own imports. Routes use `loadComponent()` for lazy loading.

**Cache Strategy**: RxJS-based in-memory cache backed by localStorage with 1-hour TTL. Tradeoff: simple, fast, survives refresh, no stale-while-revalidate pattern (could add SWR with RxJS `BehaviorSubject`).

**Mock API Interceptor**: Intercepts `api.example.com` requests and returns realistic mock data with simulated latency. Swap for real `HttpInterceptor` in production.

## Features

- **Product List**: Responsive grid (4 cols desktop, 2 tablet, 1 mobile), real-time search with debounce, skeleton loading, error/empty states
- **Product Details**: Two-column layout, image viewer, storage/color selectors (auto-selected when single option), add-to-cart action
- **Cart**: Global counter in header, persists to localStorage
- **Cache**: 1-hour TTL, automatic revalidation, memory + localStorage fallback
- **UX**: Sticky header with blur backdrop, breadcrumbs, smooth transitions, keyboard navigation, ARIA labels

## API

The app expects these endpoints (currently mocked):

| Method | Path | Description |
|---|---|---|
| GET | `/products` | List all products |
| GET | `/products/:id` | Product details |
| POST | `/cart` | Add to cart (body: `{ productId, colorCode, storageCode }`) |

## Future Improvements

- Angular SSR/Hydration for faster LCP
- Virtual scrolling for large product lists (`@angular/cdk/scrolling`)
- Image optimization pipeline (WebP, responsive srcset)
- E2E tests with Playwright
- PWA with service worker for offline support
- Stripe/payment integration
- i18n with @angular/localize
- Storybook for component library documentation

## License

MIT
