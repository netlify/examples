import type { Context } from "@netlify/functions";
import { verifyAuth0Token } from "../../utils/server-auth";

export default async function handler(req: Request, context: Context) {
  try {
    
    const { token, result } = await verifyAuth0Token(req);
    
    
    if (!token) {
      return new Response('Unauthorized - No token', { status: 401 });
    }
    
    const response = {
      message: 'Authenticated',
      result
    };
    
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Auth error:', error);
    return new Response(error instanceof Error ? error.message : 'Unauthorized', { 
      status: 401 
    });
  }
}
  

