import type { APIRoute } from "astro";
import { signOut } from "../utils/auth";

export const GET: APIRoute = async ({ redirect, cookies }) => {
  await signOut({ cookies });
  return redirect("/");
};
