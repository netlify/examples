import { GoogleGenAI } from '@google/genai';

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

export async function extractRecipeFromAttachment(
  buffer: ArrayBuffer,
  filename: string,
  subject: string
): Promise<OcrResult> {
  if (!buffer || buffer.byteLength === 0) {
    return fallbackResult(filename, subject);
  }

  const contentType = detectContentType(buffer);
  if (!contentType.startsWith('image/')) {
    return fallbackResult(filename, subject);
  }

  const genAI = new GoogleGenAI({});
  const base64Image = Buffer.from(buffer).toString('base64');

  const prompt = `Analyze this recipe image and extract the information as JSON.

Return ONLY valid JSON (no markdown):
{
  "rawText": "all text from the image",
  "recipe": {
    "title": "Recipe Title",
    "ingredients": ["ingredient 1", "ingredient 2"],
    "steps": ["step 1", "step 2"],
    "tags": ["tag1", "tag2"],
    "yields": "4 servings",
    "cook_time": "30 minutes",
    "notes": "any notes or null"
  }
}

Email subject: "${subject}"`;

  try {
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

    const text = response.text?.trim() || '';
    let jsonText = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    const result = JSON.parse(jsonText) as OcrResult;

    return {
      rawText: result.rawText || '',
      recipe: {
        title: result.recipe?.title || subject || 'Untitled Recipe',
        ingredients: result.recipe?.ingredients || [],
        steps: result.recipe?.steps || [],
        tags: result.recipe?.tags || [],
        yields: result.recipe?.yields || null,
        cook_time: result.recipe?.cook_time || null,
        notes: result.recipe?.notes || null,
      },
    };
  } catch (err) {
    console.error('Gemini error:', err);
    return fallbackResult(filename, subject);
  }
}

function fallbackResult(filename: string, subject: string): OcrResult {
  return {
    rawText: `OCR unavailable for: ${filename}`,
    recipe: {
      title: subject || filename.replace(/\.[^.]+$/, '') || 'Untitled Recipe',
      ingredients: ['(Add ingredients manually)'],
      steps: ['(Add steps manually)'],
      tags: [],
      yields: null,
      cook_time: null,
      notes: 'OCR was unavailable. Please edit manually.',
    },
  };
}

export function detectContentType(buffer: ArrayBuffer): string {
  const arr = new Uint8Array(buffer.slice(0, 12));
  if (arr[0] === 0xff && arr[1] === 0xd8 && arr[2] === 0xff) return 'image/jpeg';
  if (arr[0] === 0x89 && arr[1] === 0x50 && arr[2] === 0x4e && arr[3] === 0x47) return 'image/png';
  if (arr[0] === 0x47 && arr[1] === 0x49 && arr[2] === 0x46) return 'image/gif';
  if (arr[0] === 0x25 && arr[1] === 0x50 && arr[2] === 0x44 && arr[3] === 0x46) return 'application/pdf';
  return 'application/octet-stream';
}
