![Netlify Examples](https://github.com/netlify/examples/assets/5865/4145aa2f-b915-404f-af02-deacee24f7bf)

# Gated content with Clerk

This example builds on the [simple auth example using Clerk](https://github.com/netlify/examples/tree/main/examples/auth/clerk-js) to show a simple approach for gating content using Clerk.

## Speedily deploy your own version

Deploy your own version of this example site, by clicking the Deploy to Netlify Button below. This will automatically:

- Clone a copy of this example from the examples repo to your own GitHub account
- Create a new project in your [Netlify account](https://app.netlify.com/?utm_medium=social&utm_source=github&utm_campaign=deved&utm_content=netlify-examples), linked to your new repo
- Create an automated deployment pipeline to watch for changes on your repo
- Build and deploy your new site

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/netlify/examples/&create_from_path=examples/auth/clerk-gated-page&utm_campaign=netlify-examples)

## Install and run locally

You can clone this entire examples repo to explore this and other examples, and to run them locally.

### Clone the project

Begin by cloning the examples repository to your local development environment:

    git clone git@github.com:netlify/examples

Install the Netlify CLI to let you locally serve your site using Netlify's features

    npm i -g netlify-cli

Move into the project directory for this example to continue.

    cd examples/auth/clerk-gated-page

### Setup Clerk account

You will need a Clerk account and application to use this example. Visit [clerk.com](https://clerk.com/) to sign up and create an application.

Follow the steps on the [JavaScript Quickstart guide](https://clerk.com/docs/quickstarts/javascript) to get the script tag to include in `index.html`, `gated-content.html`, and `__gate__.html`, replacing the code below.

```html
<!-- TODO: Set the publishable key and script `src` for your Clerk account -->
<script
  async
  crossorigin="anonymous"
  data-clerk-publishable-key="<!-- TODO -->"
  src="<!-- TODO -->"
  type="text/javascript"
></script>
```

Copy `.env.sample` to `.env` and replace the `CLERK_PEM_PUBLIC_KEY` value with the value from your Clerk application. [Visit the backend request handling guide](https://clerk.com/docs/backend-requests/handling/manual-jwt#get-your-instances-public-key) to see how you can get the public PEM key.

```bash
CLERK_PEM_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----
TODO: Replace with your Clerk public key
-----END PUBLIC KEY-----"
```

### Start development server

Now you're ready to start the development server. Run the following command from the project directory.

    netlify dev

This will open the browser to `http://localhost:8888` with your local development server running.
