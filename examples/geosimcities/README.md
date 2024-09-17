![Netlify Examples](https://github.com/netlify/examples/assets/5865/4145aa2f-b915-404f-af02-deacee24f7bf)

# GeoSimCities

Recreate the magic of [GeoCities](https://www.google.com/search?q=geocities) with Advanced AI, [Langbase](https://langbase.com/) and [Netlify](https://www.netlify.com/).

[View the demo at geosimcities.netlify.app](https://geosimcities.netlify.app/).

## Clone and deploy this example

Deploy your own version of this example site, by clicking the button below. This will automatically:

- Clone a copy of this example from the [examples repo](https://github.com/netlify/examples) to your own GitHub account
- Create a new project in your [Netlify account](https://app.netlify.com/?utm_medium=social&utm_source=github&utm_campaign=devex-ph&utm_content=devex-examples), linked to your new repo
- Create an automated deployment pipeline to watch for changes on your repo
- Build and deploy your new site

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/netlify/examples/&create_from_path=examples/geosimcities&utm_campaign=netlify-examples)

## Local development

Let's get set up running this project locally.

### Clone new project

If you've used the button above to deploy the project to Netlify, then first locate the repository in your remote Git provider account and clone it to your local development environment.

    git clone git@github.com:<your-account>/geosimcities
    cd geosimcities

### Clone from examples repository

Or you can clone the examples repository and navigate to this example.

    git clone git@github.com:netlify/examples
    cd examples/geosimcities

### Install dependencies

Next, install the project dependencies by running the following command from the project directory:

    npm install

### Start development server

Install the Netlify CLI to let you locally serve your site using Netlify's features

    npm i -g netlify-cli

Now you're ready to start the development server. Run the following command from the project directory.

    netlify dev

This will open the browser to `http://localhost:8888` with your local development server running.

## More examples

Explore other examples of using the Netlify platform and primitives (with or without a framework) in this [examples repo](https://github.com/netlify/examples).
