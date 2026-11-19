/**
 * Runs the contrast validator and exits with code 1 if any pair fails.
 * Pass --verbose to list every pair, not just the failures.
 */
import { validateAll } from "../src/contrast.ts";

const verbose = process.argv.includes("--verbose");
const { failures, pairs } = await validateAll();

if (verbose) {
  for (const p of pairs) {
    const mark = p.pass ? "pass" : "FAIL";
    console.log(`${mark}  ${p.theme.padEnd(13)} ${p.token.padEnd(32)} on ${p.on.padEnd(30)} ${p.ratio.toFixed(2).padStart(5)} / ${p.required}`);
  }
}

if (failures.length > 0) {
  console.error(`\nContrast validation failed: ${failures.length} problem(s).\n`);
  for (const f of failures) console.error(`  [${f.theme}] ${f.token} ${f.message}`);
  process.exit(1);
}

console.log(`Contrast validation passed: ${pairs.length} pairs across 3 themes.`);
