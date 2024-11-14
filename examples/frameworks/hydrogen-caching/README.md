# Hydrogen example storefront with advanced caching patterns

Hydrogen is Shopify’s stack for headless commerce. Hydrogen is designed to dovetail with
[Remix](https://remix.run/), Shopify’s full stack web framework. This template contains a **minimal
setup** of components, queries and tooling to get started with Hydrogen.

[View this example site here]: https://example-hydrogen-caching.netlify.app/
[This example site is accompanied by a guide in the Netlify developer hub]: https://developers.netlify.com/guides/load-your-hydrogen-e-commerce-site-pages-faster-with-netlifys-advanced-caching-primitives/
[Deploy to Netlify]: https://app.netlify.com/start/deploy?repository=https://github.com/netlify/examples/&create_from_path=examples/frameworks/hydrogen-caching&utm_campaign=dx-examples

![Netlify Examples](https://github.com/netlify/examples/assets/5865/4145aa2f-b915-404f-af02-deacee24f7bf)

- [View this example site here]
- [This example site is accompanied by a guide in the Netlify developer hub]

## Clone and deploy this example

Deploy your own version of this example site, by clicking the button below. This will automatically:

- Clone a copy of this example from the [examples repo](https://github.com/netlify/examples) to your own GitHub account
- Create a new site in your [Netlify account](https://app.netlify.com/?utm_medium=social&utm_source=github&utm_campaign=devex-ph&utm_content=devex-examples), linked to your new repo
- Create an automated deployment pipeline to watch for changes on your repo
- Build and deploy your new site

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)][Deploy to Netlify]

## More examples

Explore other examples of using the Netlify platform and primitives (with or without a framework) in this [examples repo](https://github.com/netlify/examples).

See also [our Hydrogen template without caching](https://github.com/netlify/hydrogen-template).

## What's included

- Remix 2
  - [Check out Hydrogen docs](https://shopify.dev/custom-storefronts/hydrogen)
  - [Get familiar with Remix](https://remix.run/docs/)
- Hydrogen
- Shopify CLI
- Configured deployment to Netlify, with Server-Side Rendering (SSR) via [Netlify Edge
  Functions](https://docs.netlify.com/edge-functions/overview/)
- ESLint
- Prettier
- GraphQL generator
- TypeScript and JavaScript flavors
- Minimal setup of components and routes
- SSR page response caching by with Stale-While-Revalidate by default, with per-page overridable
  configuration
- SSR resource route response caching (used for CSR) with Stale-While-Revalidate by default, with
  per-page overridable configuration
- Caching configured to vary appropriately on scaffolded pages (i.e. products vary on variant
  options, search varies on query, etc.)
- Cache tag set on product pages with Shopify product ID
- Shopify webhook handler which invalidates the product's page when a product is updated

## Getting started

**Requirements:**

- Node.js version 18.0.0 or higher
- Netlify CLI 17.0.0 or higher

```bash
npm install -g netlify-cli@latest
```

To create a new project, click the "Deploy to Netlify" button above, follow the prompts, and you're
ready to start developing.

## Local development

```bash
npm run dev
```

## Building for production

```bash
npm run build
```

## FAQ and Troubleshooting

## How do I configure my Hydrogen session / storefront client / customer account client / cart handler?

See `app/lib/context.ts` and the Hydrogen documentation.

## How do I augment the Remix context?

Add your custom context to the object returned by the `createAppLoadContext` function in
`app/lib/context.ts` and ensure the return type is updated (e.g. `HydrogenContext & {foo: string}`).

### How do I configure a real Shopify store in local dev?

See `.env.example` and
[these Shopify instructions](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/getting-started).

### I get a 500 error on the `/accounts` pages. How do I configure real Shopify customer accounts in local dev?

See [these Shopify instructions](https://shopify.dev/docs/storefronts/headless/building-with-the-customer-account-api/hydrogen).

### Static assets not loading in local dev

If your `.js` and `.css` files are failing to load in local development (with 404 responses), you
may be running into an issue that occurs when `netlify dev` is run after having run a build (via
`netlify build`, `netlify serve`, `npm run build`, or `remix vite:build`). This is a known issue
that Netlify is working on.

To fix this, delete the conflicting built functions before running your dev server:

```bash
rm -rf .netlify/edge-functions*
npm run dev
```

### `shopify hydrogen preview` fails with `Cannot find module '@shopify/mini-oxygen'`

The `shopify hydrogen preview` command has a misleading name. It previews your site in a local
simulation of the Oxygen hosting platform. It therefore isn't compatible with a site intended to be
deployed to Netlify.

Instead, use the [Netlify CLI](https://docs.netlify.com/cli/get-started/) (e.g. `netlify serve`).
