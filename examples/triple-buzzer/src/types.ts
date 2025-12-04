export type Provider = "openai" | "anthropic" | "gemini";

export const ProviderLabels: Record<Provider, string> = {
  openai: "OpenAI",
  anthropic: "Claude",
  gemini: "Gemini",
};

export type Message =
  | {
      content: string;
      type: "user";
    }
  | {
      content: string;
      type: "assistant";
      provider: Provider;
      responseTime?: number;
    };

export type ModelsByProvider = Record<Provider, string[]>;
