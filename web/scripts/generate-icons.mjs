/**
 * Generates PNG favicon, apple-touch-icon and the OG image from the emblem SVG.
 * Run manually after changing the brand: node scripts/generate-icons.mjs
 */
import { readFileSync } from 'node:fs';
import sharp from 'sharp';

const GOLD = '#cc8800';
const INK = '#111c31';

const emblemPath = readFileSync('public/favicon.svg', 'utf8').match(/<path d="([^"]+)"/)[1];

const emblemSvg = (size, color, pad = 0) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${-pad} ${-pad} ${322 + 2 * pad} ${321 + 2 * pad}">
  <g transform="translate(20,301) scale(0.0876,-0.0876)" fill="${color}" stroke="none">
    <path d="${emblemPath}"/>
  </g>
</svg>`;

// Transparent favicon PNG (gold emblem, no background box)
await sharp(Buffer.from(emblemSvg(96, GOLD))).resize(96, 96).png().toFile('public/favicon.png');

// Apple touch icon: opaque ink background required
const apple = `
<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <rect width="180" height="180" fill="${INK}"/>
  <g transform="translate(29,151) scale(0.0424,-0.0424)" fill="${GOLD}" stroke="none">
    <path d="${emblemPath}"/>
  </g>
</svg>`;
await sharp(Buffer.from(apple)).png().toFile('public/apple-touch-icon.png');

// OG image 1200x630
const og = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${INK}"/>
  <rect x="24" y="24" width="1152" height="582" fill="none" stroke="${GOLD}" stroke-opacity="0.5" stroke-width="2"/>
  <rect x="34" y="34" width="1132" height="562" fill="none" stroke="${GOLD}" stroke-opacity="0.3" stroke-width="1"/>
  <g transform="translate(80,470) scale(0.115,-0.115)" fill="${GOLD}" stroke="none">
    <path d="${emblemPath}"/>
  </g>
  <text x="480" y="270" font-family="Georgia, serif" font-size="64" fill="#ffffff">Адвокатське бюро</text>
  <text x="480" y="360" font-family="Georgia, serif" font-size="64" fill="${GOLD}">Марина В.Г.</text>
  <text x="480" y="430" font-family="Arial, sans-serif" font-size="30" fill="#ffffffb0">Юридичний захист · Ужгород</text>
</svg>`;
await sharp(Buffer.from(og)).png().toFile('public/og.png');

console.log('generated: favicon.png, apple-touch-icon.png, og.png');
