import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Todo } from "../../src/services/TodoService";
import { TodoService } from "../../src/services/TodoService";
import { z } from "zod";
import * as stytch from "stytch";

type OAuthClaims = Awaited<ReturnType<typeof client.idp.introspectTokenLocal>>;

const client = new stytch.Client({
  project_id: Netlify.env.get("STYTCH_PROJECT_ID") as string,
  secret: Netlify.env.get("STYTCH_SECRET") as string,
  custom_base_url: `https://${Netlify.env.get("STYTCH_DOMAIN")}`,
});

export const setupMCPServer = (claims: OAuthClaims): McpServer => {
      const todoService = new TodoService({
        get: () =>
            client.users
                .get({ user_id: claims.subject })
                .then((user) => user.untrusted_metadata?.todos || []),
        set: async (todos: Todo[]) =>
            void client.users.update({ user_id: claims.subject, untrusted_metadata: { todos } }),
      });

      const formatResponse = (
          description: string,
          newState: Todo[],
      ): {
        content: Array<{ type: "text"; text: string }>;
      } => {
        return {
          content: [
            {
              type: "text",
              text: `Success! ${description}\n\nNew state:\n${JSON.stringify(newState, null, 2)}}`,
            },
          ],
        };
      };

      const server = new McpServer(
          {
            name: "stateless-mcp-todo-app",
            version: "1.0.0",
          },
          { capabilities: { logging: {} } }
      );

      server.tool("whoami", "Who am i anyway", async () => ({
        content: [
          {
            type: "text",
            text: `JWT Contents: ${JSON.stringify(claims, null, 2)}`,
          },
        ],
      }));

      server.resource(
          "Todos",
          new ResourceTemplate("todoapp://todos/{id}", {
            list: async () => {
              const todos = await todoService.get();

              return {
                resources: todos.map((todo) => ({
                  name: todo.text,
                  uri: `todoapp://todos/${todo.id}`,
                })),
              };
            },
          }),
          async (uri, { id }) => {
            const todos = await todoService.get();
            const todo = todos.find((todo) => todo.id === id);
            return {
              contents: [
                {
                  uri: uri.href,
                  text: todo
                      ? `text: ${todo.text} completed: ${todo.completed}`
                      : "NOT FOUND",
                },
              ],
            };
          },
      );

      server.tool(
          "createTodo",
          "Add a new TODO task",
          { todoText: z.string() },
          async ({ todoText }) => {
            const todos = await todoService.add(todoText);
            return formatResponse("TODO added successfully", todos);
          },
      );

      server.tool(
          "markTodoComplete",
          "Mark a TODO as complete",
          { todoID: z.string() },
          async ({ todoID }) => {
            const todos = await todoService.markCompleted(todoID);
            return formatResponse("TODO completed successfully", todos);
          },
      );

      server.tool(
          "deleteTodo",
          "Mark a TODO as deleted",
          { todoID: z.string() },
          async ({ todoID }) => {
            const todos = await todoService.delete(todoID);
            return formatResponse("TODO deleted successfully", todos);
          },
      );

      return server
    };
