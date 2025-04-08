import Anthropic from '@anthropic-ai/sdk';
import { MessageParam } from '@anthropic-ai/sdk/resources/index.mjs';

interface Message {
    role: 'assistant' | 'user' | 'system'
    content: string
}

export default defineEventHandler(async (event) => {
    const anthropic = new Anthropic({
        apiKey: process.env.MODEL_API_KEY,
    });

    let messages: MessageParam[] = [];
    const previousMessages = await readBody(event);
    messages = JSON.parse(previousMessages);

    const msg = await anthropic.messages.create({
        model: "claude-3-7-sonnet-20250219",
        max_tokens: 1024,
        messages
    });

    return {
        message: msg.content[0].text
    };
});
