import {StreamableHTTPServerTransport} from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {toFetchResponse, toReqRes} from "fetch-to-node";
import {setupMCPServer} from "../mcp-server";
import {Client} from "stytch";

// Initialize Stytch client
const client = new Client({
    project_id: Netlify.env.get("STYTCH_PROJECT_ID") as string,
    secret: Netlify.env.get("STYTCH_SECRET") as string,
    custom_base_url: `https://${Netlify.env.get("STYTCH_DOMAIN")}`,
});

type validateResult =
    | { valid: false; reason: string }
    | { valid: true; claims: Awaited<ReturnType<typeof client.idp.introspectTokenLocal>>; };

const validateRequestWithStytch = async (
    req: Request,
): Promise<validateResult> => {
    // Get the authorization header
    const authHeader = req.headers.get("authorization");

    // Check if auth header exists and starts with 'Bearer '
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("NO AUTH HEADER");
        return {valid: false, reason: "Missing or invalid authorization header"};
    }

    // Extract the token
    const token = authHeader.split(" ")[1];

    try {
        const claims = await client.idp.introspectTokenLocal(token);
        return {valid: true, claims};
    } catch (err) {
        console.error("Unable to validate Stytch Access Token:", err);
        return {valid: false, reason: "Invalid or expired token"};
    }
};

// Netlify serverless function handler
export default async (req: Request) => {
    try {
        // Handle different HTTP methods
        if (req.method === "POST") {
            return handleMCPPost(req);
        } else if (req.method === "GET") {
            return handleMCPGet();
        } else if (req.method === "DELETE") {
            return handleMCPDelete();
        } else {
            return new Response("Method not allowed", {status: 405});
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
                headers: {"Content-Type": "application/json"}
            }
        );
    }
};


async function handleMCPPost(req: Request) {
    const validationResult = await validateRequestWithStytch(req);
    if (!validationResult.valid) {
      const origin = new URL(req.url).origin;
      const resourceMetadataUrl = `${origin}/.well-known/oauth-protected-resource`;
        return new Response(
            JSON.stringify({error: validationResult.reason}),
            {
                status: 401,
                headers: {
                "Content-Type": "application/json",
                "WWW-Authenticate": `Bearer resource_metadata="${resourceMetadataUrl}"`,
                }
            }
        );
    }

    console.log(
        `Auth valid! creating MCP server for user ${validationResult.claims.subject}....`,
    );

    // Convert the Request object into a Node.js Request object
    const {req: nodeReq, res: nodeRes} = toReqRes(req);
    const server = setupMCPServer(validationResult.claims);

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
            headers: {"Content-Type": "application/json"}
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
            headers: {"Content-Type": "application/json"}
        }
    );
}


// Ensure this function responds to the <domain>/mcp path
// This can be any path you want but you'll need to ensure the
// mcp server config you use/share matches this path.
export const config = {
    path: "/mcp"
};
