import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-item',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="task-item glass-card" [class.completed]="task().completed" [class.editing]="isEditing()">
      @if (!isEditing()) {
        <!-- View Mode -->
        <div class="task-header">
          <input
            type="checkbox"
            [checked]="task().completed"
            (change)="onToggle()"
            class="task-checkbox"
          />
          <div class="task-content">
            <h3 [class.completed-text]="task().completed">{{ task().title }}</h3>
            <p class="task-description">{{ task().description }}</p>
          </div>
          <span class="badge priority-{{ task().priority }}">
            {{ task().priority }}
          </span>
        </div>
        <div class="task-footer">
          <span class="task-date">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {{ task().createdAt | date: 'dd/MM/yyyy' }}
          </span>
          @if (task().dueDate) {
            <span class="task-due">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              Due: {{ task().dueDate | date: 'dd/MM/yyyy' }}
            </span>
          }
          <button class="btn-edit" (click)="startEdit()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit
          </button>
          <button class="btn-delete" (click)="onDelete()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
            Delete
          </button>
        </div>
      } @else {
        <!-- Edit Mode -->
        <div class="edit-form">
          <input
            type="text"
            [(ngModel)]="editTitle"
            placeholder="Task title..."
            class="input-field"
          />
          <input
            type="text"
            [(ngModel)]="editDescription"
            placeholder="Description..."
            class="input-field"
          />
          <select [(ngModel)]="editPriority" class="input-field">
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          <div class="edit-actions">
            <button class="btn btn-primary" (click)="saveEdit()">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Save
            </button>
            <button class="btn btn-ghost" (click)="cancelEdit()">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Cancel
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .task-item {
      margin-bottom: 1rem;
      animation: slideInRight 0.3s ease-out;
      transition: all var(--transition-base);
    }

    .task-item.completed {
      opacity: 0.7;
    }

    .task-item.editing {
      box-shadow: 0 0 0 2px var(--primary);
    }

    .task-header {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 0.75rem;
    }

    .task-checkbox {
      width: 24px;
      height: 24px;
      cursor: pointer;
      accent-color: var(--primary);
      margin-top: 4px;
    }

    .task-content {
      flex: 1;
    }

    .task-content h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.25rem;
      transition: all var(--transition-base);
    }

    .completed-text {
      text-decoration: line-through;
      opacity: 0.6;
    }

    .task-description {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin: 0;
    }

    .priority-high {
      background: rgba(239, 68, 68, 0.2);
      color: var(--danger);
      border-color: var(--danger);
    }

    .priority-medium {
      background: rgba(255, 107, 53, 0.2);
      color: var(--primary);
      border-color: var(--primary);
    }

    .priority-low {
      background: rgba(74, 144, 226, 0.2);
      color: var(--secondary);
      border-color: var(--secondary);
    }

    .task-footer {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 0.875rem;
      color: var(--text-muted);
      padding-top: 0.75rem;
      border-top: 1px solid var(--glass-border);
      flex-wrap: wrap;
    }

    .task-date, .task-due {
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }

    .task-date svg, .task-due svg {
      opacity: 0.6;
    }

    .btn-edit, .btn-delete {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      background: transparent;
      border: 1px solid currentColor;
      padding: 0.375rem 0.75rem;
      border-radius: var(--radius-sm);
      cursor: pointer;
      font-size: 0.875rem;
      transition: all var(--transition-base);
      font-family: 'JetBrains Mono', monospace;
    }

    .btn-edit {
      color: var(--secondary);
      border-color: var(--secondary);
    }

    .btn-edit:hover {
      background: var(--secondary);
      color: white;
      transform: translateY(-2px);
    }

    .btn-delete {
      color: var(--danger);
      border-color: var(--danger);
      margin-left: auto;
    }

    .btn-delete:hover {
      background: var(--danger);
      color: white;
      transform: translateY(-2px);
    }

    /* Edit Form Styles */
    .edit-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .edit-actions {
      display: flex;
      gap: 0.75rem;
    }

    .edit-actions .btn {
      flex: 1;
    }

    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @media (max-width: 768px) {
      .task-footer {
        font-size: 0.75rem;
      }

      .btn-edit span, .btn-delete span {
        display: none;
      }
    }
  `]
})
export class TaskItemComponent {
  // Modern Angular: input() and output() functions
  task = input.required<Task>();
  toggle = output<string>();
  delete = output<string>();
  update = output<{ id: string; updates: Partial<Task> }>();

  // Edit mode signal
  isEditing = signal(false);
  editTitle = signal('');
  editDescription = signal('');
  editPriority = signal<'low' | 'medium' | 'high'>('medium');

  startEdit(): void {
    this.isEditing.set(true);
    this.editTitle.set(this.task().title);
    this.editDescription.set(this.task().description || '');
    this.editPriority.set(this.task().priority);
  }

  saveEdit(): void {
    if (!this.editTitle().trim()) return;

    this.update.emit({
      id: this.task().id,
      updates: {
        title: this.editTitle(),
        description: this.editDescription(),
        priority: this.editPriority()
      }
    });
    this.isEditing.set(false);
  }

  cancelEdit(): void {
    this.isEditing.set(false);
  }

  onToggle(): void {
    this.toggle.emit(this.task().id);
  }

  onDelete(): void {
    this.delete.emit(this.task().id);
  }
}
