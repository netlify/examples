export type Todo = {
    id: string;
    text: string;
    completed: boolean;
}
type TodoDataLayer = {
    get: () => Promise<Todo[]>;
    set: (todos: Todo[]) => Promise<void>
}
/**
 * The `TodoService` class provides methods for managing a to-do list with a pluggable data layer model.
 */
export class TodoService {
    constructor(
        private dataLayer: TodoDataLayer
    ) {
    }

    get = async (): Promise<Todo[]> => {
        return this.dataLayer.get()
    }

    set = async (todos: Todo[]): Promise<Todo[]> => {
        const sorted = todos.sort((t1, t2) => {
            if (t1.completed === t2.completed) {
                return t1.id.localeCompare(t2.id);
            }
            return t1.completed ? 1 : -1;
        });

        await this.dataLayer.set(sorted)
        return sorted
    }

    add = async (todoText: string): Promise<Todo[]> => {
        const todos = await this.dataLayer.get()
        const newTodo: Todo = {
            id: Date.now().toString(),
            text: todoText,
            completed: false
        }
        todos.push(newTodo)
        return this.set(todos)
    }

    delete = async (todoID: string): Promise<Todo[]> => {
        const todos = await this.dataLayer.get()
        const cleaned = todos.filter(t => t.id !== todoID);
        return this.set(cleaned);
    }

    markCompleted = async (todoID: string): Promise<Todo[]> => {
        const todos = await this.dataLayer.get()
        const todoIndex = todos.findIndex(t => t.id === todoID);

        if (todoIndex === -1) {
            return todos;
        }
        const updatedTodos = [
            ...todos.slice(0, todoIndex),
            { ...todos[todoIndex], completed: true },
            ...todos.slice(todoIndex + 1)
        ];
        return this.set(updatedTodos);
    }
}