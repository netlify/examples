const CLIENT_ID = "A664Jlyp4mpBSVIktWtGjeshNaERA_CBzSC_IcNl618";
const REDIRECT_URI = "http://localhost:8888/";

function generateState() {
  return crypto.randomUUID(); // Simple and secure way to generate state
}

function handleNetlifyOAuth() {
  const clientId = CLIENT_ID;
  const redirectUri = REDIRECT_URI;
  const state = generateState();
  
  // Store state in sessionStorage (more secure than localStorage for OAuth states)
  sessionStorage.setItem('oauth_state', state);
  
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
  const response = hash.replace(/^#/, '').split('&').reduce((result, pair) => {
    const keyValue = pair.split('=');
    result[keyValue[0]] = keyValue[1];
    return result;
  }, {});

  // Verify state parameter
  const savedState = sessionStorage.getItem('oauth_state');
  // Clean up immediately
  sessionStorage.removeItem('oauth_state');

  if (!savedState || savedState !== response.state) {
    console.log('Security Error: Invalid state parameter. Possible CSRF attack.');
    return;
  }

  // Remove the token so it's not visible in the URL after we're done
  document.location.hash = '';

  // Send the access token to the create-token endpoint to generate a PAT
  fetch('/create-token', {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${response.access_token}`,
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


