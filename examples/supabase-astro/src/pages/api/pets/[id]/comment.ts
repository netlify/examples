import { getPet } from '@/utils/apiHelpers'
import { supabase } from '@/utils/database'
import { petPath } from '@/utils/routes'
import { purgeCache } from '@netlify/functions'
import type { APIRoute } from 'astro'

export const prerender = false

export const POST: APIRoute = async ({ params, redirect, cookies, request }) => {
  const pet = await getPet(params.id as string)

  if (!pet) {
    return new Response('Where`d that pet go?', { status: 404 })
  }

  console.log('[DEBUG] POST comment', pet)

  // Get form data
  const formData = await request.formData()
  const comment = formData.get('comment') as string

  // Save review to Supabase
  const { error } = await supabase.from('comments').insert({
    pet_id: pet.id,
    comment,
  })

  await purgeCache({ tags: ['all-reviews'] })

  if (error) {
    console.error('Error saving comment:', error)
    return new Response('Error saving comment', { status: 500 })
  }

  return redirect(petPath(pet), 303)
}
