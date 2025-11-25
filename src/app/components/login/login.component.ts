import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login',
    imports: [CommonModule, FormsModule],
    template: `
    <div class="login-container">
      <div class="login-card glass-card">
        <!-- Logo -->
        <div class="login-logo">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 250" width="80" height="80">
            <g>
              <polygon fill="#DD0031" points="125,30 125,30 125,30 31.9,63.2 46.1,186.3 125,230 125,230 125,230 203.9,186.3 218.1,63.2"/>
              <polygon fill="#C3002F" points="125,30 125,52.2 125,52.1 125,153.4 125,153.4 125,230 125,230 203.9,186.3 218.1,63.2 125,30"/>
              <path fill="#FFFFFF" d="M125,52.1L66.8,182.6h0h21.7h0l11.7-29.2h49.4l11.7,29.2h0h21.7h0L125,52.1L125,52.1L125,52.1L125,52.1 L125,52.1z M142,135.4H108l17-40.9L142,135.4z"/>
            </g>
          </svg>
        </div>

        <!-- Title -->
        <h1>Angular Task Manager</h1>
        <p class="subtitle">Sign in to access your tasks</p>

        <!-- Login Form -->
        <form (ngSubmit)="login()" class="login-form">
          <div class="form-group">
            <label>Email</label>
            <input
              type="email"
              [(ngModel)]="email"
              name="email"
              class="input-field"
              placeholder="Enter your email"
              required
            />
          </div>

          <div class="form-group">
            <label>Password</label>
            <input
              type="password"
              [(ngModel)]="password"
              name="password"
              class="input-field"
              placeholder="Enter your password"
              required
            />
          </div>

          @if (error()) {
            <div class="error-message">
              {{ error() }}
            </div>
          }

          <button type="submit" class="btn btn-primary full-width">
            Sign In
          </button>
        </form>

        <!-- Demo Info -->
        <div class="demo-info">
          <p>Demo credentials: any email/password combination</p>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .login-card {
      max-width: 450px;
      width: 100%;
      text-align: center;
      animation: scaleIn 0.5s ease-out;
    }

    .login-logo {
      margin-bottom: 2rem;
      animation: float 3s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
    }

    .subtitle {
      color: var(--text-secondary);
      margin-bottom: 2rem;
      font-size: 1rem;
    }

    .login-form {
      text-align: left;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: var(--text-primary);
      font-size: 0.875rem;
    }

    .full-width {
      width: 100%;
      margin-top: 0.5rem;
    }

    .error-message {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid var(--danger);
      color: var(--danger);
      padding: 0.75rem;
      border-radius: var(--radius-md);
      margin-bottom: 1rem;
      font-size: 0.875rem;
    }

    .demo-info {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid var(--glass-border);
    }

    .demo-info p {
      color: var(--text-muted);
      font-size: 0.8125rem;
    }

    @media (max-width: 768px) {
      h1 {
        font-size: 2rem;
      }

      .login-card {
        padding: 1.5rem;
      }
    }
  `]
})
export class LoginComponent {
    private router = inject(Router);

    email = signal('');
    password = signal('');
    error = signal('');

    login(): void {
        // Simple validation
        if (!this.email() || !this.password()) {
            this.error.set('Please enter both email and password');
            return;
        }

        // For demo purposes, accept any credentials
        // In a real app, you would call an authentication service here
        localStorage.setItem('isAuthenticated', 'true');
        this.router.navigate(['/dashboard']);
    }
}
