import { getPet } from '@/utils/apiHelpers'
import { supabase } from '@/utils/database'
import { petPath } from '@/utils/routes'
import type { APIRoute } from 'astro'

export const prerender = false

export const POST: APIRoute = async ({ params, redirect, cookies, request }) => {
  const pet = await getPet(params.id as string)

  if (!pet) {
    return new Response('Where`d that pet go?', { status: 404 })
  }

  const snuggles = pet.snuggles + 1

  const { error } = await supabase.from('pets').update({ snuggles: snuggles }).eq('id', pet.id)

  if (error) {
    console.error(error)
  }

  return redirect(petPath(pet), 303)
}
