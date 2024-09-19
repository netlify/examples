import { supabase } from '@/utils/database'
import { productPath } from '@/utils/routes'
import { purgeCache } from '@netlify/functions'
import type { APIRoute } from 'astro'

export const prerender = false

export const POST: APIRoute = async ({ params, redirect, cookies, request }) => {
  const product = await getEntry('product', params.name as string)

  if (!product) {
    return new Response('Product not found', { status: 404 })
  }

  console.log('[DEBUG] POST review', product)

  // Get form data
  const formData = await request.formData()
  const rating = formData.get('rating') as string
  const comment = formData.get('comment') as string

  if (!rating) {
    return new Response('Rating is required', { status: 400 })
  }

  // Save review to Supabase
  const { error } = await supabase.from('reviews').insert({
    product_id: product.id,
    rating: parseInt(rating, 10),
    comment,
  })

  await purgeCache({ tags: ['all-reviews'] })

  if (error) {
    console.error('Error saving review:', error)
    return new Response('Error saving review', { status: 500 })
  }

  return redirect(productPath(product), 303)
}
