import { getPet } from '@/utils/apiHelpers'
import { turso } from '@/utils/database'
import { petPath } from '@/utils/routes'
import type { APIRoute } from 'astro'

export const prerender = false

export const POST: APIRoute = async ({ params, redirect, cookies, request }) => {
  const pet = await getPet(params.id as string)

  if (!pet) {
    return new Response('Where`d that pet go?', { status: 404 })
  }

  await turso.execute({
    sql: `UPDATE pets SET snuggles = snuggles + 1 WHERE id = ?`,
    args: [pet.id],
  })

  return redirect(petPath(pet), 303)
}
