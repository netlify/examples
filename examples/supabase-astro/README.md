![Netlify Examples](https://github.com/netlify/examples/assets/5865/4145aa2f-b915-404f-af02-deacee24f7bf)

# Supabase example with Astro

[View this example site here](https://supabase-astro.netlify.app/)

This site shows how you can use Supabase in an Astro project to store and display assets uploaded by users. It displays various pets and lets you look at their pages.

## Clone and deploy this example

Deploy your own version of this example site, by clicking the button below. This will automatically:

- Clone a copy of this example from the [examples repo](https://github.com/netlify/examples) to your own GitHub account
- Create a new project in your [Netlify account](https://app.netlify.com/?utm_medium=social&utm_source=github&utm_campaign=devex-ph&utm_content=devex-examples), linked to your new repo
- Create an automated deployment pipeline to watch for changes on your repo
- Build and deploy your new site

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/netlify/examples/&create_from_path=examples/supabase-astro&utm_campaign=netlify-examples)

## Install and run locally

Let's get the project up and running locally.

### Clone the project

Begin by cloning the examples repository to your local development environment.

    git clone git@github.com:netlify/examples

Move into the project directory for this example to continue.

    cd examples/supabase-astro

### Install dependencies

Next, install the project dependencies by running the following command from the project directory.

    npm install

Install the Netlify CLI to let you locally serve your site using Netlify's features. We'll do more with this shortly.

    npm i -g netlify-cli

### Set up the database

To use this with your own Supabase project, you'll need to set up and seed a new database.

1. Create a new Supabase project.
2. Run the SQL commands found in the `supabase/migrations` directory in the Supabase UI.
3. To seed the database with data, you can import the contents of the `supabase/seed.csv` file in the Supabase UI.

ℹ️ _Note: This example was designed to be used with the Supabase extension for Netlify. If you aren't linked to a Netlify site using the extension, you will need to set the `SUPABASE_DATABASE_URL` and `SUPABASE_ANON_KEY` environment variables in the `.env` file._

### Start development server

Now you're ready to start the development server. Run the following command from the project directory.

    netlify dev --target-port 4321

This will open the browser to `http://localhost:8888` with your local development server running.

## More examples

Explore other examples of using the Netlify platform and primitives (with or without a framework) in this [examples repo](https://github.com/netlify/examples).
