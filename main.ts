// One Word From Grandma — entry writer.
//
// Grandma's verdict on the machine that thinks it knows everything:
// one word, written to $MAKEFUN_OUTPUT_DIR/entry.txt (or /output/entry.txt
// when the variable is unset), then read back and checked byte for byte.
// Runs on Node 22 with the standard library only; no network, no secrets.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The word itself. Grandma has met the robot, and she has made up her mind:
// it is a smartypants — clever, smug, and in need of a telling-off.
const GRANDMAS_WORD = "Smartypants";

// The competition gate: 1 to 30 characters, exactly one word, and not only
// white space. Letters only keeps it a plain word — no punctuation tricks,
// no sentence smuggled in, nothing the judge would read as an explanation.
const GATE_MIN = 1;
const GATE_MAX = 30;
const PLAIN_WORD = /^[A-Za-z]+$/;

function fail(reason: string): never {
  throw new Error(`entry rejected: ${reason}`);
}

// Checks the word before anything is written, so a bad entry fails loudly
// here instead of shipping a file the gate would refuse.
function checkWord(word: string): void {
  if (!PLAIN_WORD.test(word)) {
    fail(`must be one plain word of letters only, got ${JSON.stringify(word)}`);
  }
  if (word.length < GATE_MIN || word.length > GATE_MAX) {
    fail(
      `must be ${GATE_MIN} to ${GATE_MAX} characters, got ${word.length}`,
    );
  }
  if (word.trim().length === 0) {
    fail("must not be only white space");
  }
}

function writeEntry(word: string): string {
  const folder = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(folder, { recursive: true });
  const target = join(folder, "entry.txt");
  writeFileSync(target, word, "utf8");
  return target;
}

function confirmWritten(path: string, expected: string): void {
  if (!existsSync(path)) {
    fail(`expected ${path} to exist after writing`);
  }
  const back = readFileSync(path, "utf8");
  if (back !== expected) {
    fail(`contents of ${path} do not match the entry`);
  }
}

function run(): void {
  checkWord(GRANDMAS_WORD);
  console.log(
    `entry is ${GRANDMAS_WORD.length} characters, a single word: ${GRANDMAS_WORD}`,
  );
  const path = writeEntry(GRANDMAS_WORD);
  confirmWritten(path, GRANDMAS_WORD);
  console.log(
    `gate: ${GRANDMAS_WORD.length} chars within ${GATE_MIN}-${GATE_MAX}, ` +
      `1 word, letters only — pass`,
  );
  console.log(`wrote ${path} and confirmed the contents match`);
}

run();
