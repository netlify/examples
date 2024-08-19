// Source a list of know User Agent strings used by AI crawlers.
const agents = require('../../agents.json');


export default async (request, context) => {
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