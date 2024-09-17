import { getStore } from "@netlify/blobs";
import type { APIRoute } from "astro";
import { getCurrentUser } from "../utils/auth";

export const GET: APIRoute = async ({ cookies }) => {
  const user = await getCurrentUser({ cookies });
  if (!user) {
    return new Response("User is not logged in", { status: 404 });
  }

  const userAvatarStore = getStore({
    name: "UserAvatar",
    consistency: "strong",
  });
  const userAvatarBlob = await userAvatarStore.get(user.id.toString(), {
    type: "stream",
  });

  if (!userAvatarBlob) {
    return new Response("Avatar not found", { status: 404 });
  }

  return new Response(userAvatarBlob);
};
