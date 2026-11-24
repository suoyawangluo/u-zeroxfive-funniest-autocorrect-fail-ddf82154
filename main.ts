// Funniest Autocorrect Fail — make.fun entry
// Writes one line, under 200 characters, that reads as a hilarious
// autocorrect fail: a dinner text where "dinner" became "divorce".
// The slip is the joke: the sender casually announces a divorce the
// way you would announce dinner, then asks for a plate to be saved.
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const ENTRY =
  "I'll be home for divorce at 6, save me a plate. Love you!";

// Gate (from the kit's RULES.txt): /output/entry.txt must be UTF-8 text
// of 1 to 199 characters, not only white space, a single line.
function checkGate(text: string): void {
  const codePoints = [...text].length;
  if (codePoints < 1 || codePoints > 199) {
    throw new Error(`gate failed: ${codePoints} code points, need 1-199`);
  }
  if (text.trim().length === 0) {
    throw new Error("gate failed: entry is only white space");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("gate failed: entry must be a single line");
  }
}

checkGate(ENTRY);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY + "\n", "utf8");

// Read back and verify: the file on disk must hold exactly the entry.
const onDisk = readFileSync(outPath, "utf8").replace(/\n$/, "");
if (onDisk !== ENTRY) {
  throw new Error("read-back mismatch: file does not hold the entry");
}
const contentSha = createHash("sha256").update(ENTRY, "utf8").digest("hex");
const fileSha = createHash("sha256")
  .update(readFileSync(outPath))
  .digest("hex");

console.log(
  `wrote ${outPath} (${[...ENTRY].length} code points, content sha256 ${contentSha}, file sha256 ${fileSha}), gate passes`,
);
console.log(`verified: ${JSON.stringify(ENTRY)}`);
