// Entry for "Promote make.fun's make-your-own-bounty post on X" (Node 22, stdlib only).
// The post on X is the real entry — one quote of make.fun's post with our own photo,
// make.fun / @makefunai and the play code in its text. This program's only job is to
// hand the post's address to the gate: copy POST.json from the repository root to
// /output/POST.json, then read the copy back and check it is byte-for-byte the same
// file, so a half-written or truncated copy can never pass as a valid hand-in.
// POST.json still holds the starter's placeholder address until the post is up on X;
// replace it with the real post URL before submitting.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

try {
  mkdirSync(OUTPUT_DIR, { recursive: true });
} catch (err) {
  console.error(`Could not create output directory ${OUTPUT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}

const source = join(BOT_DIR, 'POST.json');
const target = join(OUTPUT_DIR, 'POST.json');

// Validate the address before handing it to the gate: parse POST.json and
// require a real X status URL, so a placeholder or broken address can never
// be copied through as a valid hand-in.
let postUrl: string;
try {
  const parsed = JSON.parse(readFileSync(source, 'utf8')) as { url?: unknown };
  const extraKeys = Object.keys(parsed).filter((key) => key !== 'url');
  if (extraKeys.length > 0) {
    console.error(`POST.json has unexpected keys: ${extraKeys.join(', ')}`);
    process.exit(1);
  }
  if (typeof parsed.url !== 'string' || parsed.url.length === 0) {
    console.error(`POST.json url is missing or empty: ${JSON.stringify(parsed.url)}`);
    process.exit(1);
  }
  const match = /^https:\/\/x\.com\/([A-Za-z0-9_]+)\/status\/(\d+)$/.exec(parsed.url);
  if (!match) {
    console.error(`POST.json url is not an X status URL (expected https://x.com/<handle>/status/<digits>): ${parsed.url}`);
    process.exit(1);
  }
  postUrl = parsed.url;
} catch (err) {
  console.error(`POST.json could not be read or parsed: ${(err as Error).message}`);
  process.exit(1);
}

try {
  copyFileSync(source, target);
} catch (err) {
  console.error(`POST.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}

// Read the copy back and confirm it matches the source byte for byte; a truncated
// or partial write must fail loudly instead of handing the gate a broken file.
try {
  const written = readFileSync(target);
  const original = readFileSync(source);
  if (!written.equals(original)) {
    console.error(`POST.json copy mismatch: ${target} differs from ${source}`);
    process.exit(1);
  }
} catch (err) {
  console.error(`POST.json could not be verified after copying: ${(err as Error).message}`);
  process.exit(1);
}
console.log(`POST.json copied to ${target} and verified byte-for-byte.`);
