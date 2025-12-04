import { useState, useEffect } from "react";
import { type Provider, type ModelsByProvider, ProviderLabels } from "../types";

export interface ProviderSettings {
  provider: Provider;
  enabled: boolean;
  model: string;
}

type AllProvidersState = Record<Provider, ProviderSettings>;

const defaultState: AllProvidersState = {
  openai: { provider: "openai", enabled: true, model: "gpt-5-mini" },
  anthropic: {
    provider: "anthropic",
    enabled: true,
    model: "claude-haiku-4-5-20251001",
  },
  gemini: { provider: "gemini", enabled: true, model: "gemini-flash-latest" },
};

interface SelectProvidersProps {
  models: ModelsByProvider;
  onChange: (enabledProviders: Array<ProviderSettings>) => void;
}

export function SelectProviders({ models, onChange }: SelectProvidersProps) {
  const [providers, setProviders] = useState<AllProvidersState>(defaultState);

  useEffect(() => {
    const enabled = Object.values(providers).filter((e) => e.enabled);
    onChange(enabled);
  }, [providers, onChange]);

  const handleToggleEnabled = (provider: Provider) => {
    setProviders((prev) => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        enabled: !prev[provider].enabled,
      },
    }));
  };

  const handleSelectModel = (provider: Provider, model: string) => {
    setProviders((prev) => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        model,
      },
    }));
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 w-full justify-items-stretch join">
      {Object.values(providers).map((p) => (
        <SingleProvider
          settings={p}
          models={models}
          onToggleEnabled={handleToggleEnabled}
          onSelectModel={handleSelectModel}
        />
      ))}
    </div>
  );
}

interface SingleProviderProps {
  settings: ProviderSettings;
  models: ModelsByProvider;
  onToggleEnabled: (provider: Provider) => void;
  onSelectModel: (provider: Provider, model: string) => void;
}

function SingleProvider({
  settings,
  models,
  onToggleEnabled,
  onSelectModel,
}: SingleProviderProps) {
  const { provider } = settings;
  const availableModels = models[provider];

  return (
    <div
      key={provider}
      className={
        `join-item flex lg:flex-col btn lg:h-28 rounded-none justify-between lg:justify-center   ` +
        (settings.enabled
          ? "btn-primary"
          : "btn-outline border-base-300 text-base-content opacity-80  ")
      }
      onClick={(e) => {
        if ((e.target as HTMLElement).tagName !== "SELECT") {
          onToggleEnabled(provider);
        }
      }}
    >
      <span className="lg:text-xl normal-case">{ProviderLabels[provider]}</span>
      <div className="w-max" onClick={(e) => e.stopPropagation()}>
        {availableModels.length > 0 ? (
          <select
            value={settings.model}
            onChange={(e) => onSelectModel(provider, e.target.value)}
            className="select select-ghost font-sans lg:select-sm lg:border-base-200"
            disabled={!settings.enabled}
          >
            {availableModels.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        ) : (
          <span className="font-sans text-sm">Loading...</span>
        )}
      </div>
    </div>
  );
}
