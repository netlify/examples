# AI Chat App

A simple AI chat application built with Astro, React, and OpenAI, deployed on Netlify.

## Features

- Real-time chat interface
- Streaming responses from OpenAI's GPT-3.5 Turbo
- Modern, responsive design
- Serverless architecture using Netlify Functions

## Prerequisites

- Node.js (v18 or later)
- npm
- OpenAI API key
- Netlify account (for deployment)

## Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd kaibanjs-ai-chat
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

## Development

To run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:4321`.

## Deployment

1. Push your code to GitHub

2. Connect your repository to Netlify

3. Configure the environment variable in Netlify:

   - Add `OPENAI_API_KEY` in your Netlify environment variables

4. Deploy! Netlify will automatically build and deploy your application.

## License

MIT
