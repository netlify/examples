[Deploy to Netlify]: https://app.netlify.com/start/deploy?repository=https://github.com/netlify/examples&create_from_path=examples/triple-buzzer&utm_campaign=dx-examples

![Netlify Examples](https://github.com/netlify/examples/assets/5865/4145aa2f-b915-404f-af02-deacee24f7bf)

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

## Clone and Deploy

Deploy your own version by clicking the button below:

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)][Deploy to Netlify]

This will:

1. Clone this example to your GitHub account
2. Create a new site in your Netlify account
3. Build and deploy the site with AI Gateway automatically enabled

Once deployed, the game is immediately functional. Type an answer and watch three AI models race to respond with questions.

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

## API Endpoints

- `/api/openai` - OpenAI serverless function
- `/api/anthropic` - Anthropic serverless function
- `/api/gemini` - Google Gemini serverless function
- `/api/list-models` - Edge function for fetching all available models that the [AI Gateway](https://docs.netlify.com/build/ai-gateway/overview/) supports.

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS 4 + DaisyUI 5
- **Backend**: Netlify Functions (TypeScript)
- **AI**: OpenAI, Anthropic, and Google Gemini via Netlify AI Gateway

## More Examples

Explore other examples in the [Netlify examples repository](https://github.com/netlify/examples).
