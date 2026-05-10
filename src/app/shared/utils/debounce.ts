import { Subject, Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

export function createDebouncedSearch(debounceMs: number = 300): {
  searchInput: (value: string) => void;
  searchResults: Observable<string>;
  destroy: () => void;
} {
  const searchSubject = new Subject<string>();

  const searchResults = searchSubject.pipe(
    debounceTime(debounceMs),
    distinctUntilChanged(),
  );

  const subscriptions: Subscription[] = [];

  return {
    searchInput: (value: string) => searchSubject.next(value),
    searchResults,
    destroy: () => {
      searchSubject.complete();
      subscriptions.forEach((s) => s.unsubscribe());
    },
  };
}
