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
    const { textQuery } = JSON.parse(event.body);

    if (!textQuery) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Text query is required' }),
      };
    }

    // Initialize Raindrop client
    const client = new Raindrop({
      apiKey: process.env.RAINDROP_API_KEY,
    });

    const smartSqlLocation = {
      smartSql: {
        name: process.env.RAINDROP_SMARTSQL_NAME,
        version: process.env.RAINDROP_APPLICATION_VERSION,
        application_name: process.env.RAINDROP_APPLICATION_NAME,
      }
    };

    // Execute natural language query
    const response = await client.executeQuery.execute({
      smartSqlLocation: smartSqlLocation,
      textQuery: textQuery,
    });

    // Parse results if they're a string
    let parsedResults = response.results;
    try {
      if (typeof response.results === 'string') {
        parsedResults = JSON.parse(response.results);
      }
    } catch (parseError) {
      // If parsing fails, keep the original results
      parsedResults = response.results;
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        results: parsedResults,
        queryExecuted: response.queryExecuted,
        aiReasoning: response.aiReasoning,
        format: response.format || 'json',
        textQuery: textQuery,
      }),
    };
  } catch (error) {
    console.error('Query error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Failed to execute query',
        details: error.message
      }),
    };
  }
};
