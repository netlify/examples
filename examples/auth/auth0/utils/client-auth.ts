import { Auth0Client, createAuth0Client } from '@auth0/auth0-spa-js';

let auth0Client: Auth0Client | null = null;

export async function getAuth0Client(): Promise<Auth0Client> {
  if (auth0Client) return auth0Client;
  
  auth0Client = await createAuth0Client({
    domain: import.meta.env.PUBLIC_AUTH0_DOMAIN,
    clientId: import.meta.env.PUBLIC_AUTH0_CLIENT_ID,
    authorizationParams: {
      audience: import.meta.env.PUBLIC_AUTH0_AUDIENCE,
      redirect_uri: window.location.origin,
      scope: 'openid profile email'
    }
  });
  
  return auth0Client;
}

export async function login(): Promise<void> {
  const client = await getAuth0Client();
  await client.loginWithRedirect({
    authorizationParams: {
      redirect_uri: window.location.origin
    }
  });
}

export async function logout(): Promise<void> {
  const client = await getAuth0Client();
  await client.logout({
    logoutParams: {
      returnTo: window.location.origin
    }
  });
}

export async function handleCallback(): Promise<void> {
  const client = await getAuth0Client();
  await client.handleRedirectCallback();
  window.history.replaceState({}, document.title, '/');
}

export async function callProtectedEndpoint<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const client = await getAuth0Client();
  const token = await client.getTokenSilently();
  
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Full error response:', {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
      headers: Object.fromEntries(response.headers)
    });
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json() as Promise<T>;
} 