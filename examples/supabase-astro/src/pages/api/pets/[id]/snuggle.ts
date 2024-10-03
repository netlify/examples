import type { APIRoute } from "astro";
import { supabase } from "../../../../utils/database";

export const prerender = false;

export const POST: APIRoute = async ({ params, redirect }) => {
  const { id } = params;
  if (!id) {
    return new Response("No pet id provided", { status: 400 });
  }

  const { data: pet } = await supabase.from("pets").select("*").eq(
    "id",
    id,
  ).single();

  if (!pet) {
    return new Response(`Where'd that pet go?`, { status: 404 });
  }

  const { error: updateError } = await supabase.from("pets").update({
    snuggles: pet.snuggles + 1,
  }).eq("id", pet.id);

  if (updateError) {
    console.error(updateError);
  }

  return redirect(`/pets/${pet.id}`, 303);
};
