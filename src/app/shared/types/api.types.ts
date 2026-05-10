export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface RequestState<T> {
  data: T | null;
  loading: LoadingState;
  error: string | null;
}
