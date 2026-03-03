import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

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
        <h1>{{ isLoginMode() ? 'Welcome Back' : 'Create Account' }}</h1>
        <p class="subtitle">{{ isLoginMode() ? 'Sign in to access your tasks' : 'Sign up to get started' }}</p>

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
              [disabled]="isLoading()"
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
              [disabled]="isLoading()"
              required
            />
          </div>

          @if (error()) {
            <div class="error-message">
              {{ error() }}
            </div>
          }

          <button 
            type="submit" 
            class="btn btn-primary full-width"
            [disabled]="isLoading()"
          >
            @if (isLoading()) {
              <span class="spinner"></span>
              {{ isLoginMode() ? 'Signing in...' : 'Signing up...' }}
            } @else {
              {{ isLoginMode() ? 'Sign In' : 'Sign Up' }}
            }
          </button>
        </form>

        <!-- Toggle Mode -->
        <div class="toggle-mode">
          <p>
            {{ isLoginMode() ? "Don't have an account?" : "Already have an account?" }}
            <button type="button" class="btn-link" (click)="toggleMode()" [disabled]="isLoading()">
              {{ isLoginMode() ? 'Sign up' : 'Sign in' }}
            </button>
          </p>
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
      animation: shake 0.3s ease-in-out;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-10px); }
      75% { transform: translateX(10px); }
    }

    .spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
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

    .toggle-mode {
      margin-top: 1.5rem;
      text-align: center;
    }

    .toggle-mode p {
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    .btn-link {
      background: none;
      border: none;
      color: var(--primary);
      font-weight: 600;
      cursor: pointer;
      padding: 0;
      margin-left: 0.25rem;
    }

    .btn-link:hover {
      text-decoration: underline;
    }

    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
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
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  isLoginMode = signal(true);
  email = signal('');
  password = signal('');
  error = signal('');
  isLoading = signal(false);

  toggleMode() {
    this.isLoginMode.update(mode => !mode);
    this.error.set('');
  }

  async login(): Promise<void> {
    // Clear previous errors
    this.error.set('');

    // Simple validation
    if (!this.email() || !this.password()) {
      this.error.set('Please enter both email and password');
      this.notificationService.error('Please enter both email and password');
      return;
    }

    // Start loading
    this.isLoading.set(true);

    try {
      let success = false;

      if (this.isLoginMode()) {
        success = await this.authService.login(this.email(), this.password());
        if (success) {
          this.notificationService.success('Welcome back! Redirecting to dashboard...');
          this.router.navigate(['/dashboard']);
        } else {
          this.error.set('Invalid credentials');
          this.notificationService.error('Invalid credentials. Please try again.');
        }
      } else {
        success = await this.authService.signup(this.email(), this.password());
        if (success) {
          this.notificationService.success('Account created successfully!');
          this.router.navigate(['/dashboard']);
        } else {
          this.error.set('Could not create account. Email might already be registered.');
          this.notificationService.error('Signup failed.');
        }
      }
    } catch (err: any) {
      this.error.set(err.message || 'An error occurred. Please try again.');
      this.notificationService.error('An error occurred. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
