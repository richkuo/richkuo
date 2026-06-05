import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { getSite } from '../utils/consts';

export async function GET(context: APIContext) {
	const site = await getSite();

	const projects = (await getCollection('projects')).map((entry) => ({
		title: entry.data.title,
		description: entry.data.description,
		pubDate: entry.data.pubDate,
		link: `/projects/${entry.id}/`,
	}));

	const openclaw = (await getCollection('openclaw'))
		.filter((entry) => !entry.data.unlisted)
		.map((entry) => ({
			title: entry.data.title,
			description: entry.data.description,
			pubDate: entry.data.pubDate,
			link: `/openclaw/${entry.id}/`,
		}));

	const items = [...projects, ...openclaw].sort(
		(a, b) => b.pubDate.valueOf() - a.pubDate.valueOf(),
	);

	return rss({
		title: site.title ?? 'Rich Kuo',
		description:
			site.description ?? 'Product engineer building creative and technical products.',
		site: context.site ?? 'https://www.richkuo7.com',
		items,
		customData: `<language>en-us</language>`,
	});
}
