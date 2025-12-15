import type { Context } from '@netlify/functions';

/**
 * Auth API Endpoint
 *
 * POST /api/auth/verify - Verify admin token
 */
export default async function handler(
  request: Request,
  _context: Context
): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const adminToken = process.env.ADMIN_TOKEN;

  // If no admin token configured, auth is disabled (demo mode)
  if (!adminToken) {
    return new Response(JSON.stringify({ valid: true, demo: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ valid: false, error: 'No token provided' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const token = authHeader.replace('Bearer ', '');
  if (token !== adminToken) {
    return new Response(JSON.stringify({ valid: false, error: 'Invalid token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ valid: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export const config = {
  path: '/api/auth/verify',
};
