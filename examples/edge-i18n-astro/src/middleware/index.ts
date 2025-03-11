import { defineMiddleware } from "astro:middleware";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "../config/i18n";
import { getCurrentLanguage } from "../utils/i18n";

export const onRequest = defineMiddleware(async (context, next) => {
  const { cookies } = context;
  const currentLanguage = cookies.get("language")?.value as SupportedLanguage;
  const currentUrl = new URL(context.request.url);
  const currentPath = currentUrl.pathname;
  const pathLanguage = getCurrentLanguage(currentPath);

  if (!currentLanguage && !pathLanguage) {
    return next();
  }

  if (currentLanguage && (!pathLanguage || pathLanguage !== currentLanguage)) {
    const cleanPath = currentPath.replace(
      new RegExp(`^/(${SUPPORTED_LANGUAGES.join("|")})?`),
      ""
    );
    currentUrl.pathname = `/${currentLanguage}${cleanPath}`;
    return Response.redirect(currentUrl.toString(), 302);
  }

  if (pathLanguage && !currentLanguage) {
    cookies.set("language", pathLanguage, {
      path: "/",
      secure: true,
      httpOnly: true,
      sameSite: "strict",
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    });
  }

  return next();
});
