import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'dark' | 'light';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly STORAGE_KEY = 'theme-preference';
    private readonly THEME_CLASS = 'light-theme';

    // Signal for current theme
    private _currentTheme = signal<Theme>(this.getStoredTheme());
    currentTheme = this._currentTheme.asReadonly();

    constructor() {
        // Apply theme on initialization and whenever it changes
        effect(() => {
            this.applyTheme(this._currentTheme());
        });
    }

    /**
     * Toggle between light and dark themes
     */
    toggleTheme(): void {
        const newTheme: Theme = this._currentTheme() === 'dark' ? 'light' : 'dark';
        this._currentTheme.set(newTheme);
        this.saveTheme(newTheme);
    }

    /**
     * Set a specific theme
     */
    setTheme(theme: Theme): void {
        this._currentTheme.set(theme);
        this.saveTheme(theme);
    }

    /**
     * Get stored theme preference or default to dark
     */
    private getStoredTheme(): Theme {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored === 'light' || stored === 'dark') {
            return stored;
        }

        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            return 'light';
        }

        return 'dark';
    }

    /**
     * Save theme preference to localStorage
     */
    private saveTheme(theme: Theme): void {
        localStorage.setItem(this.STORAGE_KEY, theme);
    }

    /**
     * Apply theme by adding/removing CSS class
     */
    private applyTheme(theme: Theme): void {
        const body = document.body;
        if (theme === 'light') {
            body.classList.add(this.THEME_CLASS);
        } else {
            body.classList.remove(this.THEME_CLASS);
        }
    }
}
