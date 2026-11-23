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

import { copyFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const source = new URL('./entry.png', import.meta.url);
if (!existsSync(source)) {
  throw new Error('entry.png is missing beside main.ts');
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
copyFileSync(source, join(outDir, 'entry.png'));
