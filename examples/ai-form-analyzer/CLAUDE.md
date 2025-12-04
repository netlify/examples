# Claude Context: Netlify AI Forms

## Project Overview

This is a meeting request form application for "Synergy Supreme," a satirical consulting firm. The project demonstrates:
- Form submission with Netlify Functions
- Netlify Blobs for data storage
- Netlify Forms integration (for built-in form management)
- AI-powered analysis using Claude Haiku (with spam detection and reasoning)
- Background processing with retry functionality
- React SPA with client-side routing
- Form validation (24-hour minimum meeting time)
- Clean UI with Lucide React icons

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite + React Router + Tailwind CSS 4 + Lucide React (icons)
- **Backend**: Netlify Functions (modern format with default exports, .mts files)
- **Storage**: Netlify Blobs
- **AI**: Anthropic SDK (@anthropic-ai/sdk) with Claude Haiku 4.5 (claude-haiku-4-5-20251001)
- **Deployment**: Netlify

## Environment Variables

Required in `.env` file:
```
ANTHROPIC_API_KEY=your_api_key_here
```

## Project Structure

### Key Files

**Frontend:**
- `src/App.tsx` - Router setup (/, /submissions, /submissions/:key)
- `src/pages/Home.tsx` - Meeting request form (main landing page)
- `src/pages/Submissions.tsx` - List view with pagination (12 per page)
- `src/pages/SubmissionDetail.tsx` - Individual submission details with AI analysis
- `public/_redirects` - SPA fallback for client-side routing
- `public/__forms.html` - Static form for Netlify Forms detection (not user-facing)

**Backend Functions (netlify/functions/):**
- `new-meeting-request.mts` - Handles form submission, stores in blob, triggers analysis
- `analyze-submission-background.mts` - Background AI analysis (spam detection + summary)
- `submissions.mts` - Lists submissions with pagination
- `submission.mts` - Gets single submission by key
- `retry-analysis.mts` - Resets and retriggers analysis
- `test.mts` - Test endpoint to verify functions work

**Config:**
- `netlify.toml` - Build config and functions directory
- `.env.example` - Template for environment variables
- `TESTING.md` - Comprehensive testing documentation

## API Endpoints (Path-Based, Not Query Strings)

All endpoints use path parameters instead of query strings:

- `POST /api/new-meeting-request` - Submit new meeting request
- `POST /api/analyze-submission-background` - Background analysis (triggered automatically)
- `POST /api/retry-analysis` - Retry/start analysis (body: `{ key: "blob-key" }`)
- `GET /api/submissions` - List submissions page 1
- `GET /api/submissions/page/:page` - List submissions with pagination
- `GET /api/submission/:key` - Get single submission
- `GET /api/test` - Test endpoint

**Important:** Path parameters are accessed via `context.params` in functions, NOT query strings.

## Data Flow

### 1. Form Submission
```
User submits form → new-meeting-request function →
  - Generates blob key: {timestamp}-{kebab-case-name}
  - Stores in Netlify Blobs with analysisState: "pending"
  - Fire-and-forget POST to Netlify Forms (form-urlencoded to site origin)
  - Fire-and-forget fetch to analyze-submission-background
  - Returns success immediately
```

### 2. Background Analysis
```
analyze-submission-background receives key →
  - Sets state to "analyzing"
  - Calls Claude Haiku with spam detection prompt
  - Extracts JSON from response (handles markdown fences and extra text)
  - If spam: sets state to "spam", saves spamReasoning
  - If legitimate: generates summary + recommendation, sets state to "completed"
  - If error: sets state to "error" with error message
  - Updates blob with results
```

### 3. Viewing Submissions
- List view shows 12 at a time, most recent first (sorted by timestamp in key)
- Detail view shows full data + AI analysis results
- Real-time state visible via color-coded badges

## Data Model

### Submission Interface (stored in Netlify Blobs)
```typescript
interface SubmissionData {
  key: string;                    // e.g., "1733158920123-john-doe"
  name: string;
  company: string;
  email: string;
  preferredTime: string;          // ISO datetime (must be 24+ hours in future)
  notes: string;                  // Main content for AI analysis
  submittedAt: string;            // ISO timestamp

  // Analysis fields
  analysisState: "pending" | "analyzing" | "completed" | "spam" | "error";
  isSpam?: boolean;
  summary?: string;               // AI-generated summary (if not spam)
  recommendation?: string;        // AI meeting value assessment (if not spam)
  analysisError?: string;         // Error message (if state === "error")
  spamReasoning?: string;         // Explanation of why flagged as spam (if spam)
}
```

## Analysis States & Recovery

The system handles analysis failures/stuck states comprehensively:

**States:**
- `pending` - Waiting for analysis (may never have started)
- `analyzing` - Analysis in progress (could be stuck)
- `completed` - Successfully analyzed
- `spam` - Flagged as spam (includes reasoning for admin review)
- `error` - Analysis failed with error

