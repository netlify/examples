import type { Config, Context } from "@netlify/edge-functions";
import { jwtVerify, importSPKI } from "https://deno.land/x/jose@v4.3.7/index.ts";

export default async function (request: Request, context: Context) {
  try {
    // Import the PEM key
    const pemKey = Netlify.env.get("CLERK_PEM_PUBLIC_KEY");
    const key = await importSPKI(pemKey, "RS256");
    // Verify the JWT
    const jwt = context.cookies.get("__session");
    const { payload } = await jwtVerify(jwt, key);
    console.log("JWT verified! Payload:", payload);
  } catch (error) {
    console.error("JWT verification failed:", error);
    return new URL("/__gate__", request.url);
  }
}

export const config: Config = {
  path: "/gated-content",
};
