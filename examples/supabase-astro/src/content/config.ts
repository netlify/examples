import { z, defineCollection } from 'astro:content'

const productCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    image: z.string(),
    description: z.string(),
    price: z.number(),
  }),
})

export const collections = {
  product: productCollection,
}
