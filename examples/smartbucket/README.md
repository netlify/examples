# SmartBucket

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/netlify/examples&subdirectory=smartbucket)

Semantic document search on Netlify. SmartBucket automatically chunks, embeds, and indexes documents for natural language retrieval.

## Netlify Primitives in Action

- **Netlify Functions** - Serverless document upload and search endpoints
- **Environment Variables** - Automatic configuration via Raindrop integration
- **Raindrop SmartBucket** - Semantic document search with automatic embeddings
- **Serverless Architecture** - Scalable file processing without infrastructure

## How It Works

1. Drag and drop a document (PDF, TXT, JSON, MD) into the upload zone
2. Click upload - document is automatically chunked and embedded
3. Switch to "Search" tab (wait 1-2 minutes for indexing)
4. Ask natural language questions about your documents
5. SmartBucket returns semantically relevant chunks with relevance scores
6. Results show matched text, source file, and similarity percentage

## Clone and Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/netlify/examples&subdirectory=smartbucket)

Clicking this button will:
1. Clone this example to a new Netlify project
2. Prompt you to add the Raindrop integration (auto-configures environment variables)
3. Deploy your SmartBucket app instantly

## Local Development

### Prerequisites
- Node.js 18+ installed
- Netlify CLI installed (`npm install -g netlify-cli`)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/netlify/examples.git
   cd examples/smartbucket
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
- `RAINDROP_SMARTBUCKET_NAME` - SmartBucket instance identifier

No manual configuration needed!

## Tech Stack

- **[Netlify Functions](https://docs.netlify.com/functions/overview/)** - Serverless API endpoints
- **[Raindrop SmartBucket](https://docs.liquidmetal.ai/)** - Semantic document search
- **[@liquidmetal-ai/lm-raindrop](https://www.npmjs.com/package/@liquidmetal-ai/lm-raindrop)** - Raindrop JavaScript SDK
- **Vector Embeddings** - Automatic document chunking and semantic indexing
- **Vanilla JavaScript** - Frontend with no framework dependencies

## Project Structure

```
smartbucket/
├── netlify.toml                    # Netlify configuration
├── netlify/functions/
│   ├── upload.js                   # Handles document uploads
│   └── search.js                   # Handles semantic search
└── public/
    ├── index.html                  # Tab interface (Upload/Search)
    ├── style.css                   # Styling
    └── app.js                      # Client-side logic
```

## Features

### Upload Interface
- Drag-and-drop file upload
- Click to browse files
- Supported formats: PDF, TXT, JSON, MD
- File size display
- Upload status feedback

### Search Interface
- Natural language queries
- Relevance scores (0-100%)
- Result highlighting
- Source file attribution
- Visual score indicators

## More Examples

Check out more examples in the [Netlify examples repository](https://github.com/netlify/examples).
