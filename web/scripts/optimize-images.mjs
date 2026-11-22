/**
 * Pre-renders a source photo into responsive AVIF + WebP variants for <Photo>:
 *   public/img/<name>-{640,1024}.{avif,webp}
 *
 * Usage: npm run images -- <source.jpg|png|heic…> <name>
 * e.g.   npm run images -- ~/Desktop/portrait.jpg lawyer-portrait
 */
import sharp from 'sharp';

const [source, name] = process.argv.slice(2);
if (!source || !name) {
  console.error('Usage: npm run images -- <source> <name>');
  process.exit(1);
}

const WIDTHS = [640, 1024];
const input = await sharp(source).rotate().toBuffer(); // apply EXIF orientation once

for (const width of WIDTHS) {
  const resized = sharp(input).resize({ width, withoutEnlargement: true });
  const base = `public/img/${name}-${width}`;
  const [avif, webp] = await Promise.all([
    resized.clone().avif({ quality: 50, effort: 6 }).toFile(`${base}.avif`),
    resized.clone().webp({ quality: 72, effort: 6 }).toFile(`${base}.webp`),
  ]);
  console.log(`${base}: ${avif.width}x${avif.height} avif ${(avif.size / 1024).toFixed(0)}KB, webp ${(webp.size / 1024).toFixed(0)}KB`);
}
