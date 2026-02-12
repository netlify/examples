import { Raindrop } from '@liquidmetal-ai/lm-raindrop';
import crypto from 'crypto';

export const handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { query } = JSON.parse(event.body);

    if (!query) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Search query is required' }),
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

    // Perform semantic search
    const response = await client.query.chunkSearch({
      bucketLocations: [bucketLocation],
      input: query,
      requestId: crypto.randomUUID(),
    });

    // Format results
    const results = response.results?.map(chunk => ({
      text: chunk.text,
      score: Math.round(chunk.score * 100),
      fileName: chunk.source?.object || 'Unknown',
      bucketName: chunk.source?.bucket?.bucketName || 'Unknown',
      chunkId: chunk.chunkSignature,
      type: chunk.type,
    })) || [];

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        results,
        count: results.length,
        query: query,
      }),
    };
  } catch (error) {
    console.error('Search error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Failed to search documents',
        details: error.message
      }),
    };
  }
};
