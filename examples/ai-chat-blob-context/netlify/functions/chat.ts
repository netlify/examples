import type { Context } from "@netlify/functions";
import { getDeployStore } from "@netlify/blobs";
import OpenAI from "openai/index.mjs";
import { randomUUID } from "crypto";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

async function getChatHistory(sessionId: string, store: ReturnType<typeof getDeployStore>) {
  return (await store.get(`${sessionId}`, { type: "json" })) as ChatMessage[] || [];
}

async function saveChatHistory(sessionId: string, history: ChatMessage[], store: ReturnType<typeof getDeployStore>) {
  await store.setJSON(`${sessionId}`, history);
}

export default async function(req: Request, context: Context) {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { message, newConversation } = await req.json();
    const store = getDeployStore("chat-history");
    
    if (newConversation) {
      const sessionId = randomUUID();
      context.cookies.set({
        name: "session_id",
        value: sessionId,
        path: "/",
        secure: true,
        sameSite: "Strict",
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      });
      await saveChatHistory(sessionId, [], store);
      return new Response(JSON.stringify({ success: true }));
    }

    let sessionId = context.cookies.get("session_id");
    if (!sessionId) {
      sessionId = randomUUID();
      context.cookies.set({
        name: "session_id",
        value: sessionId,
        path: "/",
        secure: true,
        sameSite: "Strict",
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
    }

    if (!message) {
      return new Response("Message is required", { status: 400 });
    }

    const history = await getChatHistory(sessionId, store);
    const userMessage: ChatMessage = {
      role: "user",
      content: message
    };
    const updatedHistory = [...history, userMessage];
    
    const stream = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: updatedHistory as OpenAI.Chat.ChatCompletionMessageParam[],
      stream: true,
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        let assistantMessage = '';
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || "";
          assistantMessage += text;
          controller.enqueue(new TextEncoder().encode(text));
        }
        const assistantResponse: ChatMessage = {
          role: "assistant",
          content: assistantMessage
        };
        await saveChatHistory(sessionId, [...updatedHistory, assistantResponse], store);
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}