import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../services/notification.service';

@Component({
    selector: 'app-toast',
    imports: [CommonModule],
    template: `
    <div class="toast-container">
      @for (notification of notificationService.notifications(); track notification.id) {
        <div 
          class="toast toast-{{ notification.type }}"
          [attr.data-id]="notification.id"
        >
          <div class="toast-icon">
            @switch (notification.type) {
              @case ('success') {
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              }
              @case ('error') {
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              }
              @case ('warning') {
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              }
              @case ('info') {
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
              }
            }
          </div>
          
          <div class="toast-content">
            <p>{{ notification.message }}</p>
            @if (notification.action) {
              <button 
                class="toast-action"
                (click)="handleAction(notification)"
              >
                {{ notification.action.label }}
              </button>
            }
          </div>
          
          <button 
            class="toast-close"
            (click)="notificationService.dismiss(notification.id)"
            aria-label="Close notification"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      }
    </div>
  `,
    styles: [`
    .toast-container {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 400px;
      pointer-events: none;
    }

    .toast {
      pointer-events: auto;
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 1rem;
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-xl);
      animation: slideInRight 0.3s ease-out;
      transition: all var(--transition-base);
    }

    .toast:hover {
      transform: translateX(-4px);
      box-shadow: var(--shadow-xl), 0 0 20px rgba(255, 255, 255, 0.1);
    }

    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .toast-icon {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
    }

    .toast-success .toast-icon {
      background: rgba(16, 185, 129, 0.2);
      color: var(--success);
    }

    .toast-error .toast-icon {
      background: rgba(239, 68, 68, 0.2);
      color: var(--danger);
    }

    .toast-warning .toast-icon {
      background: rgba(255, 107, 53, 0.2);
      color: var(--warning);
    }

    .toast-info .toast-icon {
      background: rgba(74, 144, 226, 0.2);
      color: var(--secondary);
    }

    .toast-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .toast-content p {
      margin: 0;
      color: var(--text-primary);
      font-size: 0.875rem;
      line-height: 1.5;
    }

    .toast-action {
      align-self: flex-start;
      background: transparent;
      border: none;
      color: var(--primary);
      font-weight: 600;
      font-size: 0.8125rem;
      cursor: pointer;
      padding: 0;
      transition: opacity var(--transition-fast);
    }

    .toast-action:hover {
      opacity: 0.8;
      text-decoration: underline;
    }

    .toast-close {
      flex-shrink: 0;
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 0.25rem;
      border-radius: var(--radius-sm);
      transition: all var(--transition-fast);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .toast-close:hover {
      background: var(--bg-tertiary);
      color: var(--text-primary);
    }

    @media (max-width: 768px) {
      .toast-container {
        left: 1rem;
        right: 1rem;
        max-width: none;
      }
    }
  `]
})
export class ToastComponent {
    notificationService = inject(NotificationService);

    handleAction(notification: Notification): void {
        if (notification.action) {
            notification.action.callback();
            this.notificationService.dismiss(notification.id);
        }
    }
}
