import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastStore {
  private readonly toasts = signal<Toast[]>([]);
  readonly visibleToasts = this.toasts.asReadonly();

  show(message: string, type: Toast['type'] = 'success', durationMs = 3000): void {
    const id = crypto.randomUUID();
    this.toasts.update((current) => [...current, { id, message, type }]);

    setTimeout(() => {
      this.toasts.update((current) => current.filter((t) => t.id !== id));
    }, durationMs);
  }

  remove(id: string): void {
    this.toasts.update((current) => current.filter((t) => t.id !== id));
  }
}
