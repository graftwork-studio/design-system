/**
 * Runs the contrast validator and the chart series validator, and exits with
 * code 1 if anything fails. Pass --verbose to list every pair, not just the
 * failures.
 */
import { validateAll } from "../src/contrast.ts";
import { validateSeries } from "../src/series.ts";

const verbose = process.argv.includes("--verbose");
const { failures, pairs } = await validateAll();
const series = await validateSeries();

if (verbose) {
  for (const p of pairs) {
    const mark = p.pass ? "pass" : "FAIL";
    console.log(`${mark}  ${p.theme.padEnd(13)} ${p.token.padEnd(32)} on ${p.on.padEnd(30)} ${p.ratio.toFixed(2).padStart(5)} / ${p.required}`);
  }
  console.log("");
  for (const p of series.pairs) {
    const mark = p.pass ? "pass" : "FAIL";
    console.log(`${mark}  ${p.theme.padEnd(13)} ${p.a.padEnd(32)} vs ${p.b.padEnd(30)} ${p.vision.padEnd(12)} ΔE ${p.deltaE.toFixed(1).padStart(5)} / ${p.required}`);
  }
}

if (failures.length > 0) {
  console.error(`\nContrast validation failed: ${failures.length} problem(s).\n`);
  for (const f of failures) console.error(`  [${f.theme}] ${f.token} ${f.message}`);
}
if (series.failures.length > 0) {
  console.error(`\nChart series validation failed: ${series.failures.length} problem(s).\n`);
  for (const f of series.failures) console.error(`  [${f.theme}] ${f.token} ${f.message}`);
}
if (failures.length > 0 || series.failures.length > 0) process.exit(1);

console.log(`Contrast validation passed: ${pairs.length} pairs across 3 themes.`);
console.log(`Chart series validation passed: ${series.pairs.length} pairs across 3 themes and 4 kinds of vision.`);
