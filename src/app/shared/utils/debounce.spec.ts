import { describe, it, expect } from 'vitest';
import { createDebouncedSearch } from './debounce';

describe('createDebouncedSearch', () => {
  it('should create a debounced search utility', () => {
    const search = createDebouncedSearch(300);
    expect(search.searchInput).toBeDefined();
    expect(search.searchResults).toBeDefined();
    expect(search.destroy).toBeDefined();
    search.destroy();
  });

  it('should emit debounced values', async () => {
    const search = createDebouncedSearch(100);
    const results: string[] = [];

    const sub = search.searchResults.subscribe((value) => {
      results.push(value);
    });

    search.searchInput('a');
    search.searchInput('ap');
    search.searchInput('app');

    await new Promise((r) => setTimeout(r, 200));

    expect(results).toContain('app');
    sub.unsubscribe();
    search.destroy();
  });
});
