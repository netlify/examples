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

    const stytchDomain = Netlify.env.get("STYTCH_DOMAIN");

    const responseData = {
        resource: new URL(req.url).origin,
        authorization_servers: [`https://${stytchDomain}`],
        scopes_supported: ["openid", "email", "profile"],
    };

    return new Response(JSON.stringify(responseData), {
        status: 200,
        headers: {"Content-Type": "application/json", ...CORSHeaders,},
    });
};

export const config = {
    path: "/.well-known/oauth-protected-resource"
};
