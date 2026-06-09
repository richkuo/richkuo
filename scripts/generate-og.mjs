// Generates public/og-home.png — the 1200x630 social share card for the homepage.
// Matches the site identity: dark background, drifting color glow, rainbow name,
// circular avatar. Run with: bun scripts/generate-og.mjs
import sharp from "sharp";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const W = 1200;
const H = 630;

const AVATAR = 264;
const AVATAR_X = 120;
const AVATAR_Y = Math.round((H - AVATAR) / 2);
const TEXT_X = 444;

const background = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
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
  </defs>

  <rect width="${W}" height="${H}" fill="#0d0d10"/>
  <rect width="${W}" height="${H}" fill="url(#glowA)"/>
  <rect width="${W}" height="${H}" fill="url(#glowB)"/>
  <rect width="${W}" height="${H}" fill="url(#glowC)"/>

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

const out = await sharp(Buffer.from(background))
  .composite([{ input: avatar, left: AVATAR_X, top: AVATAR_Y }])
  .png()
  .toBuffer();

writeFileSync(`${root}/public/og-home.png`, out);
console.log(`Wrote public/og-home.png (${W}x${H}, ${out.length} bytes)`);