**Retry/Start Buttons:**
- ✅ Available on **all non-completed states** (pending, analyzing, error)
- Submissions list: Icon + "Retry" label with contextual tooltip
- Detail page: Full-width button with clear labels
- Retry always: resets to "pending" → clears old data (including spamReasoning) → retriggers analysis

**Spam Reasoning:**
- When submissions are flagged as spam, the AI provides reasoning
- Displayed in detail view and preview in list view
- Allows admins to review and verify spam detection accuracy

## Important Implementation Details

### Netlify Forms Integration

Since this is a JavaScript-rendered SPA, Netlify Forms requires a static HTML form for build-time detection:

**Static Form (`public/__forms.html`):**
```html
<form name="meeting-request" data-netlify="true" hidden>
  <input type="text" name="name" />
  <input type="text" name="company" />
  <input type="email" name="email" />
  <input type="datetime-local" name="preferredTime" />
  <textarea name="notes"></textarea>
</form>
```

**Server-side submission (in `new-meeting-request.mts`):**
```typescript
// Submit to Netlify Forms (fire and forget)
const formBody = new URLSearchParams({
  "form-name": "meeting-request",
  name: data.name,
  company: data.company,
  email: data.email,
  preferredTime: data.preferredTime,
  notes: data.notes,
});

fetch(url.origin, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: formBody.toString(),
}).catch((error) => {
  console.error("Failed to submit to Netlify Forms:", error);
});
```

**Key points:**
- The `form-name` field must match the `name` attribute in `__forms.html`
- POST goes to site origin with `application/x-www-form-urlencoded` content type
- Submissions appear in Netlify dashboard under Forms (must enable form detection in UI)
- This is independent of Blobs storage - provides built-in Netlify form management

### Netlify Functions Format
**Use modern format (2025+), NOT legacy:**
```typescript
import type { Config, Context } from "@netlify/functions";

export default async (request: Request, context: Context) => {
  // Use Request/Response objects, not event/context
  return Response.json({ data });
};

export const config: Config = {
  path: "/api/endpoint/:param"  // Path parameters supported
};
```

### Background Tasks with waitUntil
**Critical:** In serverless functions, the runtime terminates when the response is sent. Fire-and-forget `fetch()` calls will be killed before they execute. Use `context.waitUntil()` to keep the function alive:

```typescript
export default async (request: Request, context: Context) => {
  // Capture the promise
  const backgroundTask = fetch(someUrl, { method: "POST", ... })
    .then((res) => console.log("Background task completed:", res.status))
    .catch((err) => console.error("Background task failed:", err));

  // Keep function alive until background task completes
  context.waitUntil(backgroundTask);

  // Response returns immediately, but runtime stays alive
  return Response.json({ message: "Success" });
};
```

**Key points:**
- `waitUntil()` extends the function's lifetime after the response is sent
- The user gets an immediate response while background work continues
- Always use this for fire-and-forget operations (triggering other functions, sending to external APIs)
- Can pass `Promise.all([...])` for multiple background tasks

### Path Parameters
```typescript
// Extract from context.params, NOT url.searchParams
const key = context.params?.key;
const page = context.params?.page;
```

### Blob Key Generation
```typescript
function generateBlobKey(name: string): string {
  const timestamp = Date.now();
  const kebabName = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${timestamp}-${kebabName}`;
}
```

### Error Handling in Background Function
**Critical:** Cache the key before parsing body to avoid "body already read" error:
```typescript
let requestKey: string | null = null;

try {
  const { key } = await request.json();
  requestKey = key; // Cache for error handler
  // ... rest of function
} catch (error) {
  // Use requestKey, NOT await request.json() again
  if (requestKey) {
    // update blob with error
  }
}
```

### AI Analysis Response Format
The AI prompt expects this JSON structure:
```json
{
  "isSpam": boolean,
  "summary": "Brief 1-2 sentence summary (if not spam)",
  "recommendation": "Meeting value assessment (if not spam)",
  "spamReasoning": "Explanation of why flagged as spam (if spam)"
}
```

### Parsing Claude API Responses
**Critical:** Claude API may return JSON wrapped in markdown code fences or followed by explanatory text. Use the `extractJSON` helper:
```typescript
function extractJSON(text: string): string {
  // Strip markdown code fences
  let cleaned = text
    .replace(/^```(?:json)?\s*\n/i, '')
    .replace(/\n```\s*$/, '')
    .trim();

  // Find the JSON object (from first { to its matching })
  const startIndex = cleaned.indexOf('{');
  if (startIndex === -1) return cleaned;

  let braceCount = 0;
  let endIndex = -1;

  for (let i = startIndex; i < cleaned.length; i++) {
    if (cleaned[i] === '{') braceCount++;
    if (cleaned[i] === '}') braceCount--;
    if (braceCount === 0) {
      endIndex = i;
      break;
    }
  }

  return cleaned.substring(startIndex, endIndex + 1);
}

