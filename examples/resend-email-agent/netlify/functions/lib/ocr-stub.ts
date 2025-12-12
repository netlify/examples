/**
 * OCR Stub Module
 *
 * This is a placeholder OCR implementation that extracts text heuristically.
 * Replace with Tesseract, Google Vision, or another OCR service for production.
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
 * Process an attachment and extract recipe information.
 * Currently a stub that returns placeholder data based on filename/subject.
 */
export async function extractRecipeFromAttachment(
  _buffer: ArrayBuffer,
  filename: string,
  subject: string
): Promise<OcrResult> {
  // In a real implementation, this would:
  // 1. For images: Use Tesseract.js, Google Vision API, or similar
  // 2. For PDFs: Extract text with pdf-parse or similar
  // 3. Parse the extracted text to identify recipe components

  // For now, return a stub with placeholder data
  const title = subject || filename.replace(/\.[^.]+$/, '') || 'Untitled Recipe';

  const rawText = `[OCR Stub - Replace with real OCR implementation]

Recipe from: ${filename}
Subject: ${subject}

This is placeholder text. In production, actual OCR would extract:
- Recipe title
- Ingredients list
- Cooking steps
- Additional metadata

To implement real OCR:
1. For images: Use Tesseract.js or cloud OCR API
2. For PDFs: Use pdf-parse to extract text
3. Parse extracted text with regex or NLP`;

  return {
    rawText,
    recipe: {
      title,
      ingredients: [
        '(OCR not implemented - add ingredients manually)',
      ],
      steps: [
        '(OCR not implemented - add steps manually)',
      ],
      tags: [],
      yields: null,
      cook_time: null,
      notes: 'This recipe was processed with a stub OCR. Edit to add real content.',
    },
  };
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
