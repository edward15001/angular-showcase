import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

// Auth guard function
const authGuard = () => {
    const router = inject(Router);
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuth) {
        router.navigate(['/login']);
        return false;
    }
    return true;
};

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    { path: '**', redirectTo: '/login' }
];
