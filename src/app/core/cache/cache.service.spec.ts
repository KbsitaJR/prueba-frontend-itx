import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CacheService } from './cache.service';

describe('CacheService', () => {
  let service: CacheService;
  let storage: Record<string, string> = {};

  beforeEach(() => {
    storage = {};
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key: string) => storage[key] ?? null);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key: string, value: string) => { storage[key] = value; });
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation((key: string) => { delete storage[key]; });
    service = new CacheService();
  });

  it('should store and retrieve data', () => {
    service.set('key1', { name: 'test' }, 3600000);
    const result = service.get<{ name: string }>('key1');
    expect(result).toEqual({ name: 'test' });
  });

  it('should return null for expired data', () => {
    service.set('key1', { name: 'test' }, -1);
    const result = service.get<{ name: string }>('key1');
    expect(result).toBeNull();
  });

  it('should return null for non-existent key', () => {
    const result = service.get('nonexistent');
    expect(result).toBeNull();
  });

  it('should invalidate data by key', () => {
    service.set('key1', 'value', 3600000);
    service.invalidate('key1');
    expect(service.get('key1')).toBeNull();
  });

  it('should clear all data', () => {
    service.set('key1', 'value1', 3600000);
    service.set('key2', 'value2', 3600000);
    service.clear();
    expect(service.get('key1')).toBeNull();
    expect(service.get('key2')).toBeNull();
  });

  it('should not throw when localStorage is full', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    expect(() => service.set('key', 'value', 3600000)).not.toThrow();
  });
});
