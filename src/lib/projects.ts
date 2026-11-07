// Loads projects from the content collection as plain objects (safe to pass to React),
// sorted by `order`.
import { getCollection } from 'astro:content';

export async function getProjects(filter?: (p: { tier: string }) => boolean) {
  const entries = await getCollection('projects');
  return entries
    .map((e) => ({ slug: e.id, ...e.data }))
    .filter((p) => (filter ? filter(p) : true))
    .sort((a, b) => a.order - b.order);
}
