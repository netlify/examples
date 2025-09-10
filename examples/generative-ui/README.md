[Deploy to Netlify]: https://app.netlify.com/start/deploy?repository=https://github.com/netlify/examples/&create_from_path=examples/generative-ui&utm_campaign=dx-examples

![Netlify Examples](https://github.com/netlify/examples/assets/5865/4145aa2f-b915-404f-af02-deacee24f7bf)

# Netlify Generative UI

A generative UI application powered by [Thesys C1](https://www.thesys.dev) and built with React, Vite, and Netlify Functions. This app demonstrates real-time streaming AI responses with dynamic UI generation.

[Demo](./genui.mp4)

## Features

- **Generative UI**: Dynamic UI components generated based on AI responses
- **Streaming Responses**: Real-time streaming of AI completions
- **React + Vite**: Modern React development with fast builds
- **Netlify Functions**: Serverless backend for API integration
- **Thesys C1 Integration**: Advanced generative UI capabilities

## Prerequisites

Before getting started, you'll need:

1. A [Thesys API key](https://console.thesys.dev/keys) - Sign up at Thesys Console
2. A Netlify account for deployment

## Environment Variables

Create a `.env` file in the root directory with:

```bash
THESYS_API_KEY=your_thesys_api_key_here
```

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install Netlify CLI (if not already installed):**
   ```bash
   npm install -g netlify-cli
   ```

3. **Start the development server:**
   ```bash
   netlify dev
   ```

   This will start both the Vite dev server and Netlify Functions locally.

4. **Open your browser:**
   Navigate to `http://localhost:8888` to see the application.

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Deploy to Netlify

### Option 1: One-Click Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)][Deploy to Netlify]

### Option 2: Manual Deploy

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy using Netlify CLI:
   ```bash
   netlify deploy --prod
   ```

## Project Structure

```
├── src/
│   ├── components/        # React components
│   ├── helpers/          # API and utility functions
│   ├── hooks/            # Custom React hooks
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles
├── netlify/
│   └── functions/        # Netlify Functions
│       └── ask.mts       # AI chat endpoint
├── public/               # Static assets
├── netlify.toml          # Netlify configuration
├── vite.config.ts        # Vite configuration
└── package.json          # Dependencies and scripts
```

## API Endpoints

- `POST /api/ask` - Streaming AI chat endpoint
  - Body: `{ "prompt": string, "previousC1Response"?: string }`
  - Returns: Server-sent events with streaming response

## Technologies Used

- **Frontend**: React 19, Vite, TailwindCSS
- **UI Components**: Thesys GenUI SDK, Crayon
- **Backend**: Netlify Functions
- **AI**: Thesys C1 API
- **Build**: TypeScript, Vite
- **Deployment**: Netlify

## Learn More

- [Thesys C1 Documentation](https://docs.thesys.dev)
- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [Vite Documentation](https://vitejs.dev/)

## More Examples

Explore other examples of using the Netlify platform and primitives in this [examples repo](https://github.com/netlify/examples).
