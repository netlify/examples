# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Name
Triple Buzzer - A Jeopardy!-style AI game

## Commands

### Development
- **Update Netlify CLI**: `npm i -g netlify-cli@latest` (required for latest features)
- **Install dependencies**: `npm install`
- **Run dev server via Netlify CLI**: `npm run dev` - Starts local development server with serverless functions (default: http://localhost:8888)
- **Type checking**: `npx tsc --noEmit` - Check TypeScript errors without emitting files
- **Lint**: `npm run lint` - Run ESLint on all TypeScript files

### Build & Deployment
- Deploy to Netlify via Git push or Netlify CLI
- Live demo: https://triple-buzzer.netlify.app

## Architecture

### Application Type
A Jeopardy!-style game that compares AI responses from three different models. Users provide an answer, and three AI models respond with questions in parallel.

### Technology Stack
- **Frontend**: React 19 + TypeScript 5.9.2+
- **Build Tool**: Vite 7 with SWC plugin for fast compilation
- **Styling**: Tailwind CSS v4 with `@tailwindcss/vite` plugin + DaisyUI v5
- **Linting**: ESLint 9 with flat config, TypeScript and React Hooks support
- **Backend**: Netlify serverless functions (TypeScript)
- **AI SDKs**:
  - OpenAI SDK (`openai`) - Uses new response API with reasoning minimization
  - Anthropic SDK (`@anthropic-ai/sdk`) - Limited to 16 max tokens for concise responses
  - Google Gemini SDK (`@google/genai`) - Includes thinking budget optimization

### Project Structure
```
/
├── src/
│   ├── components/          # React components
│   │   ├── ChatInput.tsx    # User input field with submit button
│   │   ├── ChatMessages.tsx # Message list container
│   │   ├── Footer.tsx       # App footer with random question button
│   │   ├── SelectProviders.tsx  # Provider selection and model configuration
│   │   └── SingleMessage.tsx    # Individual message display
│   ├── hooks/              # Custom React hooks
│   │   ├── useAvailableModels.ts  # Fetches available models from Netlify AI Gateway
│   │   └── useChat.ts             # Manages chat state and API calls
│   ├── data/               # Data and constants
│   │   └── exampleQuestions.ts    # Sample Jeopardy answers (30 questions)
│   ├── types.ts            # TypeScript type definitions
│   ├── index.css           # Tailwind CSS, DaisyUI config, and custom styles
│   ├── App.tsx             # Main App component
│   ├── main.tsx            # React entry point
│   └── vite-env.d.ts       # Vite type declarations
├── netlify/
│   └── functions/          # Serverless functions
│       ├── openai.ts       # OpenAI API handler
│       ├── anthropic.ts    # Anthropic API handler
│       ├── gemini.ts       # Gemini API handler
│       └── utils/
│           └── common.ts   # Shared validation and constants
├── index.html              # Vite entry HTML
├── vite.config.js          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── eslint.config.js        # ESLint flat config
└── netlify.toml            # Netlify build configuration
```

### Functions Structure

#### Serverless Functions (`netlify/functions/`)
- `openai.ts` - OpenAI endpoint with reasoning minimization for supported models
- `anthropic.ts` - Anthropic endpoint with strict token limits
- `gemini.ts` - Gemini endpoint with thinking budget optimization
- `utils/common.ts` - Shared utilities including:
  - `SYSTEM_PROMPT`: Standardized Jeopardy contestant prompt ("You are a Jeopardy! contestant. Answer very concisely in the form of a question, with no further explanations.")
  - `validate()`: Unified API key and request body validation function

### API Endpoints
All function endpoints are prefixed with `/api`:
- `/api/openai` - OpenAI function
- `/api/anthropic` - Anthropic function
- `/api/gemini` - Gemini function

### Request/Response Format
All AI endpoints require:
- Method: POST
- Body: `{ message: string, model: string }` (both fields required)
- Response: `{ answer: string, details?: object }`

### Frontend Features
React single-page application with:
- **Component-based architecture**: Modular, reusable React components
- **Custom hooks**: `useAvailableModels` for fetching AI models, `useChat` for message handling
- **Type safety**: Full TypeScript coverage with strict mode enabled
- **Dynamic model selection**: Fetches available models directly from Netlify AI Gateway API
- **Provider selection**: Toggle and configure OpenAI, Anthropic, and Gemini via `SelectProviders` component
- **Random examples**: 30 sample Jeopardy answers accessible via 🎲 button in footer
- **Parallel requests**: Sends to all selected providers simultaneously
- **Response timing**: Displays response times in milliseconds
- **Provider-specific styling**: Color-coded gradients for each AI provider
- **DaisyUI components**: Uses DaisyUI for buttons, selects, and layout components
- **Responsive design**: Mobile-friendly layout with DaisyUI's responsive utilities

### Model Selection Logic
- Models fetched dynamically from Netlify AI Gateway via `useAvailableModels` hook
- Default models are defined in `SelectProviders` component
- All three providers enabled by default
- User can toggle providers on/off and select different models per provider
- Model selections persisted in component state
- Provider state managed via `ProviderSettings` interface

### Styling Architecture
- **Tailwind CSS v4**: Uses new `@import "tailwindcss"` syntax in `index.css`
- **DaisyUI v5**: Component library with customized "cupcake" theme configuration
  - Custom color scheme defined in `@plugin "daisyui/theme"` block
  - Custom border radius, sizing, and depth settings
  - Dark mode enabled with `prefersdark: true`
- **Responsive Design**: Uses DaisyUI's responsive utilities and Tailwind breakpoints (lg, etc.)
- **Component Styling**: Leverages DaisyUI classes like `btn`, `select`, `join`, `join-item`

### TypeScript Configuration
- Uses `@tsconfig/vite-react` as base configuration
- Strict mode enabled for maximum type safety
- `skipLibCheck: true` for faster compilation
- Includes `src/` and `netlify/` directories
- Type declarations for CSS modules in `vite-env.d.ts`

### Linting Configuration
- ESLint 9 with flat config format (`eslint.config.js`)
- TypeScript ESLint plugin for TypeScript-specific rules
- React Hooks plugin for hooks best practices
- React Refresh plugin for Vite fast refresh compatibility
- Targets all `.ts` and `.tsx` files
- Ignores `dist/` build output