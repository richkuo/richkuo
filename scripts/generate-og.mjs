// Generates the site's 1200x630 social share cards:
//   - public/og-home.png              the homepage identity card
//   - public/og/<slug>.png            per-page cards for the guides + fableplan
// All match the site identity: dark background, drifting color glow, rainbow
// accent. Run with: bun scripts/generate-og.mjs
import sharp from "sharp";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const W = 1200;
const H = 630;

const xmlEscape = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Shared background: dark canvas + three drifting radial glows, matching the
// live site's blob field and the homepage OG card.
const defs = `
  <defs>
    <radialGradient id="glowA" cx="12%" cy="18%" r="62%">
      <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#3b82f6" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowB" cx="88%" cy="26%" r="58%">
      <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#06b6d4" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowC" cx="72%" cy="104%" r="64%">
      <stop offset="0%" stop-color="#7c3aed" stop-opacity="0.42"/>
      <stop offset="100%" stop-color="#7c3aed" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ef4444"/>
      <stop offset="0.5" stop-color="#22c55e"/>
      <stop offset="1" stop-color="#a855f7"/>
    </linearGradient>
  </defs>`;

const bgRects = `
  <rect width="${W}" height="${H}" fill="#0d0d10"/>
  <rect width="${W}" height="${H}" fill="url(#glowA)"/>
  <rect width="${W}" height="${H}" fill="url(#glowB)"/>
  <rect width="${W}" height="${H}" fill="url(#glowC)"/>`;

async function svgToPng(svg) {
  return sharp(Buffer.from(svg)).png().toBuffer();
}

// ---------- homepage card (avatar + rainbow name) ----------
const AVATAR = 264;
const AVATAR_X = 120;
const AVATAR_Y = Math.round((H - AVATAR) / 2);
const TEXT_X = 444;

const homeBackground = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  ${defs}
  ${bgRects}
  <circle cx="${AVATAR_X + AVATAR / 2}" cy="${AVATAR_Y + AVATAR / 2}" r="${AVATAR / 2 + 9}"
          fill="none" stroke="#ffffff" stroke-opacity="0.16" stroke-width="3"/>
  <text x="${TEXT_X}" y="296" font-family="Helvetica, Arial, sans-serif" font-weight="800" font-size="124" letter-spacing="-3">
    <tspan fill="#ef4444">R</tspan><tspan fill="#f97316">i</tspan><tspan fill="#eab308">c</tspan><tspan fill="#22c55e">h</tspan><tspan fill="#3b82f6" dx="34">K</tspan><tspan fill="#6366f1">u</tspan><tspan fill="#7c3aed">o</tspan>
  </text>
  <text x="${TEXT_X + 4}" y="368" font-family="Helvetica, Arial, sans-serif" font-weight="600" font-size="48" fill="#e5e7eb">Product Engineer</text>
  <text x="${TEXT_X + 4}" y="426" font-family="Helvetica, Arial, sans-serif" font-weight="400" font-size="31" fill="#9ca3af">Building creative &amp; technical products</text>
  <rect x="${TEXT_X + 4}" y="470" width="320" height="6" rx="3" fill="url(#bar)"/>
  <text x="${TEXT_X + 4}" y="524" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="30" fill="#22c55e">richkuo.com</text>
</svg>`;

const mask = Buffer.from(
  `<svg width="${AVATAR}" height="${AVATAR}"><circle cx="${AVATAR / 2}" cy="${AVATAR / 2}" r="${AVATAR / 2}" fill="#fff"/></svg>`,
);
const avatar = await sharp(`${root}/src/assets/profile.jpg`)
  .resize(AVATAR, AVATAR, { fit: "cover" })
  .composite([{ input: mask, blend: "dest-in" }])
  .png()
  .toBuffer();

const home = await sharp(Buffer.from(homeBackground))
  .composite([{ input: avatar, left: AVATAR_X, top: AVATAR_Y }])
  .png()
  .toBuffer();
writeFileSync(`${root}/public/og-home.png`, home);
console.log(`Wrote public/og-home.png (${W}x${H}, ${home.length} bytes)`);

// ---------- per-page cards (eyebrow + wrapped title) ----------
const PAD = 100;
const MAX_TEXT_W = W - PAD * 2;

function wrap(text, maxChars) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = w;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function pageCardSvg({ eyebrow, title }) {
  const len = title.length;
  const fontSize = len <= 12 ? 96 : len <= 30 ? 68 : 54;
  const maxChars = len <= 12 ? 16 : len <= 30 ? 20 : 26;
  const lineHeight = Math.round(fontSize * 1.16);
  const lines = wrap(title, maxChars);

  const firstBaseline = 268;
  const titleTspans = lines
    .map(
      (ln, i) =>
        `<tspan x="${PAD}" y="${firstBaseline + i * lineHeight}">${xmlEscape(ln)}</tspan>`,
    )
    .join("");

  return `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  ${defs}
  ${bgRects}
  <text x="${PAD}" y="150" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="30" letter-spacing="4" fill="#22c55e">${xmlEscape(eyebrow.toUpperCase())}</text>
  <text font-family="Helvetica, Arial, sans-serif" font-weight="800" font-size="${fontSize}" letter-spacing="-1.5" fill="#f5f5f5">${titleTspans}</text>
  <rect x="${PAD}" y="512" width="320" height="6" rx="3" fill="url(#bar)"/>
  <text x="${PAD}" y="566" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="30" fill="#22c55e">richkuo.com</text>
</svg>`;
}

const PAGE_CARDS = [
  { slug: "fableplan", eyebrow: "Claude Code Skill", title: "fableplan" },
  { slug: "kimi-k2-6-bugfix", eyebrow: "OpenClaw Guide", title: "OpenClaw Kimi K2.6 Bugfix" },
  {
    slug: "minimax-websearch-mcp-setup",
    eyebrow: "OpenClaw Guide",
    title: "MiniMax Web Search MCP Server Setup for OpenClaw",
  },
];

mkdirSync(`${root}/public/og`, { recursive: true });
for (const card of PAGE_CARDS) {
  const png = await svgToPng(pageCardSvg(card));
  writeFileSync(`${root}/public/og/${card.slug}.png`, png);
  console.log(`Wrote public/og/${card.slug}.png (${W}x${H}, ${png.length} bytes)`);
}
