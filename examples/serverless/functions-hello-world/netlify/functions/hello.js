// hello there!
//
// I'm a serverless function that you can deploy as part of your site.
// You can develop and deploy serverless functions right here as part
// of your site. Netlify Functions will handle the rest for you.

export default async (req) => {
  // Get the name from query parameters
  const url = new URL(req.url);
  const name = url.searchParams.get('name') || 'World';

  // Return a Response object
  return new Response(`Hello ${name}!`);
};
