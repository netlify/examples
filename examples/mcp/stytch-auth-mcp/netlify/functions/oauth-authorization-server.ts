const CORSHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, MCP-Protocol-Version",
    "Access-Control-Max-Age": "86400",
}

export default async (req: Request) => {
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
        return new Response(null, {status: 200, headers: {...CORSHeaders},});
    }

    if (req.method !== "GET") {
        return new Response("Method not allowed", {status: 405,});
    }

    const url = new URL(req.url);
    const projectID = Netlify.env.get("STYTCH_PROJECT_ID");
    if (!projectID) {
        return new Response("STYTCH_PROJECT_ID is not set", {status: 500});
    }

    const getEndpoint = (endpoint: string) => {
        const baseURL = projectID.includes("test")
            ? "https://test.stytch.com/v1/public"
            : "https://api.stytch.com/v1/public";

        return `${baseURL}/${projectID}/${endpoint}`;
    };

    const responseData = {
        issuer: projectID,
        authorization_endpoint: `${url.origin}/oauth/authorize`,
        token_endpoint: getEndpoint("oauth2/token"),
        registration_endpoint: getEndpoint("oauth2/register"),
        scopes_supported: ["openid", "profile", "email", "offline_access"],
        response_types_supported: ["code"],
        response_modes_supported: ["query"],
        grant_types_supported: ["authorization_code", "refresh_token"],
        token_endpoint_auth_methods_supported: ["none"],
        code_challenge_methods_supported: ["S256"],
    };

    return new Response(JSON.stringify(responseData), {
        status: 200,
        headers: {"Content-Type": "application/json", ...CORSHeaders,},
    });
};

export const config = {
    path: "/.well-known/oauth-authorization-server"
};
