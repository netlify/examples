const CLIENT_ID = "";
const REDIRECT_URI = "http://localhost:8888/";

// Simple and secure way to generate state
function generateState() {
  return crypto.randomUUID(); 
}

function handleNetlifyOAuth() {
  const clientId = CLIENT_ID;
  const redirectUri = REDIRECT_URI;
  const state = generateState();
  
  localStorage.setItem('oauth_state', state);
  
  const authLink = `https://app.netlify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&state=${state}`;

  window.location.href = authLink;
}

document.addEventListener('DOMContentLoaded', () => {
  const oAuthButton = document.querySelector("#oauth-button");
  if (oAuthButton) {
    oAuthButton.addEventListener("click", handleNetlifyOAuth);
  } else {
    console.error('OAuth button not found');
  }
});

const hash = document.location.hash;

/*
 * This function is called when a user returns from Netlify and has accepted the
 * request to authorize your app.
 *
 * It extracts the token from the response and use it to do a simple API request
 * fetching the latest sites from the user from Netlify.
 */
function handleAccessToken() {  
  // The access token is returned in the hash part of the document.location
  //   #access_token=1234&response_type=token&state=...
  const response = new URLSearchParams(hash.replace(/^#/, ''));
  const state = response.get('state');
  const accessToken = response.get('access_token')

  const savedState = localStorage.getItem('oauth_state');
   // Clean up immediately
  localStorage.removeItem('oauth_state');

  if (!savedState || savedState !== state) {
    console.log('Security Error: Invalid state parameter. Possible CSRF attack.');
    return;
  }

  // Remove the token so it's not visible in the URL after we're done
  document.location.hash = '';

  // Send the access token to the create-token endpoint to generate a PAT
  fetch('/create-token', {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(json => {
      console.log(json);
    })
    .catch(error => {
      console.log(error)
    });
}

/*
 * If we have any hash, it's because the user is coming back from Netlify and we
 * can start doing API requests on their behalf.
 */
if (document.location.hash) {
  handleAccessToken();
}


