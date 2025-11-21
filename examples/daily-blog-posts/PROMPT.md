# AI-Powered Blog Post Generation System

This prompt instructs you to set up an automated blog post generation system using Netlify Functions, Netlify Blobs, and the Anthropic API. The system sources topics from Wikipedia and generates complete blog posts on a schedule.

---

## Customizable Values

Before implementing, gather or determine these values from the user:

```javascript
// Blog Configuration
const BLOG_CONTEXT = "a blog about random acts of creativity"; // Describe the blog's theme
const TOPIC_SOURCE_URL = "https://wikiroulette.co/"; // URL to fetch random topics
const TOPIC_INSTRUCTIONS = "Use this as inspiration for something creative..."; // What to create from topics

// Scheduling (cron format)
const SOURCE_TOPIC_SCHEDULE = "0 17 * * *"; // When to source new topics (5:00 PM UTC daily)
const CREATE_POST_SCHEDULE = "0 18 * * *"; // When to create posts (6:00 PM UTC daily, 1 hour after sourcing)

// AI Configuration
const AI_MODEL = "claude-haiku-4-5-20251001"; // Model for cost-effective generation
const SOURCE_MAX_TOKENS = 2000; // Max tokens for topic sourcing
const POST_MAX_TOKENS = 4000; // Max tokens for post creation

// Blob Store Names
const TOPICS_STORE = "blog-topics"; // Store for sourced topics
const PENDING_STORE = "pending-topics"; // Queue of topics to process
const COMPLETED_STORE = "completed-posts"; // Store for completed posts

// Hero Image Configuration
const HERO_IMAGE_WIDTH = 1600;
const HERO_IMAGE_HEIGHT = 800;
const HERO_IMAGE_COLORS = ["FFFFCC", "FFB6C1", "B0E0E6", "DDA0DD", "F0E68C", "E0BBE4", "FFDAB9", "C1FFC1"];
```

---

## System Overview

This system consists of **four Netlify Functions**:

### Scheduled Functions (Write Operations)
1. **source-post-topic** - Fetches random Wikipedia articles and generates creative project ideas
2. **create-blog-post** - Converts project ideas into full blog posts with markdown content

### API Endpoint Functions (Read Operations)
3. **list-pending-topics** - Returns all topics waiting to be processed
4. **list-completed-posts** - Returns all generated blog posts

### Data Flow
```
Wikipedia → source-post-topic → blog-topics blob store
                                      ↓
                              pending-topics queue
                                      ↓
                           create-blog-post → completed-posts blob store
```

---

## Implementation Steps

### Step 1: Install Dependencies

Add the following packages to the project:

```bash
npm install @anthropic-ai/sdk @netlify/functions @netlify/blobs
```

Or with yarn:

```bash
yarn add @anthropic-ai/sdk @netlify/functions @netlify/blobs
```

### Step 2: Configure netlify.toml

Create or update `netlify.toml` in the project root:

```toml
[build]
  functions = "netlify/functions"

# Enable scheduled functions
[functions]
  # Scheduled functions need to be explicitly enabled
  # The schedule is defined in each function's config
```

Add the following environment variable to Netlify:
- `ANTHROPIC_API_KEY` - Your Anthropic API key

### Step 3: Create the Shared Library

Create `netlify/functions/lib/writing-guide.mts` with the customizable prompts and writing guidelines.

