import type { CollectionEntry } from 'astro:content'

export function petPath(pet: { name: string; greeting: string }) {
  return `/pets/${pet.name}`
}

export function productNewCommentPath(product: CollectionEntry<'product'>) {
  return `/api/products/${product.slug}/comment`
}

export function productPath(product: CollectionEntry<'product'>) {
  return `/products/${product.slug}`
}

export function productNewReviewPath(product: CollectionEntry<'product'>) {
  return `/api/products/${product.slug}/review`
}
