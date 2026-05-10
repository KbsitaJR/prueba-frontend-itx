import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { retry, timeout, catchError } from 'rxjs/operators';
import { API_CONFIG } from '../../config/api.config';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private readonly http: HttpClient) {}

  get<T>(path: string): Observable<T> {
    return this.http.get<T>(`${API_CONFIG.baseUrl}${path}`).pipe(
      timeout(API_CONFIG.timeout),
      retry({
        count: API_CONFIG.retry.maxAttempts,
        delay: (_error, retryCount) => timer(API_CONFIG.retry.delayMs * retryCount),
      }),
      catchError(this.handleError),
    );
  }

  post<T, B>(path: string, body: B): Observable<T> {
    return this.http.post<T>(`${API_CONFIG.baseUrl}${path}`, body).pipe(
      timeout(API_CONFIG.timeout),
      retry({
        count: API_CONFIG.retry.maxAttempts,
        delay: (_error, retryCount) => timer(API_CONFIG.retry.delayMs * retryCount),
      }),
      catchError(this.handleError),
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const message = error.status === 0
      ? 'Network error - please check your connection'
      : `Server error (${error.status}): ${error.message}`;
    return throwError(() => new Error(message));
  }
}
