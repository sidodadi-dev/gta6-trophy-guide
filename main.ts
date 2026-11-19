// Leonida Nights — our entry for gta6-trophy-guide-01 (Node 22, standard library only).
// The guide is this directory's app/ folder: plain static files a browser opens at
// app/index.html (HTML, CSS and one classic script, no build step), fully offline — it
// loads nothing over the network. app/data/trophies.json carries the official 55
// PlayStation 5 trophies for Grand Theft Auto VI (names, descriptions and grades exactly
// as published) plus, for each one, a guide written for this entry in our own words, its
// kind, a missable flag, its roadmap stage, progress-counter targets where PlayStation
// tracks a count, and its cited sources; it also carries the five-stage roadmap to the
// platinum. The app is a tracker as well as a guide: ticks and counters persist in
// localStorage, progress exports/imports as JSON, and filters (kind, missable, grade,
// search), a spoiler shield for story trophies and a roadmap view are built in.
//
// This program hands the entry in: it copies app/ and screenshots/ from beside this file
// to /output and writes /output/dossier.json, the summary the judge reads, with the
// vendored make.fun library. vendor/makefun-frontend.ts is left exactly as the kit ships
// it: the scorer requires dossier.json to be byte for byte what its own copy writes.
//
// Serve the guide locally with `node serve.ts`, then open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the bytes; the others refuse an entry the
// scorer would refuse (more than 4 screenshots or one over 256 KiB; more than 993 files and directories in app/ or
// 48 MiB of app files: app/ counts beside /output's own 1000-entry cap, its screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 }),
);
