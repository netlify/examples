# AI-Powered Blog Post Generation System

**IMPORTANT: Before submitting this prompt to an agent, customize the values in the "Customizable Values" section below. The agent will execute this entire prompt asynchronously in one run without interactive feedback.**

---

## Customizable Values

**⚠️ EDIT THESE VALUES BEFORE SUBMITTING THIS PROMPT:**

```javascript
// Blog Configuration
const BLOG_CONTEXT = "a blog about random acts of creativity"; // Describe the blog's theme
const TOPIC_SOURCE_URL = "https://wikiroulette.co/"; // URL to fetch random topics
const TOPIC_INSTRUCTIONS = "Use this as inspiration for something creative that someone can make at home. It could be a craft, a recipe, a DIY project, an experiment, or anything else that involves making something."; // What to create from topics

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

// Writing Guide (Customize the voice, tone, and style for your blog)
const WRITING_GUIDE = `# Writing Guide

This guide defines the voice, tone, and style for blog posts on this site.

## Voice & Tone

**Whimsical and Playful**
- Embrace imagination and creativity in every sentence
- Use playful language and vivid descriptions
- Don't take things too seriously - have fun with the content

**Conversational and Friendly**
- Write as if talking to a friend over coffee
- Use inclusive language: "we", "our", "join us"
- Address readers directly with warm, inviting phrases

**Encouraging and Enthusiastic**
- Celebrate the joy of creating
- Focus on the experience, not perfection
- Acknowledge challenges with humor and persistence
- Inspire readers to try projects themselves

**Light-hearted**
- Include gentle humor and wit
- Embrace the quirky and unexpected
- Find delight in small details

## Structure

Blog posts should follow this general structure:

1. **Engaging Introduction**
   - Tell a story or set the scene
   - Explain the inspiration behind the project
   - Hook readers with personality and charm

