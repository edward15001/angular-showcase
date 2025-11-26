import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
    id: string;
    type: NotificationType;
    message: string;
    duration?: number;
    action?: {
        label: string;
        callback: () => void;
    };
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private _notifications = signal<Notification[]>([]);
    notifications = this._notifications.asReadonly();

    private idCounter = 0;

    /**
     * Show a success notification
     */
    success(message: string, duration: number = 3000): void {
        this.show({
            type: 'success',
            message,
            duration
        });
    }

    /**
     * Show an error notification
     */
    error(message: string, duration: number = 5000): void {
        this.show({
            type: 'error',
            message,
            duration
        });
    }

    /**
     * Show an info notification
     */
    info(message: string, duration: number = 3000): void {
        this.show({
            type: 'info',
            message,
            duration
        });
    }

    /**
     * Show a warning notification
     */
    warning(message: string, duration: number = 4000): void {
        this.show({
            type: 'warning',
            message,
            duration
        });
    }

    /**
     * Show a notification with custom options
     */
    show(options: Omit<Notification, 'id'>): void {
        const notification: Notification = {
            id: `notification-${++this.idCounter}`,
            ...options
        };

        this._notifications.update(notifications => [...notifications, notification]);

        // Auto-dismiss after duration
        if (notification.duration && notification.duration > 0) {
            setTimeout(() => {
                this.dismiss(notification.id);
            }, notification.duration);
        }
    }

    /**
     * Dismiss a notification by ID
     */
    dismiss(id: string): void {
        this._notifications.update(notifications =>
            notifications.filter(n => n.id !== id)
        );
    }

    /**
     * Clear all notifications
     */
    clearAll(): void {
        this._notifications.set([]);
    }
}
