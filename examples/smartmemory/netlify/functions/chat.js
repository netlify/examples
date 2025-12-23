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
    const { message, sessionId } = JSON.parse(event.body);

    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Message is required' }),
      };
    }

    // Initialize Raindrop client
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

    let currentSessionId = sessionId;

    // Create session if not provided
    if (!currentSessionId) {
      const sessionResponse = await raindrop.startSession.create({
        smartMemoryLocation: smartMemoryLocation,
      });
      currentSessionId = sessionResponse.sessionId;
    }

    // Retrieve recent memory
    const memoryResponse = await raindrop.getMemory.retrieve({
      sessionId: currentSessionId,
      smartMemoryLocation: smartMemoryLocation,
      timeline: 'conversation',
      nMostRecent: 5,
    });

    const memoryCount = memoryResponse.memories?.length || 0;

    // Generate response (demo mode - echoes with memory info)
    // Add 1 because we're about to store this interaction
    const assistantMessage = `You said: "${message}". I currently have ${memoryCount + 1} memories in this session.`;

    // Store this interaction in memory
    await raindrop.putMemory.create({
      sessionId: currentSessionId,
      smartMemoryLocation: smartMemoryLocation,
      content: `User said: "${message}". I responded: "${assistantMessage}"`,
      agent: 'demo-agent',
      timeline: 'conversation',
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        response: assistantMessage,
        sessionId: currentSessionId,
        memoryCount: memoryCount + 1,
      }),
    };
  } catch (error) {
    console.error('Error in chat:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Failed to process chat',
        details: error.message
      }),
    };
  }
};
