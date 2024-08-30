import { type APIRoute } from "astro";
import { getStore } from "@netlify/blobs";
import { getCurrentUser } from "../utils/auth";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const image = formData.get("avatar_file") as File;

  const user = await getCurrentUser({ cookies });
  if (!user) {
    return new Response("User is not logged in", { status: 500 });
  }

  const userAvatarStore = getStore({
    name: "UserAvatar",
    consistency: "strong",
  });
  await userAvatarStore.set(user.id.toString(), image);

  return redirect("/profile");
};
