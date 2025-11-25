import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskListComponent } from '../task-list/task-list.component';
import { StatsCardComponent } from '../stats-card/stats-card.component';

@Component({
    selector: 'app-dashboard',
    imports: [RouterOutlet, TaskListComponent, StatsCardComponent],
    template: `
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

      .main-content {
        padding: 1rem 0.5rem;
      }

      .app-footer {
        padding: 1.5rem;
      }
    }
  `]
})
export class DashboardComponent { }
