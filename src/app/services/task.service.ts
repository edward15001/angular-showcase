import { Injectable, signal, computed, inject } from '@angular/core';
import { Task, TaskStats } from '../models/task.model';
import { SupabaseService } from './supabase/supabase';
import { AuthService } from './auth.service';

export type SortOption = 'date' | 'priority' | 'title' | 'dueDate';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    // Services
    private supabase = inject(SupabaseService);
    private authService = inject(AuthService);

    // Signal-based state
    private tasksSignal = signal<Task[]>([]);

    // Available categories signal
    private categoriesSignal = signal<string[]>(['Development', 'Design', 'Presentation', 'Personal', 'Work']);
    categories = this.categoriesSignal.asReadonly();

    // Public read-only signal
    tasks = this.tasksSignal.asReadonly();

    constructor() {
        // Fetch tasks when user logs in or refreshes
        // This leverages Angular effect() effectively or manual subscription 
        // We will do a poll check or just fetch when the service instantiates
        this.fetchTasks();
    }

    async fetchTasks() {
        // Use a short delay to ensure Auth finishes restoring 
        // In a more robust setup, you'd trigger this Reactively via an Effect
        setTimeout(async () => {
            const user = await this.supabase.getUser();
            if (!user) return;

            const client = this.supabase.getClient();
            const { data, error } = await client
                .from('tasks')
                .select('*')
                .order('createdAt', { ascending: false });

            if (error) {
                console.error("Error fetching tasks:", error);
                return;
            }

            if (data) {
                // Map from DB columns to our model
                const parsedTasks = data.map((dbTask: any) => ({
                    id: dbTask.id,
                    user_id: dbTask.user_id,
                    title: dbTask.title,
                    description: dbTask.description || '',
                    completed: dbTask.completed,
                    priority: dbTask.priority,
                    category: dbTask.category || undefined,
                    tags: dbTask.tags || [],
                    createdAt: new Date(dbTask.createdAt),
                    updatedAt: new Date(dbTask.updatedAt),
                    dueDate: dbTask.dueDate ? new Date(dbTask.dueDate) : undefined
                })) as Task[];

                this.tasksSignal.set(parsedTasks);
            }
        }, 500);
    }

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

    async addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
        const _user = await this.supabase.getUser();
        if (!_user) return;

        const dbTask = {
            user_id: _user.id,
            title: task.title,
            description: task.description,
            priority: task.priority,
            category: task.category,
            tags: task.tags,
            dueDate: task.dueDate?.toISOString()
        };

        const client = this.supabase.getClient();
        const { data, error } = await client.from('tasks').insert(dbTask).select().single();

        if (error || !data) {
            console.error("Error creating task", error);
            return;
        }

        // Add to local state
        const newTask: Task = {
            id: data.id,
            user_id: data.user_id,
            title: data.title,
            description: data.description || '',
            completed: data.completed,
            priority: data.priority,
            category: data.category || undefined,
            tags: data.tags || [],
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt),
            dueDate: data.dueDate ? new Date(data.dueDate) : undefined
        };

        this.tasksSignal.update(tasks => [newTask, ...tasks]);
    }

    async toggleTask(id: string) {
        const currentTask = this.tasksSignal().find(t => t.id === id);
        if (!currentTask) return;

        const newStatus = !currentTask.completed;

        const client = this.supabase.getClient();
        const { error } = await client.from('tasks').update({
            completed: newStatus,
            updatedAt: new Date().toISOString()
        }).eq('id', id);

        if (error) {
            console.error("Error toggling task", error);
            return;
        }

        this.tasksSignal.update(tasks =>
            tasks.map(task =>
                task.id === id ? { ...task, completed: newStatus, updatedAt: new Date() } : task
            )
        );
    }

    async deleteTask(id: string) {
        const client = this.supabase.getClient();
        const { error } = await client.from('tasks').delete().eq('id', id);

        if (error) {
            console.error("Error deleting task:", error);
            return;
        }

        this.tasksSignal.update(tasks => tasks.filter(task => task.id !== id));
    }

    async updateTask(id: string, updates: Partial<Task>) {
        const dbUpdates: any = {
            ...updates,
            updatedAt: new Date().toISOString()
        };

        // Remove locally restricted properties 
        delete dbUpdates.id;
        delete dbUpdates.createdAt;
        delete dbUpdates.user_id;

        if (updates.dueDate) {
            dbUpdates.dueDate = updates.dueDate.toISOString();
        }

        const client = this.supabase.getClient();
        const { error } = await client.from('tasks').update(dbUpdates).eq('id', id);

        if (error) {
            console.error("Error updating task", error);
            return;
        }

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
