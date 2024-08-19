import { Context, Config } from "@netlify/edge-functions";
import agents from "../../agents.json" with { type: "json" };

export default async (request: Request, context: Context) => {
  const ua = request.headers.get('user-agent');
  let isBot = false;
  agents.forEach(u => {
    if (ua.toLowerCase().includes(u.toLowerCase())) {
      isBot = true;
    }
  })
  const response = isBot ? new Response(null, { status: 401 }) : await context.next();
  return response;
};

export const config: Config = {
  path: "*",
};



