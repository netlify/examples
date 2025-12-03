import { GoogleGenAI } from "@google/genai";
import { getStore } from "@netlify/blobs";

interface GenerateImageParams {
  slug: string;
  title: string;
  description: string;
}

interface GenerateImageResult {
  success: boolean;
  error?: string;
}

function buildPrompt(title: string, description: string): string {
  // Extract character name from title (format: "Character Name: Their New Role")
  const characterMatch = title.match(/^([^:]+):/);
  const characterName = characterMatch ? characterMatch[1].trim() : "the character";

  // Extract their new role/activity from title
  const roleMatch = title.match(/:\s*(.+)$/);
  const role = roleMatch ? roleMatch[1].trim() : "";

  return `Create a photorealistic editorial photograph for a magazine-style blog hero image.

SUBJECT: ${characterName} in their new life as ${role}.
CONTEXT: ${description}

=== IMAGE COMPOSITION ===
- Professional magazine photography style, like a feature in TIME or Vanity Fair
- Warm, inviting lighting suggesting an intimate interview setting
- Character shown in their new environment/role, engaged in an activity related to their new career
- Include visual elements that hint at their legendary past while showcasing their present
- Character appears approachable, confident, and at ease in their new life
- 16:9 aspect ratio, horizontal orientation
- High quality, detailed, photorealistic rendering
- Cinematic depth of field with the character as the clear focal point

=== CRITICAL RESTRICTIONS ===
- DO NOT include any text, titles, captions, or watermarks in the image
- DO NOT include any logos, branding, or publication names
- DO NOT include any overlays, borders, or graphic elements
- The image should be ONLY the photograph with NO text of any kind
- Pure photography only - no graphic design elements

This is a reimagining of a legendary fictional character in a modern, everyday context. Generate only the photograph.`;
}

// Check if generation is already in progress for a slug
export async function isGenerationInProgress(slug: string): Promise<boolean> {
  const inProgressStore = getStore("GenerationInProgress");
  const entry = await inProgressStore.get(slug);
  return entry !== null;
}

// Mark generation as in progress
async function markGenerationStarted(slug: string): Promise<void> {
  const inProgressStore = getStore("GenerationInProgress");
  await inProgressStore.set(slug, JSON.stringify({ startedAt: new Date().toISOString() }));
}

// Clear generation in progress marker
async function clearGenerationProgress(slug: string): Promise<void> {
  const inProgressStore = getStore("GenerationInProgress");
  try {
    await inProgressStore.delete(slug);
  } catch {
    // Ignore errors if blob doesn't exist
  }
}

export async function generateAndStoreImage({
  slug,
  title,
  description,
}: GenerateImageParams): Promise<GenerateImageResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return { success: false, error: "GEMINI_API_KEY is not configured" };
  }

  // Check if already in progress
  if (await isGenerationInProgress(slug)) {
    console.log(`Generation already in progress for ${slug}, skipping`);
    return { success: false, error: "Generation already in progress" };
  }

  // Mark as in progress
  await markGenerationStarted(slug);

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = buildPrompt(title, description);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: prompt,
      config: {
        responseModalities: ["image", "text"],
        imageConfig: {
          aspectRatio: "16:9",
        },
      },
    });

    // Extract image data from response
    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts) {
      await clearGenerationProgress(slug);
      return { success: false, error: "No response parts received" };
    }

    const imagePart = parts.find(
      (part: { inlineData?: { mimeType: string } }) =>
        part.inlineData?.mimeType?.startsWith("image/")
    );

    if (!imagePart?.inlineData?.data) {
      await clearGenerationProgress(slug);
      return { success: false, error: "No image data in response" };
    }

    // Convert base64 to buffer
    const imageBuffer = Buffer.from(imagePart.inlineData.data, "base64");

    // Store in Netlify Blobs
    const postImageStore = getStore("PostImage");
    await postImageStore.set(slug, imageBuffer, {
      metadata: {
        contentType: imagePart.inlineData.mimeType,
        generatedAt: new Date().toISOString(),
        title,
      },
    });

    // Clear in-progress marker on success
    await clearGenerationProgress(slug);

    return { success: true };
  } catch (error) {
    // Clear in-progress marker on failure
    await clearGenerationProgress(slug);

    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`Failed to generate image for ${slug}:`, message);
    return { success: false, error: message };
  }
}
