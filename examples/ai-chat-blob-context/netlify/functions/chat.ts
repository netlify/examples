import type { Context } from "@netlify/functions";
import { getDeployStore } from "@netlify/blobs";
import OpenAI from "openai";

const CHAT_KEY = "current-chat";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default async function(req: Request, context: Context) {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { message, newConversation } = await req.json();
    const store = getDeployStore("chat-history");

    
    if (newConversation) {
      await store.setJSON(CHAT_KEY, []);
      return new Response(JSON.stringify({ success: true }));
    }

    if (!message) {
      return new Response("Message is required", { status: 400 });
    }

    // Get history and update with user message
    const history = (await store.get(CHAT_KEY, { type: "json" })) as ChatMessage[] || [];
    const updatedHistory = [...history, { role: "user", content: message }];
    
    // Stream the AI response
    const stream = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: updatedHistory,
      stream: true,
    });
    
    return new Response(
      new ReadableStream({
        async start(controller) {
          let assistantMessage = '';
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || "";
            assistantMessage += text;
            controller.enqueue(new TextEncoder().encode(text));
          }
          
          await store.setJSON(CHAT_KEY, [
            ...updatedHistory, 
            { role: "assistant", content: assistantMessage }
          ]);
          controller.close();
        },
      }), 
      {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}