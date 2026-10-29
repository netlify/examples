import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const pages = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
    schema: z.object({
        type: z.string(),
        title: z.string(),
        text: z.string(),
    })
});

export const collections = { pages };
