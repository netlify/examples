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
    // Initialize Raindrop client with environment variables
    const raindrop = new Raindrop({
      apiKey: process.env.RAINDROP_API_KEY,
    });

    const smartMemoryLocation = {
      smartMemory: {
        name: process.env.RAINDROP_SMARTMEMORY_NAME,
        application_name: process.env.RAINDROP_APPLICATION_NAME,
        version: process.env.RAINDROP_APPLICATION_VERSION,
      }
    };

    // Create new session
    const response = await raindrop.startSession.create({
      smartMemoryLocation: smartMemoryLocation,
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: response.sessionId,
        message: 'Session created successfully'
      }),
    };
  } catch (error) {
    console.error('Error creating session:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Failed to create session',
        details: error.message
      }),
    };
  }
};
