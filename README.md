# richkuo

Personal site for [Rich Kuo](https://www.richkuo7.com) — product engineer portfolio, project showcase, and OpenClaw tutorials.

Live at **https://www.richkuo7.com**.

## What this site is

A static, single-page-forward marketing site built with Astro. The homepage introduces Rich, links to social profiles, and surfaces three main content areas:

- **Current projects** — products and tools (e.g. go-trader, SceneCutAI, Art Ping Pong) with optional external links or detail pages under `/projects/[slug]/`.
- **Friend projects** — collaborations and side projects by others.
- **OpenClaw** — YouTube videos and written guides (VPS setup, trading bots, MCP servers, bugfix notes) under `/openclaw/[slug]/` or external links.

The homepage is a GSAP + ScrollTrigger single-page design: a floating glass nav capsule that assembles on scroll, glass project cards with 3D mouse-tilt and alternating slide-ins, drifting gradient blobs, letter-by-letter chat bubbles, and a scroll-scrubbed hero. A **Work with me** handshake icon links to email for inquiries.

> **Note:** homepage content (projects, friend projects, videos, resources, social links) is **hardcoded as JS arrays** in `src/pages/index.astro` — adding or editing a Markdown file in `src/content/` does **not** update the homepage automatically. The content collections (`/projects/[slug]/`, `/openclaw/[slug]/`) still power the individual detail pages.

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

Entries with a `link` open externally; otherwise Astro generates `/projects/[id]/` from the Markdown body. These entries power the detail pages only — the homepage project list is hardcoded in `index.astro` and must be updated separately.

### OpenClaw frontmatter

Same shape as projects. Items whose `link` is a YouTube URL appear under **Videos** on the `/openclaw/` index; everything else appears under **Resources** (or links to `/openclaw/[slug]/` when no external URL). These entries do **not** feed the homepage automatically — see the note above about hardcoded homepage content.

## Customization

- **Identity and socials** — edit [`src/site-config.yml`](src/site-config.yml).
- **Homepage sections and hero** — all in [`src/pages/index.astro`](src/pages/index.astro); hardcoded JS arrays (`currentProjects`, `friendProjects`, `videos`, `resources`) near line 380. Profile image: [`src/assets/profile.jpg`](src/assets/profile.jpg).
- **Global styles and design tokens** — [`src/styles/global.css`](src/styles/global.css).
- **Site URL** — [`astro.config.mjs`](astro.config.mjs) (`site` field).

## Theming

- Defaults to the visitor’s **system** color scheme (`prefers-color-scheme`).
- Header toggle saves an explicit `light` or `dark` choice in `localStorage` (`theme` key). Clear site data to follow the OS again.
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
