import type { CollectionEntry } from 'astro:content'
import type { Pet } from './types'

export function productImagePath(product: CollectionEntry<'product'>) {
  return `/.netlify/images?url=/images/${product.data.image}`
}

export function petImagePath(pet: Pet) {
  return pet.image
}
