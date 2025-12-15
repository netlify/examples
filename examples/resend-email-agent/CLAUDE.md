# Grandma's Recipe Rescuer

A Netlify project that ingests recipe images via email, performs OCR extraction using Gemini, and displays them in a React frontend.

## Project Overview

Users email recipe photos to a Resend inbound address. The system:
1. Receives the email via Resend webhook
2. Downloads attachments using Resend's receiving API
3. Performs OCR with Google Gemini (`gemini-2.5-flash-image` model via `@google/genai` SDK)
4. Stores images and recipe data in Netlify Blobs
5. Displays recipes in a Vite + React frontend

## Tech Stack

- **Runtime**: Netlify Functions (Web API signature)
- **Storage**: Netlify Blobs (stores: `media`, `recipes`, `receipts`)
- **Email**: Resend inbound webhooks with Svix signature verification
- **OCR**: Google Gemini via `@google/genai` SDK (works with Netlify AI Gateway)
- **Frontend**: Vite + React + TypeScript + React Router

## Environment Variables

Configure in Netlify UI (NOT in .env files):

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | Resend API key for fetching inbound email attachments |
| `RESEND_WEBHOOK_SECRET` | Resend webhook signing secret (starts with `whsec_`) |
| `RESEND_INBOUND_ADDRESS` | Your Resend inbound email (e.g., `recipes@inbound.yourdomain.com`) - used to filter webhooks when multiple environments share a Resend account |
| `ADMIN_TOKEN` | Optional token for authenticating recipe edits (leave empty for demo mode) |

## Project Structure

```
.
├── netlify/functions/
│   ├── lib/
│   │   ├── types.ts          # Shared TypeScript types
│   │   └── ocr.ts            # Gemini OCR extraction
│   ├── resend-inbound.mts    # Webhook handler (verifies Svix signature)
│   ├── process-recipe-background.mts  # Background function for processing
│   ├── recipes.mts           # Recipe API (list, detail, override)
│   └── media.mts             # Binary streaming for images
├── src/
│   ├── components/
│   │   └── RecipeEditor.tsx  # Admin editing form
│   ├── lib/
│   │   ├── api.ts            # Frontend API client
│   │   ├── auth.ts           # Admin auth (sessionStorage)
│   │   └── types.ts          # Frontend TypeScript types
│   ├── pages/
│   │   ├── RecipeList.tsx    # Homepage grid
│   │   ├── RecipeDetail.tsx  # Individual recipe view
│   │   └── Admin.tsx         # Hidden login page at /admin
│   ├── App.tsx               # Router + header with sign-out
│   └── main.tsx              # Entry point
├── index.html
├── netlify.toml
├── package.json
├── tsconfig.json             # Functions TypeScript config
├── tsconfig.web.json         # Web app TypeScript config
└── vite.config.ts
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/resend-inbound` | Resend webhook receiver |
| GET | `/api/recipes` | List all recipes (cards) |
| GET | `/api/recipes/:id` | Get recipe detail |
| PUT | `/api/recipes/:id/override` | Save manual edits (auth required) |
| GET | `/api/media?key=...` | Stream binary images from Blobs |

## Key Implementation Details

### Webhook Flow

1. `resend-inbound.mts` receives POST from Resend
2. Verifies Svix signature using `RESEND_WEBHOOK_SECRET`
3. Filters by `RESEND_INBOUND_ADDRESS` (supports multiple environments)
4. Uses `context.waitUntil()` to trigger background processing
5. Background function fetches attachments via `https://api.resend.com/emails/receiving/{id}/attachments`

### Background Functions

Netlify background functions must:
- Have filename ending in `-background` (e.g., `process-recipe-background.mts`)
- Be invoked at `/.netlify/functions/` path (NOT via `/api/` redirect)
- Netlify returns 202 immediately, function runs async

### OCR with Gemini

Uses `@google/genai` SDK with model `gemini-2.5-flash-image`:
```typescript
import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({});
const response = await genAI.models.generateContent({
  model: 'gemini-2.5-flash-image',
  contents: [
    {
      role: 'user',
      parts: [
        { text: prompt },
        { inlineData: { mimeType: contentType, data: base64Image } },
      ],
    },
  ],
});
```

### Admin Authentication

- Hidden login page at `/admin`
- Token stored in `sessionStorage` (clears on browser close)
- Header shows "Sign Out" button when authenticated
- `isAdmin()` helper controls edit button visibility
- Backend validates token via `Authorization: Bearer <token>` header

### Blob Storage Structure

```
media/
  recipes-{email_id}/original/{filename}

recipes/
  recipes-{email_id}/entry.json     # Recipe manifest
  recipes-{email_id}/ocr.txt        # Raw OCR text
  recipes-{email_id}/override.json  # Manual edits (optional)

receipts/
  email-{email_id}                  # Idempotency tracking
```

## Development

```bash
# Install dependencies
npm install

# Start dev server (uses Netlify CLI)
netlify dev

# For external access (e.g., testing webhooks), use Tailscale
# The vite.config.ts has allowedHosts: true configured
```

## Known Patterns & Gotchas

1. **Resend SDK**: The SDK doesn't have `receiving` methods for inbound emails - use direct fetch to `https://api.resend.com/emails/receiving/{id}/attachments`

2. **Background function paths**: Always use `/.netlify/functions/` path, not `/api/` redirect

3. **Vite external access**: `allowedHosts: true` in vite.config.ts allows Tailscale tunnels

4. **Environment filtering**: Set `RESEND_INBOUND_ADDRESS` differently in dev vs prod to prevent cross-environment processing when using same Resend webhook

5. **Privacy**: Sender email addresses are stored but NOT exposed in API responses

6. **OCR tags**: The Gemini prompt emphasizes always including 2-3 relevant tags
