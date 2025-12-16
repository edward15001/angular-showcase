# Part 2: Angular Web Application Analysis

This section of the presentation details how we have implemented the "Task Manager" demo application, highlighting the use of the most modern Angular features (v17+) to create a fluid user experience and maintainable code.

---

## 1. Authentication Module (Login)

The user's first interaction is with the login screen. Here we have moved away from the complex legacy `NgModules` in favor of a cleaner, more reactive architecture.

### 🎨 1.1 Design and Standalone Components
The `LoginComponent` is a **Standalone Component**. This means it is self-contained and does not need to be declared in a global module (`app.module.ts`), reducing "boilerplate" and making the application load faster.

```typescript
@Component({
  selector: 'app-login',
  standalone: true, // Implicit in modern Angular
  imports: [CommonModule, FormsModule], // We import only what is necessary
  // ...
})
export class LoginComponent { ... }
```

### ⚡ 1.2 Reactivity with Signals
The form state is managed purely with **Signals**. Signals offer granular reactivity: when a signal changes, Angular knows *exactly* what to update without unnecessary change detection cycles.

```typescript
// Reactive state definition
email = signal('');
password = signal('');
isLoading = signal(false);

// Usage: read with () and update with .set()
this.isLoading.set(true);
```

### 🔀 1.3 Modern Control Flow (@if)
In the HTML template, we use the new control flow syntax, which is more readable and performant than `*ngIf`.

```html
@if (isLoading()) {
  <span class="spinner"></span>
} @else {
  Sign In
}
```

---

## 2. Dashboard and Task Management

Here we demonstrate the power of data handling in Angular.

### 🔄 2.1 Optimized Loops (@for)
In `TaskListComponent`, we use the `@for` block, which includes an optimized reconciliation algorithm (up to 90% faster) thanks to the mandatory use of `track`.

```html
@for (task of filteredTasks(); track task.id) {
  <app-task-item [task]="task" ... />
} @empty {
  <div class="empty-state">No tasks found</div>
}
```

### 🧮 2.2 Derived State (Computed Signals)
For search filters and status, we use `computed()`. These derived signals update **automatically** and lazily only when their dependencies change.

```typescript
// If 'tasks' or 'searchTerm' change, filteredTasks recalculates itself
filteredTasks = computed(() => {
  const tasks = this.taskService.tasks();
  const term = this.searchTerm().toLowerCase();
  return tasks.filter(t => t.title.toLowerCase().includes(term));
});
```

---

## 3. Global State and Effects (Theme Service)

For theme switching (Light/Dark), we use a global service pattern with `Effects`.

### 🔮 3.1 Effects
An `effect` is an operation that runs in response to signal changes. We use it to synchronize reactive state with the browser (DOM and LocalStorage).

```typescript
// In ThemeService
constructor() {
  // Whenever _currentTheme changes, this code runs automatically
  effect(() => {
    this.applyTheme(this._currentTheme());
  });
}
```

---

## Conclusion: Why Modern Angular?

This application demonstrates key benefits of the latest Angular version:

1.  **Less Code (Boilerplate)**: Standalone Components and `inject()` eliminate the need for modules and complex constructors.
2.  **Better Performance**: Signals and the new Control Flow (`@if`, `@for`) optimize rendering and change detection.
3.  **Better Developer Experience (DX)**: Reactivity is more intuitive (no complex RxJS for local state) and typing is stronger.
