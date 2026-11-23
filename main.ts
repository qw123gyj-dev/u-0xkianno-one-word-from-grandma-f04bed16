// One Word From Grandma — entry writer (program/v1, Node 22, stdlib only).
// Writes the single word grandma would text about AI to
// $MAKEFUN_OUTPUT_DIR/entry.txt (fallback /output/entry.txt), then reads it
// back and verifies the bytes match.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const WORD = "Robothingy";

const MIN_CHARS = 1;
const MAX_CHARS = 30;

function main(): void {
  if (WORD.length < MIN_CHARS || WORD.length > MAX_CHARS) {
    throw new Error(
      `entry must be ${MIN_CHARS} to ${MAX_CHARS} characters, got ${WORD.length}`,
    );
  }
  if (WORD.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }

  // Exactly one word: no white space anywhere, and letters only — no
  // punctuation tricks, no sentence, no explanation.
  if (/\s/.test(WORD)) {
    throw new Error(`entry must be exactly one word, got ${JSON.stringify(WORD)}`);
  }
  if (!/^[A-Za-z]+$/.test(WORD)) {
    throw new Error(
      `entry must be one plain word (letters only), got ${JSON.stringify(WORD)}`,
    );
  }
  console.log(`entry length: ${WORD.length} characters, 1 word`);

  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, WORD, "utf8");

  const readBack = readFileSync(outPath, "utf8");
  if (readBack !== WORD) {
    throw new Error(`verification failed: ${outPath} does not match the entry`);
  }
  console.log(`wrote ${outPath} (${WORD.length} characters, 1 word, verified)`);
}

main();