**Key sections to customize:**
- `BLOG_CONTEXT` - Describe what type of blog this is
- `TOPIC_INSTRUCTIONS` - What kind of content to generate from topics
- `WRITING_GUIDE` - Voice, tone, and style guidelines (customize to match the blog's personality)
- `HERO_IMAGE_CONFIG` - Image placeholder settings
- `generateTopicSourcingPrompt()` - Function that builds the AI prompt for sourcing
- `generateBlogPostPrompt()` - Function that builds the AI prompt for blog post creation

This file should export:
- Constants for blog context and instructions
- Hero image configuration
- Prompt generation functions
- The full writing guide as a string

### Step 4: Create the Scheduled Functions

#### 4.1: Source Topic Function

Create `netlify/functions/source-post-topic.mts`:

**Purpose:** Fetches a random Wikipedia article and generates a creative project idea

**Key responsibilities:**
- Fetch from the topic source URL (e.g., wikiroulette.co)
- Extract article title, URL, and summary
- Send to Anthropic API to generate creative project idea
- Store result in `blog-topics` blob store
- Add to `pending-topics` queue

**Config:**
```typescript
export const config: Config = {
  schedule: "0 17 * * *", // Customize timing
  // path: "/api/source-post-topic", // Uncomment to use as endpoint for testing
};
```

**Output format:**
```json
{
  "title": "Creative project title",
  "description": "Brief description",
  "wikipediaArticle": "URL",
  "materials": ["list", "of", "materials"],
  "steps": ["step1", "step2"]
}
```

#### 4.2: Create Blog Post Function

Create `netlify/functions/create-blog-post.mts`:

**Purpose:** Converts the oldest pending topic into a complete blog post

**Key responsibilities:**
- Get oldest topic from `pending-topics` queue
- Fetch topic data from `blog-topics` store
- Generate current date in "MMM DD YYYY" format
- Send to Anthropic API with writing guidelines
- Store result in `completed-posts` blob store
- Remove from `pending-topics` queue

**Config:**
```typescript
export const config: Config = {
  schedule: "0 18 * * *", // Run 1 hour after topic sourcing
  // path: "/api/create-blog-post", // Uncomment to use as endpoint for testing
};
```

**Output format:**
```json
{
  "title": "Blog post title",
  "description": "SEO-friendly description",
  "pubDate": "Nov 21 2025",
  "heroImage": "https://placehold.co/1600x800/BGCOLOR/333333?font=Lora&text=Title",
  "body": "Full markdown content with headings, paragraphs, etc."
}
```

**Important:** Schedule this to run at least 1 hour after the topic sourcing function to ensure topics are available to process.

### Step 5: Create the API Endpoint Functions

#### 5.1: List Pending Topics

Create `netlify/functions/list-pending-topics.mts`:

**Purpose:** API endpoint to view all topics waiting to be processed

**Config:**
```typescript
export const config: Config = {
  path: "/api/list-pending-topics",
};
```

**Response:**
```json
{
  "topics": [
    {
      "blobKey": "1234567890.json",
      "title": "...",
      "description": "...",
      "wikipediaArticle": "...",
      "materials": [...],
      "steps": [...]
    }
  ]
}
```

#### 5.2: List Completed Posts

Create `netlify/functions/list-completed-posts.mts`:

**Purpose:** API endpoint to view all generated blog posts

**Config:**
```typescript
export const config: Config = {
  path: "/api/list-completed-posts",
};
```

**Response:**
```json
{
  "posts": [
    {
      "blobKey": "1234567890.json",
      "title": "...",
      "description": "...",
      "pubDate": "...",
      "heroImage": "...",
      "body": "..."
    }
  ]
}
```

---

## Code Patterns

### Anthropic API Integration

```typescript
const client = new Anthropic({
  apiKey: process.env["ANTHROPIC_API_KEY"],
});

const response = await client.messages.create({
  model: "claude-haiku-4-5-20251001",
  messages: [{ role: "user", content: PROMPT }],
  max_tokens: 2000,
});

const textContent = response.content.find((block) => block.type === "text");
const result = textContent ? textContent.text : "";
```

### JSON Parsing with Safety Net

```typescript
// Strip markdown code blocks that AI might add
const cleanedResult = result
  .replace(/^```json\s*/i, "")
  .replace(/^```\s*/, "")
  .replace(/```\s*$/, "")
  .trim();

// Parse and validate
try {
  const parsed = JSON.parse(cleanedResult);
  // Use parsed data
} catch (error) {
  return new Response(
    JSON.stringify({ error: "Failed to parse AI response as JSON" }),
    { status: 500, headers: { "Content-Type": "application/json" } }
  );
}
```

### Netlify Blobs Usage

```typescript
import { getStore } from "@netlify/blobs";

// Set data
const store = getStore("store-name");
await store.set("key.json", JSON.stringify(data));

// Get data
const data = await store.get("key.json", { type: "json" });

// List all blobs
const { blobs } = await store.list();
for (const blob of blobs) {
  const data = await store.get(blob.key, { type: "json" });
}
```

### Queue Management Pattern

```typescript
// Add to queue
const pendingStore = getStore("pending-topics");
const pendingList = (await pendingStore.get("list", { type: "json" })) || [];
pendingList.push(newItem);
await pendingStore.set("list", JSON.stringify(pendingList));

