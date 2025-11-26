import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskListComponent } from '../task-list/task-list.component';
import { StatsCardComponent } from '../stats-card/stats-card.component';
import { ToastComponent } from '../toast/toast.component';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { NotificationService } from '../../services/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterOutlet, TaskListComponent, StatsCardComponent, ToastComponent],
  template: `
    <!-- Toast Notifications -->
    <app-toast />

    <!-- Modern Angular Task Management Dashboard -->
    <div class="app-container">
      <!-- Header -->
      <header class="app-header">
        <div class="header-content">
          <div class="logo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 250" class="angular-logo">
              <g>
                <polygon fill="#DD0031" points="125,30 125,30 125,30 31.9,63.2 46.1,186.3 125,230 125,230 125,230 203.9,186.3 218.1,63.2"/>
                <polygon fill="#C3002F" points="125,30 125,52.2 125,52.1 125,153.4 125,153.4 125,230 125,230 203.9,186.3 218.1,63.2 125,30"/>
                <path fill="#FFFFFF" d="M125,52.1L66.8,182.6h0h21.7h0l11.7-29.2h49.4l11.7,29.2h0h21.7h0L125,52.1L125,52.1L125,52.1L125,52.1 L125,52.1z M142,135.4H108l17-40.9L142,135.4z"/>
              </g>
            </svg>
          </div>
          
          <div class="tech-badge">
            <span class="badge">Angular 17+</span>
            <span class="badge badge-success">Standalone</span>
            <span class="badge badge-warning">Signals</span>
          </div>

          <div class="header-actions">
            <!-- Theme Toggle -->
            <button 
              class="icon-btn theme-toggle" 
              (click)="toggleTheme()"
              [title]="themeService.currentTheme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
            >
              @if (themeService.currentTheme() === 'dark') {
                <!-- Sun Icon -->
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              } @else {
                <!-- Moon Icon -->
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              }
            </button>

            <!-- User Profile -->
            @if (authService.currentUser(); as user) {
              <div class="user-profile">
                <div class="user-avatar">
                  {{ authService.userInitials() }}
                </div>
                <div class="user-info">
                  <span class="user-name">{{ user.name }}</span>
                  <span class="user-email">{{ user.email }}</span>
                </div>
              </div>
            }

            <!-- Logout Button -->
            <button class="btn btn-ghost btn-sm" (click)="logout()">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="main-content">
        <!-- Statistics Section -->
        <section class="stats-section">
          <app-stats-card />
        </section>

        <!-- Task Management Section -->
        <section class="tasks-section">
          <app-task-list />
        </section>
      </main>

      <!-- Footer -->
      <footer class="app-footer">
        <p>
          Showcasing the latest trends in Angular 
          · Standalone Components · Signals · Modern DI
        </p>
      </footer>
    </div>

    <router-outlet />
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* ===================================
       HEADER
       =================================== */
    .app-header {
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--glass-border);
      padding: 1.5rem 2rem;
      position: sticky;
      top: 0;
      z-index: 100;
      animation: slideDown 0.5s ease-out;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-100%);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .angular-logo {
      width: 48px;
      height: 48px;
      animation: float 3s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }

    .tech-badge {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .icon-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: transparent;
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-md);
      color: var(--text-primary);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .icon-btn:hover {
      background: var(--glass-bg);
      border-color: var(--primary);
      transform: translateY(-2px);
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 1rem;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-lg);
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--primary-gradient);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.875rem;
      color: white;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
    }

    .user-name {
      font-weight: 600;
      font-size: 0.875rem;
      color: var(--text-primary);
    }

    .user-email {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    /* ===================================
       MAIN CONTENT
       =================================== */
    .main-content {
      flex: 1;
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .stats-section {
      margin-bottom: 2rem;
      animation: fadeInUp 0.6s ease-out;
    }

    .tasks-section {
      animation: fadeInUp 0.8s ease-out;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* ===================================
       FOOTER
       =================================== */
    .app-footer {
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-top: 1px solid var(--glass-border);
      padding: 2rem;
      text-align: center;
      margin-top: 3rem;
    }

    .app-footer p {
      color: var(--text-secondary);
      font-size: 0.875rem;
      margin: 0;
    }

    /* ===================================
       RESPONSIVE DESIGN
       =================================== */
    @media (max-width: 768px) {
      .app-header {
        padding: 1rem;
      }

      .header-content {
        flex-direction: column;
        text-align: center;
      }

      .logo {
        flex-direction: column;
        gap: 0.5rem;
      }

      .header-actions {
        width: 100%;
        justify-content: center;
        flex-wrap: wrap;
      }

      .user-info {
        display: none;
      }

      .main-content {
        padding: 1rem 0.5rem;
      }

      .app-footer {
        padding: 1.5rem;
      }
    }
  `]
})
export class DashboardComponent {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  private notificationService = inject(NotificationService);

  toggleTheme(): void {
    this.themeService.toggleTheme();
    const theme = this.themeService.currentTheme();
    this.notificationService.info(`Switched to ${theme} mode`);
  }

  logout(): void {
    const userName = this.authService.currentUser()?.name || 'User';
    this.notificationService.info(`Goodbye, ${userName}!`);
    setTimeout(() => {
      this.authService.logout();
    }, 500);
  }
}
