import type { CollectionEntry } from 'astro:content'
import type { Pet } from './types'

export function petPath(pet: Pet) {
  return `/pets/${pet.id}`
}

export function productNewCommentPath(pet: Pet) {
  return `/api/pets/${pet.id}/comment`
}

export function productNewSnugglePath(pet: Pet) {
  return `/api/pets/${pet.id}/snuggle`
}

export function productPath(product: CollectionEntry<'product'>) {
  return `/products/${product.slug}`
}

export function productNewReviewPath(product: CollectionEntry<'product'>) {
  return `/api/products/${product.slug}/review`
}
