import type { Context, Config } from "@netlify/functions"

export default async (req: Request, context: Context) => {
  const accessToken = req.headers.get('Authorization')?.split(' ')[1]
  
  if (!accessToken) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    // This endpoint Personal Access Tokens, or PATs, and act the same as the OAuth2 access tokens, but with a configurable expiration attached to them 
    const response = await fetch('https://api.netlify.com/api/v1/oauth/applications/create_token', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        administrator_id: null,
        expires_in: 604800,
        grant_saml: false,
        name: "token-from-state-example"
      })
    })

    const data = await response.json()
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create token' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export const config: Config = {
  path: "/create-token"
} 