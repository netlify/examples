[Deploy to Netlify]: https://app.netlify.com/start/deploy?repository=https://github.com/netlify/examples&create_from_path=examples/prerender-extension&utm_campaign=dx-examples

![Netlify Examples](https://github.com/netlify/examples/assets/5865/4145aa2f-b915-404f-af02-deacee24f7bf)

# Prerender Extension Demo

This example demonstrates how the [Netlify Prerender Extension](https://app.netlify.com/extensions/prerender) makes single-page application (SPA) content accessible to web crawlers, social media previews, and AI/LLM tools.

## The Problem with SPAs

Single-page applications render content entirely in the browser using JavaScript. While this creates a smooth user experience, it causes problems for:

- **Search engines** that may not execute JavaScript
- **Social media previews** that need static meta tags
- **AI assistants and LLMs** with web browsing capabilities that cannot read JavaScript-rendered content

This demo site is a React SPA about birds of Costa Rica. Without prerendering, tools that fetch and parse HTML won't see any of the actual bird content.

## Clone and Deploy

Deploy your own version of this example site by clicking the button below:

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)][Deploy to Netlify]

This will:

1. Clone a copy of this example to your GitHub account
2. Create a new site in your Netlify account linked to the repo
3. Build and deploy the site

## See the Prerender Extension in Action

Follow these steps to see how the extension transforms your SPA:

### Step 1: Test Without Prerendering

After your site deploys, open an AI assistant with web browsing capabilities (like ChatGPT, Claude, or Perplexity) and ask it to summarize a bird detail page:

> Summarize the content on this page: https://YOUR-SITE-NAME.netlify.app/birds/resplendent-quetzal

The AI will likely respond that it cannot access the content, or will only see the basic HTML shell without any bird information. This is because the content is rendered client-side with JavaScript.

### Step 2: Enable the Prerender Extension

1. Go to [Netlify Extensions](https://app.netlify.com/extensions/prerender) and install the Prerender extension
2. Enable the extension for your site

### Step 3: Trigger a Redeploy

The extension takes effect on the next deploy. The easiest way to trigger a redeploy:

1. Go to your GitHub repository
2. Open one of the bird content files (e.g., `src/content/resplendent-quetzal.md`)
3. Make a small edit (add a space or tweak some text)
4. Commit the change to the `main` branch

This will trigger a new deploy with prerendering enabled.

### Step 4: Test With Prerendering

Once the deploy completes, ask the same question to your AI assistant:

> Summarize the content on this page: https://YOUR-SITE-NAME.netlify.app/birds/resplendent-quetzal

Now the AI should be able to read and summarize the full content about the Resplendent Quetzal, including details about its habitat, diet, conservation status, and more.

## How It Works

The Prerender Extension automatically generates static HTML for your pages at the edge. When a bot or crawler requests a page, they receive pre-rendered HTML with all the content visible. Regular users still get the full SPA experience.

## Local Development

```bash
npm install
npm run dev
```

## More Examples

Explore other examples in the [Netlify examples repository](https://github.com/netlify/examples).
