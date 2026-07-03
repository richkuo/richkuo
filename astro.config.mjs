// @ts-check

import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import pagefind from "astro-pagefind";
import { defineConfig, fontProviders } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import icon from "astro-icon";

const SITE = "https://www.richkuo.com";

// Read content frontmatter so the sitemap can drop `unlisted` pages and stamp
// each remaining URL with an accurate `lastmod` (updatedDate, else pubDate).
function collectPageMeta(dir, urlPrefix) {
  const meta = {};
  for (const file of readdirSync(dir)) {
    if (!/\.(md|mdx)$/.test(file)) continue;
    const raw = readFileSync(`${dir}/${file}`, "utf-8");
    const frontmatter = raw.split(/^---\s*$/m)[1] ?? "";
    const slug = file.replace(/\.(md|mdx)$/, "");
    const unlisted = /^\s*unlisted:\s*true\s*$/m.test(frontmatter);
    const pub = frontmatter.match(/^\s*pubDate:\s*['"]?([\d-]+)/m)?.[1];
    const upd = frontmatter.match(/^\s*updatedDate:\s*['"]?([\d-]+)/m)?.[1];
    meta[`/${urlPrefix}/${slug}/`] = { unlisted, lastmod: upd ?? pub };
  }
  return meta;
}

// The bake-off reports are hand-authored static HTML under public/reports/, so
// Astro's sitemap never sees them. Discover each one, read its own OG metadata
// for an accurate lastmod, and feed the clean URLs in as sitemap customPages.
function collectReportMeta(dir, urlPrefix) {
  const meta = {};
  const customPages = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    let html;
    try {
      html = readFileSync(`${dir}/${entry.name}/index.html`, "utf-8");
    } catch {
      continue; // directory without an index.html (e.g. assets) — skip
    }
    const pub = html.match(/article:published_time"\s+content="([\d-]+)"/)?.[1];
    const mod = html.match(/article:modified_time"\s+content="([\d-]+)"/)?.[1];
    const path = `/${urlPrefix}/${entry.name}/`;
    meta[path] = { lastmod: mod ?? pub };
    customPages.push(`${SITE}${path}`);
  }
  return { meta, customPages };
}

const reports = collectReportMeta(fileURLToPath(new URL("./public/reports", import.meta.url)), "reports");

const pageMeta = {
  ...collectPageMeta(fileURLToPath(new URL("./src/content/openclaw", import.meta.url)), "openclaw"),
  ...collectPageMeta(fileURLToPath(new URL("./src/content/projects", import.meta.url)), "projects"),
  ...reports.meta,
};

// https://astro.build/config
export default defineConfig({
  site: SITE,
  compressHTML: true,
  integrations: [
    mdx(),
    sitemap({
      customPages: reports.customPages,
      filter: (page) => !pageMeta[new URL(page).pathname]?.unlisted,
      serialize: (item) => {
        const pathname = new URL(item.url).pathname;
        const lastmod = pageMeta[pathname]?.lastmod;
        if (lastmod) item.lastmod = new Date(`${lastmod}T00:00:00Z`).toISOString();

        if (pathname === "/") {
          item.priority = 1.0;
          item.changefreq = "monthly";
        } else if (pathname === "/projects/" || pathname === "/openclaw/") {
          item.priority = 0.8;
          item.changefreq = "monthly";
        } else if (pathname.startsWith("/reports/")) {
          item.priority = 0.8;
          item.changefreq = "yearly";
        } else if (pathname.startsWith("/projects/")) {
          item.priority = 0.7;
          item.changefreq = "yearly";
        } else if (pathname.startsWith("/openclaw/")) {
          item.priority = 0.6;
          item.changefreq = "yearly";
        } else {
          item.priority = 0.5;
          item.changefreq = "yearly";
        }

        return item;
      },
    }),
    pagefind(),
    icon(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
  experimental: {
    fonts: [
      {
        provider: fontProviders.fontsource(),
        name: "Space Grotesk",
        cssVariable: "--font-sans",
      },
      {
        provider: fontProviders.fontsource(),
        name: "IBM Plex Mono",
        cssVariable: "--font-mono",
      },
    ],
  },
});
