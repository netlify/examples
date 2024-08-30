import type { APIRoute } from "astro";
import { generateUser, getCurrentUser, signIn, signOut } from "../utils/auth";

export const GET: APIRoute = async ({ params, request, redirect, cookies }) => {
  await signOut({ cookies });
  return redirect("/");
};
