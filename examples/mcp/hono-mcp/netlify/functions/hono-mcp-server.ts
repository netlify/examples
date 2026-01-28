import { Hono } from "hono";
import { handle } from 'hono/netlify'
import { StreamableHTTPTransport } from "@hono/mcp"
import { setupMCPServer } from "../mcp-server";
import { HTTPException } from "hono/http-exception"

const app = new Hono();

app.all("/mcp", async (c) => {
  const server = setupMCPServer();

  const transport = new StreamableHTTPTransport();
  await server.connect(transport);
  return transport.handleRequest(c);
});

app.onError((err, c) => {
  console.log(err.message)

  if (err instanceof HTTPException && err.res) {
    return err.res
  }

  return c.json(
    {
      jsonrpc: '2.0',
      error: {
        code: -32603,
        message: 'Internal server error',
      },
      id: null,
    },
    500
  )
})

export default handle(app);

// Ensure this function responds to the <domain>/mcp path
// This can be any path you want but you'll need to ensure the
// mcp server config you use/share matches this path.
export const config = {
  path: "/mcp",
};
