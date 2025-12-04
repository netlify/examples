import { useState, useEffect } from "react";
import type { ModelsByProvider } from "../types";

export function useAvailableModels() {
  const [models, setModels] = useState<ModelsByProvider>({
    openai: [],
    anthropic: [],
    gemini: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchModels() {
      try {
        // Fetch directly from Netlify AI Gateway API (now supports CORS)
        const response = await fetch("https://api.netlify.com/api/v1/ai-gateway/providers");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Transform the data to extract model names per provider
        const modelsByProvider: ModelsByProvider = {
          openai: [],
          anthropic: [],
          gemini: [],
        };

        const data = await response.json();
        const providers = data.providers as Record<string, {models: string[]}>;
        Object.entries(providers).forEach(([providerName, provider]) => {
          if (providerName === 'openai' || providerName === 'anthropic' || providerName === 'gemini') {
            modelsByProvider[providerName] = provider.models;
          }
        });

        setModels(modelsByProvider);
      } catch (err) {
        console.error("Failed to fetch models:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch models");
      } finally {
        setLoading(false);
      }
    }

    fetchModels();
  }, []);

  return { models, loading, error };
}
