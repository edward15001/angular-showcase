export interface Task {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    category?: string;
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
    dueDate?: Date;
}

export interface TaskStats {
    total: number;
    completed: number;
    pending: number;
    highPriority: number;
}
