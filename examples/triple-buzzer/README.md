# Triple Buzzer

A Jeopardy!-like game that compares AI responses from multiple models. Give it an answer, and three different AI models will respond with questions.

**Live demo:** <https://triple-buzzer.netlify.app>

## Features

- Compare responses from OpenAI, Anthropic (Claude), and Google Gemini.
- Select different models for each backend.
- Random example questions button (🎲) for quick testing.
- See response times for each AI.
- Dynamic model fetching from Netlify AI Gateway.
- Netlify serverless and edge functions.

You can either deploy this project to Netlify through the UI, or run locally on the command-line.

## Deploying to Netlify

All you need is a Netlify account that has an up-to-date plan (Free, Personal, or Pro). 

These plans come with out-of-the-box access to leading models through the [AI Gateway](https://docs.netlify.com/build/ai-gateway/overview/), billed using [credits](https://docs.netlify.com/manage/accounts-and-billing/billing/overview/#credit-based-plans). Meaning, no need to setup accounts with AI providers, import API keys, etc.

To check if your existing account is on a legacy plan, [see here.](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-legacy-plans/billing-faq-for-legacy-plans/#do-i-have-a-legacy-plan)

With an up-to-date plan, click to deploy:

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/netlify-templates/triple-buzzer)

### Running locally

Running locally is possible via the Netlify CLI, again without setting any AI provider keys.

#### Setup

1. First, ensure you have an up-to-date Netlify plan (see above). 

2. Make sure you have an up-to-date version of the Netlify CLI:

```
npm i -g netlify-cli@latest
```

If you've never used the CLI before, authenticate:

```
netlify login
```

3. Clone this repository and install dependencies:

```
git clone git@github.com:netlify-templates/triple-buzzer.git
cd triple-buzzer
npm install
```

4. Create a new Netlify project for your code:

```
netlify init
```

For simplicity, you can skip GitHub repository creation for now.

Now that the CLI knows which Netlify project is associated with your code, you can run the site in dev mode with auto-injected keys for AI providers via the gateway:

#### Running the site

Run `npm run dev`.

This starts `netlify dev`, which wraps the Vite dev server.

The browser should automatically open up showing your local dev server at `http://localhost:8888`.

### Troubleshooting

If you get errors trying to send your prompts, please make sure again that:
* You have a credits-based plan on Netlify
* That you have run `netlify init` to create a Netlify project for your code.

## API Endpoints

- `/api/openai` - OpenAI serverless function
- `/api/anthropic` - Anthropic serverless function
- `/api/gemini` - Google Gemini serverless function
- `/api/list-models` - Edge function for fetching all available models that the [AI Gateway](https://docs.netlify.com/build/ai-gateway/overview/) supports. 

Built with Vite, TypeScript, React, Tailwind and daisyUI.
