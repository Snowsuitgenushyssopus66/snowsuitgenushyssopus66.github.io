// Content collections. Each project is one Markdown file in src/content/projects/.
// The frontmatter fields below drive the home page, the projects index and the case-study pages.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { ROLES } from './data/roles';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z
    .object({
      title: z.string(),
      // One-line outcome shown under the title. Numbers must come from Project_Points.md.
      outcome: z.string(),
      // Which target role this project proves best. Used for filters.
      role: z.enum(ROLES),
      stack: z.array(z.string()),
      // Up to three headline results: value + what it measures.
      metrics: z.array(z.object({ value: z.string(), label: z.string() })).max(3).default([]),
      repo: z.string().url().optional(),
      // Only set when a public demo really exists.
      demo: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
      // featured = on the home page and has a case study; archive = projects index only.
      tier: z.enum(['featured', 'archive']).default('archive'),
      status: z.enum(['complete', 'in-progress', 'not-deployed']).default('complete'),
      // Lower numbers appear first.
      order: z.number().default(100),
    })
    // Archive projects have no case-study page, so their card title links to the repo or demo.
    .refine((p) => p.tier === 'featured' || p.repo || p.demo.length > 0, {
      message: 'Archive projects need a repo or at least one demo link, or their card has nowhere to link.',
      path: ['repo'],
    }),
});

export const collections = { projects };
