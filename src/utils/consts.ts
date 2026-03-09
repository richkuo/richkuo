// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

import { getEntry } from 'astro:content';

export async function getSite() {
	// Try to read the `site` entry and fallback to constants
	const author = await getEntry('site', 'author');
	const social = await getEntry('site', 'social');
	const title = await getEntry('site', 'title');
	const description = await getEntry('site', 'description');
	return {
		author: author?.data,
		social: social?.data,
		title: title?.data as unknown as string,
		description: description?.data as unknown as string,
	};
}
