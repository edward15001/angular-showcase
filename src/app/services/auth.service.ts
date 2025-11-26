import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export interface User {
    email: string;
    name: string;
    avatar?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly STORAGE_KEY = 'isAuthenticated';
    private readonly USER_KEY = 'currentUser';

    // Signals for reactive state management
    private _isAuthenticated = signal<boolean>(this.checkStoredAuth());
    private _currentUser = signal<User | null>(this.getStoredUser());

    // Public readonly signals
    isAuthenticated = this._isAuthenticated.asReadonly();
    currentUser = this._currentUser.asReadonly();

    // Computed signals
    userInitials = computed(() => {
        const user = this._currentUser();
        if (!user) return '';
        const names = user.name.split(' ');
        if (names.length >= 2) {
            return `${names[0][0]}${names[1][0]}`.toUpperCase();
        }
        return user.name.substring(0, 2).toUpperCase();
    });

    private platformId = inject(PLATFORM_ID);

    constructor(private router: Router) { }

    /**
     * Authenticate user with email and password
     * In a real app, this would call an API
     */
    login(email: string, password: string): Promise<boolean> {
        return new Promise((resolve) => {
            // Simulate API call delay
            setTimeout(() => {
                if (email && password) {
                    // Extract name from email for demo
                    const name = email.split('@')[0]
                        .split('.')
                        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
                        .join(' ');

                    const user: User = {
                        email,
                        name,
                        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ff6b35&color=fff`
                    };

                    this._currentUser.set(user);
                    this._isAuthenticated.set(true);

                    // Persist to localStorage
                    if (isPlatformBrowser(this.platformId)) {
                        localStorage.setItem(this.STORAGE_KEY, 'true');
                        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
                    }

                    resolve(true);
                } else {
                    resolve(false);
                }
            }, 500);
        });
    }

    /**
     * Logout current user
     */
    logout(): void {
        this._isAuthenticated.set(false);
        this._currentUser.set(null);
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem(this.STORAGE_KEY);
            localStorage.removeItem(this.USER_KEY);
        }
        this.router.navigate(['/login']);
    }

    /**
     * Check if user is authenticated from localStorage
     */
    private checkStoredAuth(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            return localStorage.getItem(this.STORAGE_KEY) === 'true';
        }
        return false;
    }

    /**
     * Get stored user from localStorage
     */
    private getStoredUser(): User | null {
        if (isPlatformBrowser(this.platformId)) {
            const userJson = localStorage.getItem(this.USER_KEY);
            if (userJson) {
                try {
                    return JSON.parse(userJson);
                } catch {
                    return null;
                }
            }
        }
        return null;
    }

    /**
     * Check authentication status
     */
    checkAuth(): boolean {
        return this._isAuthenticated();
    }
}
