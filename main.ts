// news-image-20261123 entry (Node 22, standard library only).
//
// The picture of the day is entry.png beside this file: a front page that sums
// up Monday 23 November 2026 — the COP31 collapse in Antalya as the lead, with
// the AI market sell-off, the sinking of the corvette Merkury and the US House
// result below the fold. This program's whole job is to put those exact bytes
// at /output/entry.png, identically on every run and with no network.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, readFileSync, renameSync } from 'node:fs';
import { join } from 'node:path';

const source = new URL('./entry.png', import.meta.url);
if (!existsSync(source)) {
  throw new Error('entry.png is missing beside main.ts');
}

// Check the committed picture against the bounty gate (a PNG of at most
// 1024x1024 and 1 MiB) before shipping it, so a bad asset fails here with a
// clear reason instead of failing silently at grading time. The IHDR width
// and height are big-endian uint32s at bytes 16 and 20 of the PNG.
const bytes = readFileSync(source);
const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
if (!PNG_SIGNATURE.every((b, i) => bytes[i] === b)) {
  throw new Error('entry.png is not a PNG file');
}
const width = bytes.readUInt32BE(16);
const height = bytes.readUInt32BE(20);
if (width > 1024 || height > 1024) {
  throw new Error(`entry.png is ${width}x${height}, over the 1024x1024 gate`);
}
if (bytes.length > 1024 * 1024) {
  throw new Error(`entry.png is ${bytes.length} bytes, over the 1 MiB gate`);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
// Copy to a scratch name and rename, so the grader never sees a
// half-copied entry.png if the copy is interrupted.
const scratch = join(outDir, '.entry.png.tmp');
copyFileSync(source, scratch);
renameSync(scratch, join(outDir, 'entry.png'));
