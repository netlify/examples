/**
 * OCR Module using Gemini Vision
 *
 * Extracts recipe information from images using Google's Gemini model.
 */

export interface OcrResult {
  rawText: string;
  recipe: {
    title: string;
    ingredients: string[];
    steps: string[];
    tags: string[];
    yields: string | null;
    cook_time: string | null;
    notes: string | null;
  };
}

/**
 * Process an attachment and extract recipe information using Gemini.
 */
export async function extractRecipeFromAttachment(
  buffer: ArrayBuffer,
  filename: string,
  subject: string
): Promise<OcrResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  const baseUrl = process.env.GOOGLE_GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com';

  if (!apiKey) {
    console.warn('GEMINI_API_KEY not configured, using fallback');
    return fallbackResult(filename, subject);
  }

  if (!buffer || buffer.byteLength === 0) {
    console.warn('No image buffer provided, using fallback');
    return fallbackResult(filename, subject);
  }

  const contentType = detectContentType(buffer);
  if (!contentType.startsWith('image/')) {
    console.warn(`Non-image content type: ${contentType}, using fallback`);
    return fallbackResult(filename, subject);
  }

  // Convert buffer to base64
  const base64Image = arrayBufferToBase64(buffer);

  const prompt = `You are a recipe extraction assistant. Analyze this image of a recipe and extract the following information.

If the image contains a recipe, extract:
1. Title - the name of the recipe
2. Ingredients - a list of all ingredients with quantities
3. Steps - the cooking instructions as numbered steps
4. Tags - relevant categories (e.g., "italian", "vegetarian", "dessert", "quick")
5. Yields - how many servings (e.g., "4 servings", "12 cookies")
6. Cook time - total cooking/prep time (e.g., "45 minutes", "1 hour")
7. Notes - any additional tips or notes from the recipe

If the image doesn't contain a clear recipe, do your best to describe what you see and provide reasonable defaults.

The email subject was: "${subject}"

Respond ONLY with valid JSON in this exact format (no markdown, no code blocks):
{
  "rawText": "The full text you can read from the image",
  "recipe": {
    "title": "Recipe Title",
    "ingredients": ["1 cup flour", "2 eggs", "..."],
    "steps": ["Preheat oven to 350°F", "Mix ingredients", "..."],
    "tags": ["tag1", "tag2"],
    "yields": "4 servings",
    "cook_time": "30 minutes",
    "notes": "Any additional notes or null"
  }
}`;

  try {
    // Use x-goog-api-key header for Netlify AI Gateway authentication
    const response = await fetch(
      `${baseUrl}/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: contentType,
                    data: base64Image,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 4096,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      return fallbackResult(filename, subject);
    }

    const data = await response.json();
    console.log('Gemini response:', JSON.stringify(data, null, 2));

    // Extract text from Gemini response
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      console.error('No text in Gemini response');
      return fallbackResult(filename, subject);
    }

    // Parse JSON from response (handle potential markdown code blocks)
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.slice(7);
    }
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.slice(3);
    }
    if (jsonText.endsWith('```')) {
      jsonText = jsonText.slice(0, -3);
    }
    jsonText = jsonText.trim();

    const result = JSON.parse(jsonText) as OcrResult;

    // Validate and provide defaults
    return {
      rawText: result.rawText || '',
      recipe: {
        title: result.recipe?.title || subject || 'Untitled Recipe',
        ingredients: Array.isArray(result.recipe?.ingredients) ? result.recipe.ingredients : [],
        steps: Array.isArray(result.recipe?.steps) ? result.recipe.steps : [],
        tags: Array.isArray(result.recipe?.tags) ? result.recipe.tags : [],
        yields: result.recipe?.yields || null,
        cook_time: result.recipe?.cook_time || null,
        notes: result.recipe?.notes || null,
      },
    };
  } catch (err) {
    console.error('Error calling Gemini:', err);
    return fallbackResult(filename, subject);
  }
}

/**
 * Fallback result when OCR is unavailable
 */
function fallbackResult(filename: string, subject: string): OcrResult {
  const title = subject || filename.replace(/\.[^.]+$/, '') || 'Untitled Recipe';

  return {
    rawText: `[OCR unavailable - manual entry required]\nFilename: ${filename}\nSubject: ${subject}`,
    recipe: {
      title,
      ingredients: ['(Add ingredients manually)'],
      steps: ['(Add steps manually)'],
      tags: [],
      yields: null,
      cook_time: null,
      notes: 'OCR was unavailable. Please edit this recipe manually.',
    },
  };
}

/**
 * Convert ArrayBuffer to base64 string
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Detect content type from buffer magic bytes
 */
export function detectContentType(buffer: ArrayBuffer): string {
  const arr = new Uint8Array(buffer.slice(0, 12));

  // Check for common image formats
  if (arr[0] === 0xFF && arr[1] === 0xD8 && arr[2] === 0xFF) {
    return 'image/jpeg';
  }
  if (arr[0] === 0x89 && arr[1] === 0x50 && arr[2] === 0x4E && arr[3] === 0x47) {
    return 'image/png';
  }
  if (arr[0] === 0x47 && arr[1] === 0x49 && arr[2] === 0x46) {
    return 'image/gif';
  }
  if (arr[0] === 0x52 && arr[1] === 0x49 && arr[2] === 0x46 && arr[3] === 0x46 &&
      arr[8] === 0x57 && arr[9] === 0x45 && arr[10] === 0x42 && arr[11] === 0x50) {
    return 'image/webp';
  }

  // Check for PDF
  if (arr[0] === 0x25 && arr[1] === 0x50 && arr[2] === 0x44 && arr[3] === 0x46) {
    return 'application/pdf';
  }

  return 'application/octet-stream';
}
