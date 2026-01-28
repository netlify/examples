# SmartMemory

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/netlify/examples&subdirectory=smartmemory)

Persistent conversation memory for AI agents on Netlify. SmartMemory stores conversation history across sessions without managing databases or state.

## Netlify Primitives in Action

- **Netlify Functions** - Serverless API endpoints for session and chat management
- **Environment Variables** - Automatic configuration via Raindrop integration
- **Raindrop SmartMemory** - Persistent conversation memory across sessions
- **Real-time Deployment** - Instant updates with git-based workflow

## How It Works

1. User opens the app, system creates a SmartMemory session automatically
2. User types a message in the chat interface
3. Netlify Function retrieves recent conversation history from SmartMemory
4. Demo responds with context-aware reply (demonstrates memory persistence)
5. Message and response are stored in SmartMemory for future context
6. User can refresh or return later - conversation history is preserved

## Clone and Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/netlify/examples&subdirectory=smartmemory)

Clicking this button will:
1. Clone this example to a new Netlify project
2. Prompt you to add the Raindrop integration (auto-configures environment variables)
3. Deploy your SmartMemory app instantly

## Local Development

### Prerequisites
- Node.js 18+ installed
- Netlify CLI installed (`npm install -g netlify-cli`)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/netlify/examples.git
   cd examples/smartmemory
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Link to your Netlify project:
   ```bash
   netlify link
   ```
   This connects your local environment to the deployed site and pulls environment variables.

4. Run the development server:
   ```bash
   netlify dev
   ```

### Environment Variables

The following are automatically set when you add the Raindrop integration:
- `RAINDROP_API_KEY` - Your Raindrop API authentication key
- `RAINDROP_SMARTMEMORY_NAME` - SmartMemory instance identifier
- `RAINDROP_APPLICATION_NAME` - Application namespace
- `RAINDROP_APPLICATION_VERSION` - Version identifier

No manual configuration needed!

## Tech Stack

- **[Netlify Functions](https://docs.netlify.com/functions/overview/)** - Serverless API endpoints
- **[Raindrop SmartMemory](https://docs.liquidmetal.ai/)** - Persistent conversation memory
- **[@liquidmetal-ai/lm-raindrop](https://www.npmjs.com/package/@liquidmetal-ai/lm-raindrop)** - Raindrop JavaScript SDK
- **Vanilla JavaScript** - Frontend with no framework dependencies

## Project Structure

```
smartmemory/
├── netlify.toml                    # Netlify configuration
├── netlify/functions/
│   ├── create-session.js           # Creates new SmartMemory session
│   └── chat.js                     # Handles chat with memory
└── public/
    ├── index.html                  # Chat UI
    ├── style.css                   # Styling
    └── app.js                      # Client-side logic
```

## More Examples

Check out more examples in the [Netlify examples repository](https://github.com/netlify/examples).
