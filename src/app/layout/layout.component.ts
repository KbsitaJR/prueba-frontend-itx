import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { ToastContainerComponent } from '../shared/components/toast/toast.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ToastContainerComponent],
  template: `
    <div class="flex min-h-screen flex-col bg-white">
      <app-header />
      <main class="flex-1">
        <router-outlet />
      </main>
      <app-toast-container />
      <footer class="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        &copy; 2026 MobileStore. All rights reserved.
      </footer>
    </div>
  `,
})
export class LayoutComponent {}