// Usage:
const jsonOnly = extractJSON(responseText);
const analysis = JSON.parse(jsonOnly);
```

This handles responses like:
```
```json
{ "isSpam": true }
```

**Reasoning:** Extra explanatory text here
```

### Form Validation: 24-Hour Meeting Time Rule
**Browser-level validation:**
```typescript
// Calculate min datetime dynamically
const minDateTime = useMemo(() => {
  const now = new Date();
  now.setHours(now.getHours() + 24);
  return now.toISOString().slice(0, 16); // Format for datetime-local
}, []);

// Apply to input
<input type="datetime-local" min={minDateTime} />
```

**Server-side validation:**
```typescript
const preferredTime = new Date(data.preferredTime);
const now = new Date();
const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

if (preferredTime < twentyFourHoursFromNow) {
  return Response.json(
    { message: "Preferred meeting time must be at least 24 hours in the future" },
    { status: 400 }
  );
}
```

**Helper text on form:**
"Preferred meeting time (must be at least 24 hours in the future)"

## Design Decisions

### Why Path Parameters?
Cleaner RESTful URLs, easier to read, more semantic than query strings.

### Why Netlify Blobs?
Simple key-value storage for demo, no database setup needed, built into Netlify.

### Why Claude Haiku?
Cost-effective model for simple spam detection and summarization tasks.

### Why Background Functions?
Form submission returns immediately (better UX), analysis happens asynchronously.

### Why "Synergy Supreme"?
Satirical company theme makes the demo more fun and memorable. Services include "Paradigm Shifting", "Thought Leadership As A Service", etc.

## UI/Design Notes

- **No rounded corners** - All elements use sharp edges
- **Black accent bar** at top (2px tall, full width)
- **Split screen**: Form left, gradient testimonial right (amber → rose → purple)
- **Color-coded badges with icons** (using Lucide React):
  - Gray (pending) with Clock icon
  - Blue (analyzing) with Loader2 icon (animated spin)
  - Green (completed) with CheckCircle2 icon
  - Red (spam) with XCircle icon
  - Yellow (error) with AlertTriangle icon
- **Submission list cards** display (compact layout):
  - Name (large, top left)
  - Status badge + Retry button (top right, in line with name)
  - Company (below name)
  - Summary or spam reasoning (preview, 3 lines max)
  - **Removed**: Email and submission date for cleaner look
- **Retry buttons**: Icon (RotateCcw) + "Retry" label
- **Clean forms**: Bottom borders only, no boxes
- **Typography**: Simple, semantic HTML, no emojis unless requested

## Testing

### Test Success
Use any email EXCEPT `*@test-error.com`

### Test Error
Use email ending with `@test-error.com` to trigger simulated error

### Test Spam Detection
Submit with obvious spam content (promotional language, suspicious domains, etc.) to see spam reasoning in action

### Test Meeting Time Validation
- Browser validation: Try selecting a date/time less than 24 hours away (browser will prevent)
- Server validation: Bypassing browser check returns 400 error with clear message

### Test Endpoint
Visit `/api/test` to verify functions are running

### Common Issues
1. **API Key Error**: Make sure `ANTHROPIC_API_KEY` is set in `.env` and restart `netlify dev`
2. **Analysis Stuck**: Use retry button on any non-completed state
3. **Old Submissions**: May not have `analysisState` or `spamReasoning`, UI handles gracefully with fallbacks
4. **Meeting Time Error**: Ensure selected time is at least 24 hours from current time

## Running the Project

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Add your ANTHROPIC_API_KEY

# Run dev server (requires Netlify CLI)
netlify dev
```

## Future Considerations

- Consider adding timestamps to track when analysis started/completed
- Could add webhook/polling for real-time status updates instead of manual refresh
- Consider timeout detection (if analyzing state > X minutes, auto-flag as error)
- Could add bulk retry for all stuck submissions
- Consider storing analysis cost/token usage for monitoring

## Breaking Changes to Avoid

- Don't change blob key format (timestamp-name) - affects sorting
- Don't remove analysisState or spamReasoning fields - UI depends on them
- Don't remove the extractJSON helper from background function - Claude API needs it
- Don't change the 24-hour validation rule without updating both browser and server
- Don't change function paths without updating frontend
- Don't change to query strings - path parameters are intentional
- Don't add rounded corners - sharp edges are intentional design choice
- Don't remove Lucide icons - they're part of the status badge design
- Don't change form field names without updating `__forms.html`, `Home.tsx`, and `new-meeting-request.mts`
- Don't rename the Netlify form ("meeting-request") without updating both `__forms.html` and the function
- Don't remove `context.waitUntil()` from functions that trigger background tasks - they will silently fail
