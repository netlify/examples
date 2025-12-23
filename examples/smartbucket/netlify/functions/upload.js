import { Raindrop } from '@liquidmetal-ai/lm-raindrop';

export const handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { fileName, fileContent, contentType } = JSON.parse(event.body);

    if (!fileName || !fileContent) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'fileName and fileContent are required' }),
      };
    }

    // Validate file type
    const allowedExtensions = ['.pdf', '.txt', '.json', '.md'];
    const fileExt = '.' + fileName.split('.').pop().toLowerCase();

    if (!allowedExtensions.includes(fileExt)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Unsupported file type. Only PDF, TXT, JSON, and MD files are allowed.'
        }),
      };
    }

    // Initialize Raindrop client
    const client = new Raindrop({
      apiKey: process.env.RAINDROP_API_KEY,
    });

    const bucketLocation = {
      bucket: {
        name: process.env.RAINDROP_SMARTBUCKET_NAME,
        version: process.env.RAINDROP_APPLICATION_VERSION,
        applicationName: process.env.RAINDROP_APPLICATION_NAME,
      }
    };

    // Upload to SmartBucket (fileContent is already base64 from client)
    const response = await client.bucket.put({
      bucketLocation: bucketLocation,
      content: fileContent,
      contentType: contentType || 'application/pdf',
      key: fileName,
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        message: 'File uploaded successfully',
        fileName: fileName,
        bucket: response.bucket,
      }),
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Failed to upload file',
        details: error.message
      }),
    };
  }
};
