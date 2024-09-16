import { defineCollection, z } from 'astro:content';

const pages = defineCollection({
    type: 'content',
    schema: z.object({
        type: z.string(),
        title: z.string(),
        text: z.string(),
    })
});

export const collections = { pages };