![Netlify Examples](https://github.com/netlify/examples/assets/5865/4145aa2f-b915-404f-af02-deacee24f7bf)

# User-generated uploads example with Astro and Netlify Blobs

[View this example site here](https://example-user-uploads-astro-blobs.netlify.app/)

This site shows how you can use Netlify Blobs in an Astro project to store and display assets uploaded by users. It uses a random, mocked auth service and enables a logged-in user to upload an avatar image that gets displayed in the header.

## Clone and deploy this example

Deploy your own version of this example site, by clicking the button below. This will automatically:

- Clone a copy of this example from the [examples repo](https://github.com/netlify/examples) to your own GitHub account
- Create a new project in your [Netlify account](https://app.netlify.com/?utm_medium=social&utm_source=github&utm_campaign=devex-ph&utm_content=devex-examples), linked to your new repo
- Create an automated deployment pipeline to watch for changes on your repo
- Build and deploy your new site

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/netlify/examples/&create_from_path=examples/user-image-uploads-astro-blobs&utm_campaign=netlify-examples)

## Install and run locally

You can clone this entire examples repo to explore this and other examples, and to run them locally.

### Clone the project

Begin by cloning the examples repository to your local development environment:

    git clone git@github.com:netlify/examples

Install the Netlify CLI to let you locally serve your site using Netlify's features

    npm i -g netlify-cli

Move into the project directory for this example to continue.

    cd examples/user-image-uploads-astro-blobs

### Install dependencies

Next, install the project dependencies by running the following command from the project directory:

    npm install

### Start development server

Now you're ready to start the development server. Run the following command from the project directory.

    netlify dev --target-port 4321

This will open the browser to `http://localhost:8888` with your local development server running.

## More examples

Explore other examples of using the Netlify platform and primitives (with or without a framework) in this [examples repo](https://github.com/netlify/examples).
