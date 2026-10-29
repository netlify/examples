import OpenAI from 'openai';

interface Message {
    role: 'assistant' | 'user' | 'system'
    content: string
}

export default defineEventHandler(async (event) => {
    const openai = new OpenAI({
        apiKey: process.env.MODEL_API_KEY
    });

    let messages: Message[] = [];
    const previousMessages = await readBody(event);
    messages = JSON.parse(previousMessages);
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages
    });

    const content = completion.choices[0]?.message.content;

    if (!content) {
        throw createError({ statusCode: 502, statusMessage: 'Model returned no text' });
    }

    return {
        message: content
    };

});
