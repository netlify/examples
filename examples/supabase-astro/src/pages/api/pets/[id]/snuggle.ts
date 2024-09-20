import { addSnuggle, getPet } from '@/utils/apiHelpers'
import { petPath } from '@/utils/routes'
import type { APIRoute } from 'astro'

export const prerender = false

export const POST: APIRoute = async ({ params, redirect, cookies, request }) => {
  const pet = await getPet(params.id as string)

  if (!pet) {
    return new Response('Where`d that pet go?', { status: 404 })
  }

  await addSnuggle(pet)

  return redirect(petPath(pet), 303)
}
