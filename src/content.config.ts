import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const projects = defineCollection({
	// Load Markdown and MDX files in the `src/content/projects/` directory.
	loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
			tags: z.array(z.string()).default([]),
			link: z.string().optional(),
			friend: z.boolean().default(false),
			icon: z.string().optional(),
		}),
});

const site = defineCollection({
	loader: file('src/site-config.yml'),
});

const cv = defineCollection({
  loader: file("src/content/cv.yml"),
  schema: z.object({
    id: z.string().optional(),
    heading: z.string(),
    component: z.string().optional(),
    collection: z.string().optional(),
    limit: z.number().optional(),
    viewAllHref: z.string().optional(),
    viewAllLabel: z.string().optional(),
    items: z
      .array(
        z.object({
          title: z.string(),
          description: z.string().optional(),
          datetime: z.string().optional(),
          href: z.string().optional(),
        }),
      )
      .optional(),
    links: z
      .array(
        z.object({
          label: z.string(),
          href: z.string(),
        }),
      )
      .optional(),
  }),
});

const openclaw = defineCollection({
	loader: glob({ base: './src/content/openclaw', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
			tags: z.array(z.string()).default([]),
			link: z.string().optional(),
			icon: z.string().optional(),
		}),
});

export const collections = { cv, openclaw, projects, site };
