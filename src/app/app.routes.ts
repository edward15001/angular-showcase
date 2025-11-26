import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

// Auth guard function using AuthService
const authGuard = () => {
    const router = inject(Router);
    const authService = inject(AuthService);

    if (!authService.checkAuth()) {
        router.navigate(['/login']);
        return false;
    }
    return true;
};

// Prevent authenticated users from accessing login
const loginGuard = () => {
    const router = inject(Router);
    const authService = inject(AuthService);

    if (authService.checkAuth()) {
        router.navigate(['/dashboard']);
        return false;
    }
    return true;
};

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    { path: '**', redirectTo: '/login' }
];
