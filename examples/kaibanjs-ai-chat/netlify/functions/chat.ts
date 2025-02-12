import type { Context } from "@netlify/functions";
import { Agent, Task, Team } from "kaibanjs";

// Create a KaibanJS agent for chat
const chatAgent = new Agent({
  name: "Chat Assistant",
  role: "Conversational Assistant",
  goal: "Provide helpful and accurate responses to user queries",
  background: "AI assistant trained to engage in helpful conversations",
  // llmConfig: {
  //   provider: "openai",
  //   model: "gpt-3.5-turbo",
  //   apiKey: { openai: process.env.OPENAI_API_KEY },
  //   maxRetries: 3,
  // },
});

export default async (req: Request, context: Context) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const text = await req.text();
    const { message } = JSON.parse(text || "{}");

    if (!message) {
      return new Response("Message is required", { status: 400 });
    }

    const chatResponseAgent = new Task({
      title: "Chat Response",
      description: `Responsd to the user's message: ${message}`,
      expectedOutput: "A helpful and accurate response to the user's message",
      agent: chatAgent,
    });

    const chatTeam = new Team({
      name: "Chat Team",
      agents: [chatAgent],
      tasks: [chatResponseAgent],
      inputs: { message },
      env: { OPENAI_API_KEY: process.env.OPENAI_API_KEY },
    });

    const output = await chatTeam.start({ message });

    if (output.status === "FINISHED") {
      console.log("\nGenerated Blog Post:");
      console.log(output.result);

      const { costDetails, llmUsageStats, duration } = output.stats;
      console.log("\nStats:");
      console.log(`Duration: ${duration} ms`);
      console.log(
        `Total Token Count: ${
          llmUsageStats.inputTokens + llmUsageStats.outputTokens
        }`
      );
      console.log(`Total Cost: $${costDetails.totalCost.toFixed(4)}`);
    } else if (output.status === "BLOCKED") {
      console.log("Workflow is blocked, unable to complete");
    }

    return new Response(JSON.stringify(output.result), { status: 200 });

    // Create a ReadableStream for the response
    // const readableStream = new ReadableStream({
    //   async start(controller) {
    //     try {
    //       // Use KaibanJS agent to process the message with streaming
    //       const stream = await chatTeam.start({message});

    //       for await (const chunk of stream) {
    //         const text = chunk.content || "";
    //         if (text) {
    //           controller.enqueue(new TextEncoder().encode(text));
    //         }
    //       }
    //       controller.close();
    //     } catch (error) {
    //       console.error("Stream Error:", error);
    //       controller.error(error);
    //     }
    //   },
    // });

    // Return a Response object with the stream
    // return new Response(readableStream, {
    //   headers: {
    //     "Content-Type": "text/event-stream",
    //     "Cache-Control": "no-cache",
    //     Connection: "keep-alive",
    //   },
    // });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};
