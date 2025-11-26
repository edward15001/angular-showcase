import { Injectable, signal, computed } from '@angular/core';
import { Task, TaskStats } from '../models/task.model';

export type SortOption = 'date' | 'priority' | 'title' | 'dueDate';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    // Signal-based state - NEW ANGULAR FEATURE!
    private tasksSignal = signal<Task[]>([
        {
            id: '1',
            title: 'Learn Angular Signals',
            description: 'Explore the new reactivity system based on signals',
            completed: true,
            priority: 'high',
            category: 'Development',
            tags: ['angular', 'learning'],
            createdAt: new Date('2025-11-20'),
            updatedAt: new Date('2025-11-20'),
            dueDate: new Date('2025-11-25')
        },
        {
            id: '2',
            title: 'Implement Standalone Components',
            description: 'Migrate to the new architecture without NgModules',
            completed: true,
            priority: 'high',
            category: 'Development',
            tags: ['angular', 'architecture'],
            createdAt: new Date('2025-11-21'),
            updatedAt: new Date('2025-11-21')
        },
        {
            id: '3',
            title: 'Create premium design with CSS',
            description: 'Use glassmorphism and modern gradients',
            completed: false,
            priority: 'medium',
            category: 'Design',
            tags: ['css', 'ui'],
            createdAt: new Date('2025-11-22'),
            updatedAt: new Date('2025-11-22'),
            dueDate: new Date('2025-11-26')
        },
        {
            id: '4',
            title: 'Prepare presentation',
            description: 'Demonstrate the new Angular trends',
            completed: false,
            priority: 'high',
            category: 'Presentation',
            tags: ['demo', 'angular'],
            createdAt: new Date('2025-11-23'),
            updatedAt: new Date('2025-11-23'),
            dueDate: new Date('2025-11-27')
        }
    ]);

    // Available categories signal
    private categoriesSignal = signal<string[]>(['Development', 'Design', 'Presentation', 'Personal', 'Work']);
    categories = this.categoriesSignal.asReadonly();

    // Public read-only signal
    tasks = this.tasksSignal.asReadonly();

    // Computed signals - automatically update when tasks change!
    stats = computed<TaskStats>(() => {
        const tasks = this.tasksSignal();
        return {
            total: tasks.length,
            completed: tasks.filter(t => t.completed).length,
            pending: tasks.filter(t => !t.completed).length,
            highPriority: tasks.filter(t => t.priority === 'high' && !t.completed).length
        };
    });

    // Computed signal for overdue tasks
    overdueTasks = computed(() => {
        const now = new Date();
        return this.tasksSignal().filter(task =>
            !task.completed &&
            task.dueDate &&
            new Date(task.dueDate) < now
        );
    });

    // Computed signal for all unique tags
    allTags = computed(() => {
        const tags = new Set<string>();
        this.tasksSignal().forEach(task => {
            task.tags?.forEach(tag => tags.add(tag));
        });
        return Array.from(tags).sort();
    });

    addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): void {
        const now = new Date();
        const newTask: Task = {
            ...task,
            id: Date.now().toString(),
            createdAt: now,
            updatedAt: now
        };
        this.tasksSignal.update(tasks => [...tasks, newTask]);
    }

    toggleTask(id: string): void {
        this.tasksSignal.update(tasks =>
            tasks.map(task =>
                task.id === id ? { ...task, completed: !task.completed, updatedAt: new Date() } : task
            )
        );
    }

    deleteTask(id: string): void {
        this.tasksSignal.update(tasks => tasks.filter(task => task.id !== id));
    }

    updateTask(id: string, updates: Partial<Task>): void {
        this.tasksSignal.update(tasks =>
            tasks.map(task =>
                task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
            )
        );
    }

    /**
     * Sort tasks by specified criteria
     */
    sortTasks(tasks: Task[], sortBy: SortOption): Task[] {
        const sorted = [...tasks];

        switch (sortBy) {
            case 'date':
                return sorted.sort((a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
            case 'priority':
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                return sorted.sort((a, b) =>
                    priorityOrder[b.priority] - priorityOrder[a.priority]
                );
            case 'title':
                return sorted.sort((a, b) =>
                    a.title.localeCompare(b.title)
                );
            case 'dueDate':
                return sorted.sort((a, b) => {
                    if (!a.dueDate && !b.dueDate) return 0;
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                });
            default:
                return sorted;
        }
    }

    /**
     * Add a new category
     */
    addCategory(category: string): void {
        if (category && !this.categoriesSignal().includes(category)) {
            this.categoriesSignal.update(cats => [...cats, category].sort());
        }
    }

    /**
     * Export tasks to JSON
     */
    exportToJSON(): string {
        return JSON.stringify(this.tasksSignal(), null, 2);
    }

    /**
     * Export tasks to CSV
     */
    exportToCSV(): string {
        const tasks = this.tasksSignal();
        const headers = ['ID', 'Title', 'Description', 'Completed', 'Priority', 'Category', 'Tags', 'Created', 'Due Date'];
        const rows = tasks.map(task => [
            task.id,
            `"${task.title}"`,
            `"${task.description || ''}"`,
            task.completed ? 'Yes' : 'No',
            task.priority,
            task.category || '',
            task.tags?.join(';') || '',
            new Date(task.createdAt).toISOString(),
            task.dueDate ? new Date(task.dueDate).toISOString() : ''
        ]);

        return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    }

    /**
     * Import tasks from JSON
     */
    importFromJSON(jsonString: string): boolean {
        try {
            const tasks = JSON.parse(jsonString) as Task[];
            // Validate basic structure
            if (Array.isArray(tasks) && tasks.every(t => t.id && t.title)) {
                this.tasksSignal.set(tasks);
                return true;
            }
            return false;
        } catch {
            return false;
        }
    }

    /**
     * Download file helper
     */
    downloadFile(content: string, filename: string, mimeType: string): void {
        const blob = new Blob([content], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        window.URL.revokeObjectURL(url);
    }
}
