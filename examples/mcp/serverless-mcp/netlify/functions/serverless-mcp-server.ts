import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { toFetchResponse, toReqRes } from "fetch-to-node";
import { setupMCPServer } from "../mcp-server";

// Netlify serverless function handler
export default async (req: Request) => {

  try{

    // Handle different HTTP methods
    if (req.method === "POST") {
      return handleMCPPost(req);
    } else if (req.method === "GET") {
      return handleMCPGet();
    } else if (req.method === "DELETE") {
      return handleMCPDelete();
    } else {
      return new Response("Method not allowed", { status: 405 });
    }

  } catch (error) {

    console.error("MCP error:", error);
    return new Response(
      JSON.stringify({
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: "Internal server error",
        },
        id: null,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};


async function handleMCPPost(req: Request) {

  // Convert the Request object into a Node.js Request object
  const { req: nodeReq, res: nodeRes } = toReqRes(req);
  const server = setupMCPServer();

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });

  await server.connect(transport);

  const body = await req.json();
  await transport.handleRequest(nodeReq, nodeRes, body);

  nodeRes.on("close", () => {
    console.log("Request closed");
    transport.close();
    server.close();
  });

  return toFetchResponse(nodeRes);

}

// For the stateless server, GET requests are used to initialize
// SSE connections which are stateful. Therefore, we don't need
// to handle GET requests but we can signal to the client this error.
function handleMCPGet() {
  console.log("Received GET MCP request");
  return new Response(
    JSON.stringify({
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: "Method not allowed.",
      },
      id: null,
    }),
    {
      status: 405,
      headers: { "Content-Type": "application/json" }
    }
  );
}

function handleMCPDelete() {
  console.log("Received DELETE MCP request");
  return new Response(
    JSON.stringify({
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: "Method not allowed.",
      },
      id: null,
    }),
    {
      status: 405,
      headers: { "Content-Type": "application/json" }
    }
  );
}


// Ensure this function responds to the <domain>/mcp path
// This can be any path you want but you'll need to ensure the
// mcp server config you use/share matches this path.
export const config = {
  path: "/mcp"
};
