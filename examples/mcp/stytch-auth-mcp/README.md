![Netlify Examples](https://github.com/netlify/examples/assets/5865/4145aa2f-b915-404f-af02-deacee24f7bf)

# MCP example Netlify Serverless Functions

**View this demo site**: https://stytch-auth-mcp.netlify.app/

[![Netlify Status](https://api.netlify.com/api/v1/badges/31896999-f298-451e-b9c3-9d5684e2066e/deploy-status)](https://app.netlify.com/projects/stytch-auth-mcp/deploys)



## About this example site

This site shows a starter example for using Netlify serverless functions and Stytch Identity to provide an authenticated MCP server exposing user-scoped data to agents.

This site uses the [Stytch Consumer](https://stytch.com/b2c) product, which is purpose-built for Consumer SaaS authentication requirements.
B2B SaaS applications should evaluate Stytch's [B2B](https://stytch.com/b2b) product as well.

- [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)
- [Docs: Netlify Functions](https://docs.netlify.com/functions/overview/?utm_campaign=dx-examples&utm_source=example-site&utm_medium=web&utm_content=example-mcp-serverless)
- [Agent Experience (AX)](https://agentexperience.ax?utm_source=serverless-mcp-guide&utm_medium=web&utm_content=example-mcp-serverless)
- [Docs: Stytch UI Components](https://stytch.com/docs/guides/implementation/frontend-pre-built-ui?utm_source=serverless-mcp-guide&utm_medium=web&utm_content=example-mcp-serverless)
- [Stytch Connected Apps](https://stytch.com/docs/guides/connected-apps/getting-started?utm_source=serverless-mcp-guide&utm_medium=web&utm_content=example-mcp-serverless)

## Speedily deploy your own version

Deploy your own version of this example site, by clicking the Deploy to Netlify Button below. This will automatically:

- Clone a copy of this example from the examples repo to your own GitHub account
- Create a new project in your [Netlify account](https://app.netlify.com/?utm_medium=social&utm_source=github&utm_campaign=devex-ph&utm_content=devex-examples), linked to your new repo
- Create an automated deployment pipeline to watch for changes on your repo
- Build and deploy your new site
- This repo can then be used to iterate on locally using `netlify dev`

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/netlify/examples/&create_from_path=examples/mcp/serverless-mcp&utm_campaign=dx-examples)


### In the Stytch Dashboard

1. Create a [Stytch](https://stytch.com/) account. Within the sign up flow select **Consumer Authentication** as the authentication type you are interested in. Once your account is set up a Project called "My first project" will be automatically created for you.

2. Navigate to [Frontend SDKs](https://stytch.com/dashboard/sdk-configuration?env=test) to enable the Frontend SDK in Test

3. Navigate to [Connected Apps](https://stytch.com/dashboard/connected-apps?env=test) to enable Dynamic Client Registration and configure your authorization URL as `http://localhost:3000/oauth/authorize`.

4. Navigate to [Project Settings](https://stytch.com/dashboard/project-settings?env=test) to view your Project ID and API keys. You will need these values later.

### Required Environment Variables

- `STYTCH_PROJECT_ID` - Your Stytch project ID from the [Stytch Dashboard](https://stytch.com/dashboard)
- `STYTCH_SECRET` - Your Stytch project secret
- `STYTCH_DOMAIN` - Your Stytch project domain

### Setting up Environment Variables

#### For Local Development

1. Copy the example file:
   ```shell
   cp .env.local.example .env.local
   ```

2. Fill in your actual values in `.env.local`

#### For Netlify Deployment

Set environment variables in your Netlify site dashboard:
1. Go to Site Settings → Environment Variables
2. Add each required variable with your actual values

Alternatively, use the Netlify CLI:
```shell
netlify env:set STYTCH_PROJECT_ID "your-project-id"
netlify env:set STYTCH_DOMAIN "your-project-domain"
netlify env:set STYTCH_SECRET "your-secret" --secret
netlify env:set OPENAI_API_KEY "your-openai-key" --secret
```

## Install and run the examples locally

You can clone this entire examples repo to explore this and other examples, and to run them locally.

```shell

# 1. Clone the examples repository to your local development environment
git clone git@github.com:netlify/examples

# 2. Move into the project directory for this example
cd examples/mcp/serverless-mcp

# 3. Set up environment variables (see Environment Variables Setup above)
cp .env.local.example .env.local
# Edit .env.local with your actual values

# 4. Install the Netlify CLI to let you locally serve your site using Netlify's features
npm i -g netlify-cli

# 5. Serve your site using Netlify Dev to get local serverless functions
netlify dev

# 6. While the site is running locally, open a separate terminal tab to run the MCP inspector or client you desire
# direct at http://localhost:8888/mcp using Streamable HTTP
npx @modelcontextprotocol/inspector
```

## Get help and join the community

#### :speech_balloon: Stytch community Slack

Join the discussion, ask questions, and suggest new features in our [Slack community](https://stytch.com/docs/resources/support/overview)!

#### :question: Need support?

Check out the [Stytch Forum](https://forum.stytch.com/) or email us at [support@stytch.com](mailto:support@stytch.com).