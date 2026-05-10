import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CacheService {
  private readonly memoryCache = new Map<
    string,
    { data: unknown; timestamp: number; ttl: number }
  >();

  get<T>(key: string): T | null {
    const entry = this.memoryCache.get(key);
    if (entry && !this.isExpired(entry)) {
      return entry.data as T;
    }
    if (entry) {
      this.memoryCache.delete(key);
    }
    return null;
  }

  set<T>(key: string, data: T, ttlMs: number): void {
    const entry = { data, timestamp: Date.now(), ttl: ttlMs };
    this.memoryCache.set(key, entry);
    try {
      localStorage.setItem(key, JSON.stringify(entry));
    } catch {
      // silently fail
    }
  }

  invalidate(key: string): void {
    this.memoryCache.delete(key);
    try {
      localStorage.removeItem(key);
    } catch {
      // silently fail
    }
  }

  clear(): void {
    this.memoryCache.clear();
  }

  private isExpired(entry: { timestamp: number; ttl: number }): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }
}
