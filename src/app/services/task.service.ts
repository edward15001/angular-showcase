import { Injectable, signal, computed } from '@angular/core';
import { Task, TaskStats } from '../models/task.model';

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
            createdAt: new Date('2025-11-20'),
            dueDate: new Date('2025-11-25')
        },
        {
            id: '2',
            title: 'Implement Standalone Components',
            description: 'Migrate to the new architecture without NgModules',
            completed: true,
            priority: 'high',
            createdAt: new Date('2025-11-21')
        },
        {
            id: '3',
            title: 'Create premium design with CSS',
            description: 'Use glassmorphism and modern gradients',
            completed: false,
            priority: 'medium',
            createdAt: new Date('2025-11-22'),
            dueDate: new Date('2025-11-26')
        },
        {
            id: '4',
            title: 'Prepare presentation',
            description: 'Demonstrate the new Angular trends',
            completed: false,
            priority: 'high',
            createdAt: new Date('2025-11-23'),
            dueDate: new Date('2025-11-27')
        }
    ]);

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

    addTask(task: Omit<Task, 'id' | 'createdAt'>): void {
        const newTask: Task = {
            ...task,
            id: Date.now().toString(),
            createdAt: new Date()
        };
        this.tasksSignal.update(tasks => [...tasks, newTask]);
    }

    toggleTask(id: string): void {
        this.tasksSignal.update(tasks =>
            tasks.map(task =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    }

    deleteTask(id: string): void {
        this.tasksSignal.update(tasks => tasks.filter(task => task.id !== id));
    }

    updateTask(id: string, updates: Partial<Task>): void {
        this.tasksSignal.update(tasks =>
            tasks.map(task =>
                task.id === id ? { ...task, ...updates } : task
            )
        );
    }
}
