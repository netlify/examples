// ============================================================================
// CUSTOMIZABLE PROMPTS
// ============================================================================
// These prompts define how the AI generates content. Customize them to match
// your blog's topic, voice, and requirements.

/**
 * Context for topic sourcing - describes what kind of blog this is
 */
export const BLOG_CONTEXT = `a blog about random acts of creativity`;

/**
 * Instructions for what to create from the sourced topic
 */
export const TOPIC_INSTRUCTIONS = `Use this as inspiration for something creative that someone can make at home. It could be a craft, a recipe, a DIY project, an experiment, or anything else that involves making something.`;

/**
 * Generates the prompt for sourcing a topic from a Wikipedia article
 */
export function generateTopicSourcingPrompt(topic: {
  title: string;
  url: string;
  summary?: string;
}): string {
  return `You are helping to create content for ${BLOG_CONTEXT}.

I found a random Wikipedia article: "${topic.title}"
${topic.summary ? `\nSummary: ${topic.summary}` : ""}
${topic.url ? `\nURL: ${topic.url}` : ""}

${TOPIC_INSTRUCTIONS}

Return ONLY a valid JSON object with this structure. Do not include any markdown formatting, code blocks, or explanatory text - just the raw JSON:
{
  "title": "Creative project title",
  "description": "Brief description (2-3 sentences)",
  "wikipediaArticle": "${topic.url}",
  "materials": ["material1", "material2"],
  "steps": ["step1", "step2"]
}`;
}

/**
 * Hero image configuration
 */
export const HERO_IMAGE_CONFIG = {
  width: 1600,
  height: 800,
  textColor: "333333",
  font: "Lora",
  colors: [
    "FFFFCC", // pale yellow
    "FFB6C1", // light pink
    "B0E0E6", // powder blue
    "DDA0DD", // plum
    "F0E68C", // khaki
    "E0BBE4", // lavender
    "FFDAB9", // peach
    "C1FFC1", // pale green
  ],
};

/**
 * Generates the prompt for creating a blog post from a sourced topic
 */
export function generateBlogPostPrompt(
  topicData: any,
  pubDate: string
): string {
  const colorList = HERO_IMAGE_CONFIG.colors.join(", ");

  return `You are writing a blog post for ${BLOG_CONTEXT}.

Here is the creative project that was sourced:
${JSON.stringify(topicData, null, 2)}

Write a complete blog post about this project following the voice, tone, and style guidelines below:

${WRITING_GUIDE}

---

The post should include:
- A catchy title
- A brief description (1-2 sentences for SEO/preview)
- Publication date: Use "${pubDate}"
- Hero image: Generate a placeholder URL in this format:
  https://placehold.co/${HERO_IMAGE_CONFIG.width}x${HERO_IMAGE_CONFIG.height}/BGCOLOR/${HERO_IMAGE_CONFIG.textColor}?font=${HERO_IMAGE_CONFIG.font}&text=URL_ENCODED_TITLE

  Where:
  - BGCOLOR is a bright, vibrant hex color (without the #). Use colors like: ${colorList}. Choose one that fits the mood of the post.
  - ${HERO_IMAGE_CONFIG.textColor} is the dark text color for good contrast
  - URL_ENCODED_TITLE is the post title with spaces replaced by + signs and special characters URL encoded

- Full markdown body content with:
  - An engaging introduction that tells a story and explains the inspiration
  - 3-5 sections with descriptive subheadings (#### format)
  - The narrative should weave in the materials and steps naturally
  - A compelling conclusion that paints a picture of the final result

Remember: Focus on the experience and joy of creating, not just technical instructions. Be whimsical, playful, and encouraging.

Return ONLY a valid JSON object with this structure. Do not include any markdown formatting, code blocks, or explanatory text - just the raw JSON:
{
  "title": "Blog post title",
  "description": "SEO-friendly description",
  "pubDate": "${pubDate}",
  "heroImage": "https://placehold.co/${HERO_IMAGE_CONFIG.width}x${HERO_IMAGE_CONFIG.height}/BGCOLOR/${HERO_IMAGE_CONFIG.textColor}?font=${HERO_IMAGE_CONFIG.font}&text=Title",
  "body": "Full markdown content here"
}`;
}

// ============================================================================
// WRITING GUIDE
// ============================================================================

export const WRITING_GUIDE = `# Writing Guide

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