// Remove from queue (FIFO)
const oldestItem = pendingList[0];
const updatedList = pendingList.slice(1);
await pendingStore.set("list", JSON.stringify(updatedList));
```

---

## Testing

### Testing Scheduled Functions as Endpoints

For development/testing, you can temporarily switch scheduled functions to endpoints:

```typescript
// In source-post-topic.mts or create-blog-post.mts
export const config: Config = {
  // schedule: "0 17 * * *", // Comment out
  path: "/api/function-name", // Uncomment
};
```

Then test with:
```bash
curl https://your-site.netlify.app/api/source-post-topic
curl https://your-site.netlify.app/api/create-blog-post
```

### Viewing Data

Access the endpoint functions to inspect what's in the system:
```bash
curl https://your-site.netlify.app/api/list-pending-topics
curl https://your-site.netlify.app/api/list-completed-posts
```

---

## Customization Guide

### Changing the Topic Source

Replace the `fetchRandomWikipediaTopic()` function in `source-post-topic.mts` to fetch from a different source:

```typescript
async function fetchTopicFromCustomSource() {
  // Your custom logic here
  return { title: "...", url: "...", summary: "..." };
}
```

### Modifying the Prompts

Edit `netlify/functions/lib/writing-guide.mts`:

1. **BLOG_CONTEXT** - Change to match your blog's theme
2. **TOPIC_INSTRUCTIONS** - Modify what you want the AI to create
3. **WRITING_GUIDE** - Customize voice, tone, structure, and style
4. **HERO_IMAGE_CONFIG** - Change dimensions, colors, or font

### Adjusting the Schedule

Modify the cron expressions in the function configs:

- `"0 17 * * *"` = Daily at 5:00 PM UTC
- `"0 */6 * * *"` = Every 6 hours
- `"0 9 * * 1"` = Every Monday at 9:00 AM UTC

Use [crontab.guru](https://crontab.guru) for help with cron syntax.

### Changing AI Model

In the functions, update the `model` constant:
- `claude-haiku-4-5-20251001` - Fast and cost-effective
- `claude-sonnet-4-5-20250929` - More capable, higher cost
- `claude-opus-4-20250514` - Most capable, highest cost

---

## Error Handling

Each function should handle common errors:

1. **Missing API Key** - Check for `ANTHROPIC_API_KEY` environment variable
2. **Empty Queue** - Return graceful message when no topics to process
3. **JSON Parse Errors** - Handle when AI doesn't return valid JSON
4. **Blob Store Errors** - Gracefully handle when stores are unavailable

---

## Integration with Frontend

Once posts are in the `completed-posts` blob store, you can:

1. **Manual Integration** - Fetch posts via `/api/list-completed-posts` and copy to your CMS
2. **Automated Integration** - Create another function that automatically creates files in your repo
3. **Dynamic Rendering** - Merge blob posts with static content at build/render time

Example for Astro (create `src/lib/get-all-posts.ts`):
```typescript
import { getCollection } from "astro:content";
import { getStore } from "@netlify/blobs";

export async function getAllPosts() {
  const staticPosts = await getCollection("blog");

  const completedStore = getStore("completed-posts");
  const { blobs } = await completedStore.list();

  const dynamicPosts = await Promise.all(
    blobs.map(async (blob) => {
      const data = await completedStore.get(blob.key, { type: "json" });
      return {
        id: blob.key.replace('.json', ''),
        data: {
          title: data.title,
          description: data.description,
          pubDate: new Date(data.pubDate),
          heroImage: data.heroImage,
        },
        body: data.body,
      };
    })
  );

  return [...staticPosts, ...dynamicPosts].sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
}
```

---

## Security Considerations

1. **API Key Protection** - Never commit `ANTHROPIC_API_KEY` to the repository
2. **Rate Limiting** - Consider adding rate limiting to endpoint functions
3. **Input Validation** - Validate all data before storing in blob stores
4. **Cost Control** - Monitor Anthropic API usage and set up billing alerts

---

## Deployment

1. Deploy to Netlify (push to connected Git repository)
2. Add `ANTHROPIC_API_KEY` environment variable in Netlify dashboard
3. Scheduled functions will automatically run on their schedule
4. Monitor function logs in Netlify dashboard

---

## Summary

This system provides automated blog post generation using:
- **Netlify Scheduled Functions** for automated topic sourcing and post creation
- **Netlify Blobs** for storing topics, queue management, and completed posts
- **Anthropic API** for AI-powered content generation
- **API Endpoints** for monitoring and integration

The system is framework-agnostic and relies only on Netlify primitives, making it portable to any web framework deployed on Netlify.