2. **Main Content Sections**
   - Use descriptive subheadings (#### format in markdown)
   - Break content into logical stages or themes
   - Include planning, process, and finishing touches
   - 3-5 sections work well

3. **Compelling Conclusion**
   - Tie everything together
   - Paint a picture of the final result
   - Encourage readers to embark on their own creative journey
   - Optional: Include a tagline that reinforces the site's mission

## Language Style

**Descriptive and Vivid**
- Use colorful adjectives: gargantuan, luscious, enchanted, cozy
- Paint pictures with words
- Engage the senses

**Personal and Story-Driven**
- Share anecdotes and observations
- Describe the creative journey, including mishaps
- Make projects feel accessible and relatable

**Celebrate Imperfection**
- Acknowledge when things don't go as planned
- Show that creativity involves trial and error
- Use phrases like "a learning experience" or "through persistence and laughter"

## Content Approach

**Focus on Experience Over Instructions**
- This isn't a step-by-step tutorial blog
- Emphasize the joy and wonder of creating
- Instructions should be woven into the narrative
- Less technical, more inspirational

**Make Projects Approachable**
- Use everyday materials when possible
- Projects should feel doable, not intimidating
- Encourage improvisation and personal touches

**Embrace Fantasy and Whimsy**
- Give projects personality (name them!)
- Imagine magical outcomes
- Reference folklore, fairy tales, and wonder

## Examples of Great Phrases

- "In the world of whimsical creativity, inspiration often strikes when we least expect it"
- "Thus began our latest creative escapade"
- "The transformation was nothing short of magical"
- "Where creativity turns the ordinary into the extraordinary"
- "This is architecture at its finest!"
- "Let the cozy vibes commence"

## What to Avoid

- Overly technical language
- Boring, clinical instructions
- Perfectionism or intimidating standards
- Generic or corporate tone
- Long lists without narrative context
`;
```

**After customizing these values, submit this entire prompt (including all sections below) to the agent.**

---

## Instructions for the Agent

You are tasked with implementing an automated blog post generation system using the customized values provided above. Execute all steps below in a single run without requesting additional input.

## System Overview

You will create **four Netlify Functions**:

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

Execute these steps in order to set up the complete system.

### Step 1: Install Dependencies

Install the required packages:

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

Create `netlify/functions/lib/writing-guide.mts` using the customized values from the top of this prompt.

**Use these values from the customization section:**
- `BLOG_CONTEXT` → Export as constant
- `TOPIC_INSTRUCTIONS` → Export as constant
- `WRITING_GUIDE` → Export as constant string
- `HERO_IMAGE_WIDTH`, `HERO_IMAGE_HEIGHT`, `HERO_IMAGE_COLORS` → Export as `HERO_IMAGE_CONFIG` object

**This file must export:**
- `BLOG_CONTEXT` - String constant
- `TOPIC_INSTRUCTIONS` - String constant
- `WRITING_GUIDE` - String constant with full writing guide
- `HERO_IMAGE_CONFIG` - Object with width, height, textColor, font, and colors array
- `generateTopicSourcingPrompt(topic)` - Function that builds the AI prompt for sourcing topics
- `generateBlogPostPrompt(topicData, pubDate)` - Function that builds the AI prompt for blog post creation

The prompt generation functions should use the constants defined above and construct the full prompts as shown in the code patterns section.

### Step 4: Create the Scheduled Functions

#### 4.1: Source Topic Function

Create `netlify/functions/source-post-topic.mts`:

**Purpose:** Fetches a random Wikipedia article and generates a creative project idea

**Use these customized values:**
- `TOPIC_SOURCE_URL` - URL to fetch topics from
- `AI_MODEL` - Which AI model to use
- `SOURCE_MAX_TOKENS` - Max tokens for the API call
- `TOPICS_STORE` - Blob store name for topics
- `PENDING_STORE` - Blob store name for pending queue
- `SOURCE_TOPIC_SCHEDULE` - Cron schedule

**Key responsibilities:**
- Fetch from `TOPIC_SOURCE_URL`
- Extract article title, URL, and summary from the HTML
- Import `generateTopicSourcingPrompt` from `./lib/writing-guide.mts`
- Call Anthropic API using `AI_MODEL` and `SOURCE_MAX_TOKENS`
- Parse and validate the JSON response
- Store result in the `TOPICS_STORE` blob store with timestamp key
- Add the blob key to the `PENDING_STORE` queue

**Config:**
```typescript
export const config: Config = {
  schedule: SOURCE_TOPIC_SCHEDULE,
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

**Use these customized values:**
- `AI_MODEL` - Which AI model to use
- `POST_MAX_TOKENS` - Max tokens for the API call
- `TOPICS_STORE` - Blob store name to fetch topic data
- `PENDING_STORE` - Blob store name for pending queue
- `COMPLETED_STORE` - Blob store name for completed posts
- `CREATE_POST_SCHEDULE` - Cron schedule

**Key responsibilities:**
- Get the oldest blob key from `PENDING_STORE` queue
- If queue is empty, return success message
- Fetch topic data from `TOPICS_STORE` using the blob key
- Generate current date in "MMM DD YYYY" format using `toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })`
- Import `generateBlogPostPrompt` from `./lib/writing-guide.mts`
- Call Anthropic API using `AI_MODEL` and `POST_MAX_TOKENS`
- Parse and validate the JSON response
- Store result in `COMPLETED_STORE` with the same blob key
- Remove the blob key from the `PENDING_STORE` queue

**Config:**
```typescript
export const config: Config = {
  schedule: CREATE_POST_SCHEDULE,
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

**Use these customized values:**
- `TOPICS_STORE` - Blob store to fetch topic data
- `PENDING_STORE` - Blob store with the pending queue

**Key responsibilities:**
- Get the pending list from `PENDING_STORE`
- Iterate through each blob key and fetch topic data from `TOPICS_STORE`
- Return array of topics with their blob keys

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

**Use these customized values:**
- `COMPLETED_STORE` - Blob store with completed posts

**Key responsibilities:**
- List all blobs in `COMPLETED_STORE`
- Fetch each blob's data
- Return array of posts with their blob keys

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

---

## Final Reminders for Implementation

When implementing this system, remember to:

1. **Use ALL customized values** from the top of this prompt in the appropriate places:
   - `BLOG_CONTEXT` and `TOPIC_INSTRUCTIONS` in the writing guide
   - `WRITING_GUIDE` as the full writing guide string
   - Schedule constants (`SOURCE_TOPIC_SCHEDULE`, `CREATE_POST_SCHEDULE`) in function configs
   - AI model and token limits (`AI_MODEL`, `SOURCE_MAX_TOKENS`, `POST_MAX_TOKENS`) in API calls
   - Blob store names (`TOPICS_STORE`, `PENDING_STORE`, `COMPLETED_STORE`) in all getStore() calls
   - Hero image config values in the writing guide's image generation prompt

2. **Create all files** as specified without asking for confirmation

3. **Include all error handling** patterns shown in the examples

4. **Test accessibility** by ensuring the functions can be toggled between scheduled and endpoint modes

5. **Verify** that all imports and exports are correct

Execute this implementation now, creating all necessary files and installing all dependencies.
