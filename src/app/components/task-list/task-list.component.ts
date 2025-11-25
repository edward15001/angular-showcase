import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { TaskItemComponent } from '../task-item/task-item.component';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, FormsModule, TaskItemComponent],
  template: `
    <div class="task-list-container">
      <!-- Header -->
      <div class="header">
        <h2>Task Management Dashboard</h2>
        <p>Manage your tasks with Angular's new architecture</p>
      </div>

      <!-- Add New Task Form -->
      <div class="add-task-form glass-card">
        <h3>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 0.5rem;">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          New Task
        </h3>
        <input
          type="text"
          [(ngModel)]="newTaskTitle"
          placeholder="Task title..."
          class="input-field"
          (keyup.enter)="addTask()"
        />
        <input
          type="text"
          [(ngModel)]="newTaskDescription"
          placeholder="Description..."
          class="input-field"
          (keyup.enter)="addTask()"
        />
        <div class="form-row">
          <select [(ngModel)]="newTaskPriority" class="input-field">
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          <button class="btn btn-primary" (click)="addTask()">Add Task</button>
        </div>
        <!-- Search Input -->
        <input
          type="text"
          [(ngModel)]="searchTerm"
          placeholder="Search tasks..."
          class="input-field"
        />
      </div>

      <!-- Filters -->
      <div class="filters-section">
        <div class="filter-group">
          <span class="filter-label">Status:</span>
          <button class="btn btn-sm" [class.btn-primary]="statusFilter() === 'all'" [class.btn-ghost]="statusFilter() !== 'all'" (click)="statusFilter.set('all')">All ({{ taskService.tasks().length }})</button>
          <button class="btn btn-sm" [class.btn-primary]="statusFilter() === 'active'" [class.btn-ghost]="statusFilter() !== 'active'" (click)="statusFilter.set('active')">Active ({{ taskService.stats().pending }})</button>
          <button class="btn btn-sm" [class.btn-primary]="statusFilter() === 'completed'" [class.btn-ghost]="statusFilter() !== 'completed'" (click)="statusFilter.set('completed')">Completed ({{ taskService.stats().completed }})</button>
        </div>
        <div class="filter-group">
          <span class="filter-label">Priority:</span>
          <button class="btn btn-sm" [class.btn-primary]="priorityFilter() === 'all'" [class.btn-ghost]="priorityFilter() !== 'all'" (click)="priorityFilter.set('all')">All</button>
          <button class="btn btn-sm" [class.btn-primary]="priorityFilter() === 'high'" [class.btn-ghost]="priorityFilter() !== 'high'" (click)="priorityFilter.set('high')">High</button>
          <button class="btn btn-sm" [class.btn-primary]="priorityFilter() === 'medium'" [class.btn-ghost]="priorityFilter() !== 'medium'" (click)="priorityFilter.set('medium')">Medium</button>
          <button class="btn btn-sm" [class.btn-primary]="priorityFilter() === 'low'" [class.btn-ghost]="priorityFilter() !== 'low'" (click)="priorityFilter.set('low')">Low</button>
        </div>
      </div>

      <!-- Task List -->
      <div class="tasks-container">
        @for (task of filteredTasks(); track task.id) {
          <app-task-item
            [task]="task"
            (toggle)="toggleTask($event)"
            (delete)="deleteTask($event)"
            (update)="updateTask($event)"
          />
        } @empty {
          <div class="empty-state glass-card">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.3; margin-bottom: 1rem;">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
            </svg>
            <h3>No tasks found</h3>
            <p>Try adjusting your filters or create a new task above!</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .task-list-container { max-width: 900px; margin: 0 auto; padding: 2rem 1rem; }
    .header { text-align: center; margin-bottom: 2rem; animation: fadeIn 0.5s ease-out; }
    .header h2 { font-size: 2.5rem; color: var(--text-primary); margin-bottom: 0.5rem; }
    .header p { font-size: 1.125rem; color: var(--text-secondary); }
    .add-task-form { margin-bottom: 2rem; animation: scaleIn 0.4s ease-out; }
    .add-task-form h3 { font-size: 1.25rem; margin-bottom: 1rem; color: var(--text-primary); }
    .input-field { margin-bottom: 1rem; }
    .form-row { display: flex; gap: 1rem; }
    .form-row .input-field { flex: 1; margin-bottom: 0; }
    .filters-section { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem; padding: 1.5rem; background: var(--glass-bg); backdrop-filter: blur(10px); border: 1px solid var(--glass-border); border-radius: var(--radius-lg); }
    .filter-group { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
    .filter-label { font-weight: 600; color: var(--text-primary); min-width: 70px; font-size: 0.9rem; }
    .btn-sm { padding: 0.5rem 1rem; font-size: 0.875rem; }
    .tasks-container { animation: fadeIn 0.6s ease-out; }
    .empty-state { text-align: center; padding: 3rem 2rem; display: flex; flex-direction: column; align-items: center; }
    .empty-state h3 { font-size: 1.5rem; margin-bottom: 0.5rem; }
    .empty-state p { color: var(--text-muted); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    @media (max-width: 768px) {
      .form-row { flex-direction: column; }
      .filter-group { flex-direction: column; align-items: flex-start; }
      .filter-label { width: 100%; }
      .btn-sm { flex: 1; width: 100%; }
    }
  `]
})
export class TaskListComponent {
  // Services
  taskService = inject(TaskService);

  // Signals
  statusFilter = signal<'all' | 'active' | 'completed'>('all');
  priorityFilter = signal<'all' | 'high' | 'medium' | 'low'>('all');
  searchTerm = signal('');
  newTaskTitle = signal('');
  newTaskDescription = signal('');
  newTaskPriority = signal<'low' | 'medium' | 'high'>('medium');

  // Computed filtered tasks
  filteredTasks = computed(() => {
    let tasks = this.taskService.tasks();
    const status = this.statusFilter();
    if (status === 'active') tasks = tasks.filter(t => !t.completed);
    else if (status === 'completed') tasks = tasks.filter(t => t.completed);
    const priority = this.priorityFilter();
    if (priority !== 'all') tasks = tasks.filter(t => t.priority === priority);
    const term = this.searchTerm().trim().toLowerCase();
    if (term) {
      tasks = tasks.filter(t =>
        t.title.toLowerCase().includes(term) ||
        (t.description && t.description.toLowerCase().includes(term))
      );
    }
    return tasks;
  });

  addTask(): void {
    const title = this.newTaskTitle();
    if (!title.trim()) return;
    this.taskService.addTask({
      title,
      description: this.newTaskDescription(),
      completed: false,
      priority: this.newTaskPriority()
    });
    this.newTaskTitle.set('');
    this.newTaskDescription.set('');
    this.newTaskPriority.set('medium');
    this.searchTerm.set('');
  }

  toggleTask(id: string): void { this.taskService.toggleTask(id); }
  deleteTask(id: string): void { this.taskService.deleteTask(id); }
  updateTask(event: { id: string; updates: Partial<Task> }): void { this.taskService.updateTask(event.id, event.updates); }
}
