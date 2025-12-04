[Deploy to Netlify]: https://app.netlify.com/start/deploy?repository=https://github.com/netlify/examples&create_from_path=examples/ai-form-analyzer&utm_campaign=dx-examples

![Netlify Examples](https://github.com/netlify/examples/assets/5865/4145aa2f-b915-404f-af02-deacee24f7bf)

# AI Form Analyzer

This example demonstrates how to build an AI-powered form submission analyzer using Netlify's platform primitives. Deploy it to your Netlify account and immediately have an AI agent analyzing your form submissions—no LLM provider account required.

## Netlify Primitives in Action

This project showcases several Netlify primitives working together:

- **[AI Gateway](https://docs.netlify.com/build/ai-gateway/overview/)**: Provides instant access to Claude AI without managing API keys or provider accounts. Netlify automatically injects the required environment variables.
- **[Netlify Functions](https://docs.netlify.com/functions/overview/)**: Serverless functions handle form submissions and serve API endpoints.
- **[Background Functions](https://docs.netlify.com/functions/background-functions/)**: Long-running functions process AI analysis asynchronously, returning responses to users immediately.
- **[Netlify Blobs](https://docs.netlify.com/blobs/overview/)**: Key-value storage persists submissions and their analysis results.
- **[Netlify Forms](https://docs.netlify.com/manage/forms/setup/)**: Built-in form management provides a dashboard view of all submissions.

## How It Works

1. **User submits a meeting request** through the React frontend
2. **Netlify Function** receives the submission and stores it in Blobs
3. **Background function** triggers AI analysis using Claude (via AI Gateway)
4. **Claude analyzes** the submission for spam detection and generates a summary
5. **Results are stored** in Blobs and displayed in the submissions dashboard

The AI performs spam detection with reasoning, generates summaries of legitimate requests, and provides recommendations on meeting value—all without you needing an Anthropic account.

## Clone and Deploy

Deploy your own version by clicking the button below:

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)][Deploy to Netlify]

This will:

1. Clone this example to your GitHub account
2. Create a new site in your Netlify account
3. Build and deploy the site with AI Gateway automatically enabled

Once deployed, the AI form analyzer is immediately functional. Submit a meeting request and watch the AI analyze it in real-time.

## Local Development

AI Gateway requires a production project before it works locally. After deploying with the button above:

```bash
# Clone YOUR newly created repo (not netlify/examples)
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME
cd YOUR_REPO_NAME

# Install dependencies
npm install

# Link to your Netlify site
netlify link

# Start the dev server
netlify dev
```

The `netlify link` command connects your local environment to the deployed site, enabling AI Gateway access.

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS 4
- **Backend**: Netlify Functions (modern `.mts` format)
- **Storage**: Netlify Blobs
- **AI**: Claude Haiku via Netlify AI Gateway

## More Examples

Explore other examples in the [Netlify examples repository](https://github.com/netlify/examples).
