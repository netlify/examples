import type { APIRoute } from 'astro'
import { turso } from '../../../../utils/database'

export const prerender = false

export const POST: APIRoute = async ({ params, redirect, cookies, request }) => {
  const { id } = params
  if (!id) {
    return new Response('No pet id provided', { status: 400 })
  }

  const data = await turso.execute({ sql: `SELECT * FROM pets WHERE id = ?`, args: [id] })

  const pet = data?.rows?.[0]

  if (!pet) {
    return new Response('Where`d that pet go?', { status: 404 })
  }

  await turso.execute({
    sql: `UPDATE pets SET snuggles = snuggles + 1 WHERE id = ?`,
    args: [pet.id],
  })

  return redirect(`/pets/${pet.id}`, 303)
}
