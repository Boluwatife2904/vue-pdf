/**
 * Renders public/favicon.svg into the raster icons browsers ask for.
 *
 * The .ico bundles 16/32/48px so Windows and older browsers pick a crisp size
 * rather than downscaling one bitmap. Modern browsers prefer favicon.svg.
 * Run via `pnpm docs:favicon`.
 */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import { Resvg } from '@resvg/resvg-js';

const dirname = path.dirname(url.fileURLToPath(import.meta.url));
const publicDir = path.resolve(dirname, '..', 'public');
const svg = fs.readFileSync(path.join(publicDir, 'favicon.svg'), 'utf8');

const png = (size) =>
  new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng();

/** Minimal ICO writer. Each entry embeds a PNG, which every ICO reader since Vista accepts. */
const buildIco = (images) => {
  const HEADER = 6;
  const ENTRY = 16;
  const header = Buffer.alloc(HEADER);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);

  let offset = HEADER + ENTRY * images.length;
  const entries = [];

  for (const { size, data } of images) {
    const entry = Buffer.alloc(ENTRY);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width (0 means 256)
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += data.length;
  }

  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
};

const icoSizes = [16, 32, 48];
const ico = buildIco(icoSizes.map((size) => ({ size, data: png(size) })));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), ico);

// Apple devices ignore .ico and want an opaque square.
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png(180));

console.log(
  `favicon.ico          ${icoSizes.join('/')}px, ${(ico.length / 1024).toFixed(1)} kB`,
);
console.log('apple-touch-icon.png 180px');
