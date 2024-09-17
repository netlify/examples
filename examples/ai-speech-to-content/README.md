![Netlify Examples](https://github.com/netlify/examples/assets/5865/4145aa2f-b915-404f-af02-deacee24f7bf)

# AI Speech To Content with Groq

[![Netlify Status](https://api.netlify.com/api/v1/badges/c259de40-5b8a-4fbe-8d0c-710fc4db58a1/deploy-status)](https://app.netlify.com/sites/example-ai-executive-summaries/deploys)


## About this example

This example shows how to use Groq AI interface with Netlify Functions transforming speech to content and enabling visual editing.

- [Guided Walkthrough of Example]()
- [About Netlify Functions](https://www.netlify.com/products/functions/?utm_campaign=dx-examples&utm_source=example-site&utm_medium=web&utm_content=example-ai-speech-to-content)
- [Docs: Netlify Functions](https://docs.netlify.com/functions/overview/?utm_campaign=dx-examples&utm_source=example-site&utm_medium=web&utm_content=example-ai-speech-to-content)
- [About Groq](https://groq.com/groqcloud/)


## Speedily deploy your own version

Deploy your own version of this example site, by clicking the Deploy to Netlify Button below. This will automatically:

- Clone a copy of this example from the examples repo to your own GitHub account
- Create a new project in your [Netlify account](https://app.netlify.com/?utm_medium=social&utm_source=github&utm_campaign=devex-ph&utm_content=devex-examples), linked to your new repo
- Create an automated deployment pipeline to watch for changes on your repo
- Build and deploy your new site

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/netlify/examples/&create_from_path=examples/ai-speech-to-content&utm_campaign=dx-examples)

## Install and run the examples locally

You can clone this entire examples repo to explore this and other examples, and to run them locally.

```shell

# 1. Clone the examples repository to your local development environment
git clone git@github.com:netlify/examples

# 2. Move into the project directory for this example
cd examples/ai-speech-to-content

# 3. Install the dependencies
npm i

# 4. Install the Netlify CLI to let you locally serve your site using Netlify's features
npm i -g netlify-cli

# 5. Build custom controls
export API_HOST="http://localhost:8888" && npm run build-custom-controls-config && npm run build-custom-controls

# 6. Run Visual Editor CLI
stackbit dev --port 4321

# 7. Serve your site using Netlify Dev to get local serverless functions
export GROQ_API_KEY='' && netlify dev --target-port 4321

```
