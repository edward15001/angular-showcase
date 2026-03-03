import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { SupabaseService } from './supabase/supabase';

export interface User {
    email: string;
    name: string;
    avatar?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // Signals for reactive state management
    private _isAuthenticated = signal<boolean>(false);
    private _currentUser = signal<User | null>(null);

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
    private supabaseService = inject(SupabaseService);
    private router = inject(Router);

    constructor() {
        if (isPlatformBrowser(this.platformId)) {
            // Restore session automatically on startup
            this.supabaseService.getUser().then(user => {
                if (user) {
                    this.updateUserState(user);
                }
            });

            // Listen for auth events (login, logout) implicitly done by Supabase client
            // We could also hook into supabase.auth.onAuthStateChange if exposed by SupabaseService
        }
    }

    private async updateUserState(supabaseUser: any) {
        if (!supabaseUser || !supabaseUser.email) {
            this._isAuthenticated.set(false);
            this._currentUser.set(null);
            return;
        }

        const email = supabaseUser.email;
        let name = email.split('@')[0]
            .split('.')
            .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' ');

        // Try to fetch profile from database
        try {
            const client = this.supabaseService.getClient();
            const { data } = await client
                .from('profiles')
                .select('full_name')
                .eq('id', supabaseUser.id)
                .single();

            if (data?.full_name) {
                name = data.full_name;
            }
        } catch (e) { /* ignore and use fallback name */ }

        const user: User = {
            email,
            name,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ff6b35&color=fff`
        };

        this._currentUser.set(user);
        this._isAuthenticated.set(true);
    }

    /**
     * Authenticate user with email and password via Supabase
     */
    async login(email: string, password: string): Promise<boolean> {
        try {
            const data = await this.supabaseService.signIn(email, password);
            if (data.user) {
                this.updateUserState(data.user);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    }

    /**
     * Register a new user with email and password via Supabase
     */
    async signup(email: string, password: string): Promise<boolean> {
        try {
            const data = await this.supabaseService.signUp(email, password);
            if (data.user) {
                this.updateUserState(data.user);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Signup error:', error);
            throw error; // Let the component handle display
        }
    }

    /**
     * Logout current user
     */
    async logout(): Promise<void> {
        try {
            await this.supabaseService.signOut();
            this._isAuthenticated.set(false);
            this._currentUser.set(null);
            this.router.navigate(['/login']);
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    /**
     * Check authentication status
     */
    checkAuth(): boolean {
        return this._isAuthenticated();
    }
}
