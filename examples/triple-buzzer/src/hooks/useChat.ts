import { useState, useCallback } from "react";
import type { Message, Provider } from "../types";

interface SendMessageParams {
  message: string;
  providers: Array<{ provider: Provider; model: string }>;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const sendMessage = useCallback(
    async ({ message, providers }: SendMessageParams) => {
      if (!message.trim() || providers.length === 0) return;

      addMessage({ content: message, type: "user" });
      setIsLoading(true);
      let pendingRequestCount = providers.length;

      providers.forEach(async ({ provider, model }) => {
        const startTime = performance.now();
        try {
          const response = await fetch(`/api/${provider}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message, model }),
          });
          const responseTime = Math.round(performance.now() - startTime);

          if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error ${response.status}: ${errorMessage}`);
          }

          const data = await response.json();
          if (data.error) {
            throw new Error(data.error);
          }

          addMessage({
            content: data.answer,
            type: "assistant",
            provider,
            responseTime,
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          addMessage({
            content: `Error from ${provider}: ${errorMessage}`,
            type: "assistant",
            provider,
          });
        } finally {
          pendingRequestCount--;
          // A production-grade app should also have a timeout :-)
          if (pendingRequestCount === 0) {
            setIsLoading(false);
          }
        }
      });
    },
    [addMessage]
  );

  return { messages, isLoading, sendMessage };
}
