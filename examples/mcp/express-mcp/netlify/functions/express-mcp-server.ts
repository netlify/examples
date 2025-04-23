import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { setupMCPServer } from "../mcp-server";
import express from "express";
import type { Request, Response } from "express";
import serverless from "serverless-http";
import type { Context } from "@netlify/functions";

// Create Express app
const app = express();
app.use(express.json());

app.post('/mcp', async (req: Request, res: Response) => {
  // In stateless mode, create a new instance of transport and server for each request
  // to ensure complete isolation. A single instance would cause request ID collisions
  // when multiple clients connect concurrently.

  console.log("Received POST MCP request", {body: req.body});

  try {
    const server = setupMCPServer();
    const transport: StreamableHTTPServerTransport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });
    await server.connect(transport);
    await transport.handleRequest(req, res);
    res.on('close', () => {
      console.log('Request closed');
      transport.close();
      server.close();
    });
  } catch (error) {
    console.error('Error handling MCP request:', error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: 'Internal server error',
        },
        id: null,
      });
    }
  }
});

app.get("/mcp", (req: Request, res: Response) => {
  // For the stateless server, GET requests are used to initialize
  // SSE connections which are stateful. Therefore, we don't need
  // to handle GET requests but we can signal to the client this error.
  console.log("Received GET MCP request");
  res.status(405).json({
    jsonrpc: "2.0",
    error: {
      code: -32000,
      message: "Method not allowed.",
    },
    id: null,
  });
});

app.delete("/mcp", (req: Request, res: Response) => {
  console.log("Received DELETE MCP request");
  res.status(405).json({
    jsonrpc: "2.0",
    error: {
      code: -32000,
      message: "Method not allowed.",
    },
    id: null,
  });
});

export const handler = serverless(app);
