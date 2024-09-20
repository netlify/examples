import type { AstroCookieSetOptions } from "astro";

export const DEFAULT_COOKIE_OPTIONS: AstroCookieSetOptions = {
  path: "/",
  sameSite: "strict",
  httpOnly: true,
  secure: import.meta.env.NODE_ENV === "production",
};
