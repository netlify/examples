import Anthropic from '@anthropic-ai/sdk';

function getAnthropicClient() {
  return new Anthropic({
    apiKey: Netlify.env.get('ANTHROPIC_API_KEY'),
  });
}

export async function summarizeUpdate(text: string) {
  const anthropic = getAnthropicClient();

  const prompt = `The user will provide an update about an active project. Any unknown reference is a reference to the project itself. Create an executive summary of the information in less than 3 sentences.`;

  const msg = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 2048,
    system: prompt,
    messages: [{ role: "user", content: text }],
  });

  return msg.content.find((content)=>{
    return content.type === 'text';
  })?.text;
}
