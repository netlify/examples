import type { Context, Config } from "@netlify/functions";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { transformStream } from "@crayonai/stream";

const client = new OpenAI({
    baseURL: "https://api.thesys.dev/v1/embed",
    apiKey: process.env.THESYS_API_KEY,
});

export default async (req: Request, context: Context) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response(null, {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        });
    }

    if (req.method !== "POST") {
        return new Response("Method Not Allowed", {
            status: 405,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
        });
    }

    try {
        const { prompt, previousC1Response } = await req.json() as {
            prompt: string;
            previousC1Response?: string;
        };

        const messages: ChatCompletionMessageParam[] = [];

        if (previousC1Response) {
            messages.push({
                role: "assistant",
                content: previousC1Response,
            });
        }

        messages.push({
            role: "user",
            content: prompt,
        });

        const llmStream = await client.chat.completions.create({
            model: "c1-exp/openai/gpt-5/v-20250831",
            messages: [...messages],
            stream: true,
        });

        const responseStream = transformStream(llmStream, (chunk) => {
            return chunk.choices[0]?.delta?.content || "";
        });

        return new Response(responseStream as ReadableStream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache, no-transform",
                "Connection": "keep-alive",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        });
    } catch (error) {
        console.error("Error in ask function:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        });
    }
};

// No custom config needed - Netlify will automatically route to /.netlify/functions/ask
