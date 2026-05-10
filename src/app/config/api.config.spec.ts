import { describe, it, expect } from 'vitest';
import { API_CONFIG } from './api.config';

describe('API_CONFIG', () => {
  it('should have a baseUrl defined', () => {
    expect(API_CONFIG.baseUrl).toBeDefined();
    expect(API_CONFIG.baseUrl).toContain('http');
  });

  it('should have endpoints defined', () => {
    expect(API_CONFIG.endpoints.products).toBe('/products');
    expect(API_CONFIG.endpoints.cart).toBe('/cart');
  });

  it('should have retry configuration', () => {
    expect(API_CONFIG.retry.maxAttempts).toBeGreaterThan(0);
    expect(API_CONFIG.retry.delayMs).toBeGreaterThanOrEqual(0);
  });

  it('should have cache TTL of 1 hour', () => {
    expect(API_CONFIG.cache.ttlMs).toBe(3600000);
  });
});
