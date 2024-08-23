![Netlify Examples](https://github.com/netlify/examples/assets/5865/4145aa2f-b915-404f-af02-deacee24f7bf)

# Functions - Hello world

**View this demo site**: https://example-functions-hello-world.netlify.app/

[![Netlify Status](https://api.netlify.com/api/v1/badges/f15f03f9-55d8-4adc-97d5-f6e085141610/deploy-status)](https://app.netlify.com/sites/example-hello-world-function/deploys)



## About this example site

This site shows a very simple "Hello World" example of developing and running serverless functions with Netlify Functions. It includes links to a deployed serverless function and an example of accessing the function using a customized URL.


- [About Netlify Functions](https://www.netlify.com/products/functions/?utm_campaign=dx-examples&utm_source=example-site&utm_medium=web&utm_content=example-hello-functions)
- [Docs: Netlify Functions](https://docs.netlify.com/functions/overview/?utm_campaign=dx-examples&utm_source=example-site&utm_medium=web&utm_content=example-hello-functions)
- [Accessing your function logs](https://docs.netlify.com/functions/logs/?utm_campaign=dx-examples&utm_source=example-site&utm_medium=web&utm_content=example-hello-functions)
- [Learn serverless in the functions playground](https://functions.netlify.com/?utm_campaign=dx-examples&utm_source=example-site&utm_medium=web&utm_content=example-hello-functions)



## Speedily deploy your own version

Deploy your own version of this example site, by clicking the Deploy to Netlify Button below. This will automatically:

- Clone a copy of this example from the examples repo to your own GitHub account
- Create a new project in your [Netlify account](https://app.netlify.com/?utm_medium=social&utm_source=github&utm_campaign=devex-ph&utm_content=devex-examples), linked to your new repo
- Create an automated deployment pipeline to watch for changes on your repo
- Build and deploy your new site

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/netlify/examples/&create_from_path=examples/serverless/hello-world-functions&utm_campaign=dx-examples)


## Install and run the examples locally

You can clone this entire examples repo to explore this and other examples, and to run them locally.

```shell

# 1. Clone the examples repository to your local development environment
git clone git@github.com:netlify/examples

# 2. Move into the project directory for this example
cd examples/functions-hello-world

# 3. Install the Netlify CLI to let you locally serve your site using Netlify's features
npm i -g netlify-cli

# 4. Serve your site using Netlify Dev to get local serverless functions
netlify dev

```


