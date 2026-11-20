# richkuo

Personal site for [Rich Kuo](https://www.richkuo.com) — product engineer portfolio, project showcase, and OpenClaw tutorials.

Live at **https://www.richkuo.com**.

## What this site is

A static, single-page-forward marketing site built with Astro. The homepage introduces Rich, links to social profiles, and surfaces five main content areas:

- **Current projects** — products and tools (e.g. BagTheJob, go-trader, SceneCutAI) with optional external links or detail pages under `/projects/[slug]/`.
- **Friend projects** — collaborations and side projects by others.
- **OpenClaw** — YouTube videos and written guides (VPS setup, trading bots, MCP servers, bugfix notes) under `/openclaw/[slug]/` or external links. The homepage shows them under **Videos** and **Resources**.
- **Resources** — standalone articles and tool pages (e.g. `/fableplan`, `/rk-skills`) on AI coding workflows, alongside the OpenClaw written guides.
- **LLM Bake-Offs** — several models build the same feature from one shared spec, scored on cost, speed, and code quality. Each episode links to a full HTML report under `/reports/issue-[n]/`. These episodes appear on `/classic/`, not on the homepage.

The homepage (`src/pages/index.astro`) is a single page built with GSAP, ScrollTrigger, and Lenis smooth scrolling. The hero name scrubs into a **Rich Kuo** badge in the top bar as you scroll. The building section pins its title while its project items pass by. Videos stack as sticky cards, and a starfield responds to scroll speed. A **Work with me** button links to email for inquiries. At 760 px wide or narrower, a hamburger menu replaces the section links. The earlier layout remains at `/classic/`.

> **Note:** homepage content (projects, friend projects, videos, resources, LLM Bake-Offs, social links) is **hardcoded as JS arrays** in `src/data/home.ts` — adding or editing a Markdown file in `src/content/` does **not** update the homepage automatically. The content collections (`/projects/[slug]/`, `/openclaw/[slug]/`) still power the individual detail pages.

## Tech stack

- [Astro](https://astro.build) 5 (static output)
- TypeScript content collections ([`src/content.config.ts`](src/content.config.ts))
- Tailwind CSS 4 + [`@tailwindcss/typography`](https://tailwindcss.com/docs/typography-plugin)
- [astro-icon](https://github.com/natemoo-re/astro-icon) (Tabler icons)
- [astro-seo](https://github.com/jonasmerlin/astro-seo) + JSON-LD in [`src/components/BaseHead.astro`](src/components/BaseHead.astro)
- [Pagefind](https://pagefind.app/) indexes the build (search UI component exists but is not wired into the header yet)
- Fonts: Space Grotesk, IBM Plex Mono (Astro experimental font pipeline)
- Package manager: [Bun](https://bun.sh)

The project started from the [Dasein](https://github.com/roicort/dasein) Astro starter and was customized for this portfolio.

## Requirements

- Bun
- Node.js 18+ (for Astro tooling if needed)

## Install and run

```sh
bun install
bun run dev      # http://localhost:4321
bun run build    # output in dist/
bun run preview  # serve the production build locally
```

## Content

| Collection | Location | Purpose |
|------------|----------|---------|
| Site config | [`src/site-config.yml`](src/site-config.yml) | Title, description, author, social links |
| Projects | `src/content/projects/*.md` | Portfolio entries |
| OpenClaw | `src/content/openclaw/*.md` | Videos (`link` → YouTube) and resource articles |
| CV | [`src/content/cv.yml`](src/content/cv.yml) | Structured résumé sections (schema in content config) |

### Project frontmatter

```yaml
---
title: go-trader
description: An OpenClaw trading bot for Discord.
pubDate: 2026-01-01
link: https://github.com/richkuo/go-trader   # optional; external instead of /projects/slug
icon: tabler:chart-line                      # optional
friend: false                                # true → "Friend Projects" section
heroImage: ../../assets/example.jpg          # optional
tags: []
---
```

Entries with a `link` open externally; otherwise Astro generates `/projects/[id]/` from the Markdown body. These entries power the detail pages only — the homepage project list is hardcoded in `src/data/home.ts` and must be updated separately.

### OpenClaw frontmatter

Same shape as projects. Items whose `link` is a YouTube URL appear under **Videos** on the `/openclaw/` index; everything else appears under **Resources** (or links to `/openclaw/[slug]/` when no external URL). These entries do **not** feed the homepage automatically — see the note above about hardcoded homepage content.

## Customization

- **Identity and socials** — edit [`src/site-config.yml`](src/site-config.yml).
- **Homepage sections and hero** — layout and styles in [`src/pages/index.astro`](src/pages/index.astro). Content arrays (`currentProjects`, `friendProjects`, `videos`, `resources`, `llmBakeOffs`, `socials`) live in [`src/data/home.ts`](src/data/home.ts). Profile image: [`src/assets/profile.jpg`](src/assets/profile.jpg).
- **Global styles and design tokens** — [`src/styles/global.css`](src/styles/global.css). The homepage defines its own color and font tokens in its style block in `index.astro`.
- **Site URL** — [`astro.config.mjs`](astro.config.mjs) (`site` field).

## Theming

- Defaults to the visitor’s **system** color scheme (`prefers-color-scheme`).
- Header toggle saves an explicit `light` or `dark` choice in `localStorage` (`theme` key). Clear site data to follow the OS again.
- The homepage has a three-button switch (system, light, dark). `/classic/` has a light and dark toggle. Both store the choice under the `theme-pref` key.
- [`src/components/ThemeScript.astro`](src/components/ThemeScript.astro) runs in `<head>` to avoid a flash of the wrong scheme and to react to OS theme changes until overridden.

## Project layout

```
src/
  components/     UI (Header, Hero, ThemeToggle, …)
  content/        Markdown collections
  layouts/        Page and post wrappers
  pages/          Routes (index, projects, openclaw, about, 404)
  styles/         global.css
  site-config.yml Site metadata
```

## Deploy

Build output is static HTML in `dist/`. Deploy to any static host (Vercel, Netlify, Cloudflare Pages, etc.). The canonical site URL is set in `astro.config.mjs`; update it if the domain changes.

Sitemap: `/sitemap-index.xml` (via `@astrojs/sitemap`).

## License

Private personal site repository unless otherwise noted.
