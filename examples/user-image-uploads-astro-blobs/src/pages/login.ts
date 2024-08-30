import type { APIRoute } from "astro";
import { generateUser, getCurrentUser, signIn } from "../utils/auth";

export const GET: APIRoute = async ({ redirect, cookies }) => {
  const currentUser = await getCurrentUser({ cookies });
  if (!currentUser) {
    const newUser = await generateUser();
    await signIn({ user: newUser, cookies });
  }

  return redirect("/profile");
};
