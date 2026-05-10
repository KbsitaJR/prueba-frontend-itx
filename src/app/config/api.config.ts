export const API_CONFIG = {
  baseUrl: 'https://api.example.com',
  endpoints: {
    products: '/products',
    productDetail: (id: string) => `/products/${id}`,
    cart: '/cart',
  },
  retry: {
    maxAttempts: 3,
    delayMs: 1000,
  },
  timeout: 10000,
  cache: {
    ttlMs: 3600000,
    storageKey: 'mobile-store-cache',
  },
} as const;
