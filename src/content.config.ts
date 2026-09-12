import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const curriculum = defineCollection({
  loader: glob({ pattern: ['[0-9][0-9]-*.md', '[0-9][0-9]-*.mdx', 'week-*.md', 'week-*.mdx', 'README.md'], base: '.' }),
  schema: z.object({
    title: z.string().optional(),
    week: z.number().int().min(1).max(24).optional(),
    phase: z.union([z.string(), z.number()]).optional(),
    estimated_hours: z.number().positive().optional(),
    prerequisites: z.array(z.string()).optional(),
  }),
});

export const collections = { curriculum };
