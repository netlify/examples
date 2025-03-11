export const SUPPORTED_LANGUAGES = ["en", "ja", "es", "fr"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_CONFIG = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
] as const;

export const COUNTRY_LANGUAGE_MAP: Record<string, SupportedLanguage> = {
  JP: "ja",
  ES: "es",
  FR: "fr",
  // Add more country mappings as needed
};
