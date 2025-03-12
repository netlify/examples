import type { Config, Context } from "@netlify/edge-functions";
import {
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
  COUNTRY_LANGUAGE_MAP,
} from "../../src/config/i18n.ts";

export default async (request: Request, context: Context) => {
  if (request.method === "POST") {
    try {
      const { language } = await request.json();

      const selectedLanguage =
        SUPPORTED_LANGUAGES.indexOf(language as SupportedLanguage) !== -1
          ? language
          : "en";

      context.cookies.set({
        name: "language",
        value: selectedLanguage,
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        path: "/",
        secure: true,
        sameSite: "Strict",
      });

      return Response.json({ language: selectedLanguage });
    } catch (error) {
      return Response.json({ error: "Invalid request" }, { status: 400 });
    }
  }

  if (request.method === "GET") {
    const cookieLanguage = context.cookies.get("language") as SupportedLanguage;
    if (cookieLanguage && SUPPORTED_LANGUAGES.indexOf(cookieLanguage) !== -1) {
      return Response.json({ language: cookieLanguage });
    }

    const country = (context.geo?.country?.code?.toUpperCase() ??
      "US") as keyof typeof COUNTRY_LANGUAGE_MAP;
    const detectedLanguage = COUNTRY_LANGUAGE_MAP[country] || "en";

    context.cookies.set({
      name: "language",
      value: detectedLanguage,
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      path: "/",
      secure: true,
      sameSite: "Strict",
    });

    return Response.json({ language: detectedLanguage });
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
};

export const config: Config = {
  path: "/get-location",
};
