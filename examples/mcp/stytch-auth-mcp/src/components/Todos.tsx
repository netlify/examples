
import { useState } from "react";
import type { FormEvent } from "react";
import {withLoginRequired, withStytchProvider} from "./Auth";
import { useStytch, useStytchUser } from "@stytch/react";
import { TodoService } from "../services/TodoService";
import type {Todo} from "../services/TodoService"

const TodoEditor = withLoginRequired(() => {
  const [newTodoText, setNewTodoText] = useState("");
  const stytch = useStytch();
  const { user } = useStytchUser();

  const todos: Todo[] = user?.untrusted_metadata.todos as Todo[] ?? [];

  const svc = new TodoService({
    get: async () => todos,
    set: async (todos: Todo[]) =>
      void stytch.user.update({ untrusted_metadata: { todos } }),
  });

  const onAddTodo = (evt: FormEvent) => {
    evt.preventDefault();
    svc.add(newTodoText);
    setNewTodoText("");
  };
  const onCompleteTodo = (id: string) => svc.markCompleted(id);
  const onDeleteTodo = (id: string) => svc.delete(id);

  return (
    <div className="max-w-2/3">
      <p>
        The TODO items shown below can be edited via the UI + REST API, or via
        the MCP Server. Connect to the MCP Server running at{" "}
        <span>
          <b>
            <code>{window.location.origin}/mcp</code>
          </b>
        </span>{" "}
        with your MCP Client to try it out.
      </p>

        <form onSubmit={onAddTodo} className={"flex flex-col"}>
            <label>
                New TODO
                <input
                    type="text"
                    value={newTodoText}
                    className={"bg-white text-black"}
                    onChange={(e) => setNewTodoText(e.target.value)}
                />
            </label>

            <button type="submit" disabled={!newTodoText}>
                Add TODO
            </button>
        </form>
        <ul>
          {todos.map((todo) => (
              <li key={todo.id} className="flex justify-between items-center min-w-[40vw] mb-2">
            <div>
              {todo.completed ? (
                <>
                  ✅️ <s>{todo.text}</s>
                </>
              ) : (
                todo.text
              )}
            </div>
            <div>
              {!todo.completed && (
                <button onClick={() => onCompleteTodo(todo.id)} className="ml-2.5! px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                  Complete
                </button>
              )}
              <button onClick={() => onDeleteTodo(todo.id)} className="ml-2.5! px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
            </div>
          </li>
        ))}
        </ul>

    </div>
  );
});

export default withStytchProvider(TodoEditor);
