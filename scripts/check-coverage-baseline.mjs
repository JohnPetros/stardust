import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const baselinePath = resolve(root, "coverage-baseline.json");
const baseline = JSON.parse(readFileSync(baselinePath, "utf8"));
const workspaces =
  process.argv.slice(2).length > 0
    ? process.argv.slice(2)
    : Object.keys(baseline);
const metrics = ["lines", "statements", "functions", "branches"];
let failed = false;

for (const workspace of workspaces) {
  const expected = baseline[workspace];
  if (!expected) {
    console.error(`[coverage] Missing baseline for ${workspace}`);
    failed = true;
    continue;
  }

  const summaryPath = resolve(root, expected.summary);
  if (!existsSync(summaryPath)) {
    console.error(
      `[coverage] Missing report for ${workspace}: ${expected.summary}`,
    );
    failed = true;
    continue;
  }

  const summary = JSON.parse(readFileSync(summaryPath, "utf8")).total;
  for (const metric of metrics) {
    const actual = summary?.[metric]?.pct;
    const minimum = expected[metric];
    if (typeof actual !== "number" || typeof minimum !== "number") {
      console.error(`[coverage] Invalid ${metric} data for ${workspace}`);
      failed = true;
      continue;
    }
    if (actual + 1e-9 < minimum) {
      console.error(
        `[coverage] ${workspace} ${metric} decreased: ${actual.toFixed(2)}% < baseline ${minimum.toFixed(2)}%`,
      );
      failed = true;
    } else {
      console.log(
        `[coverage] ${workspace} ${metric}: ${actual.toFixed(2)}% (baseline ${minimum.toFixed(2)}%)`,
      );
    }
  }
}

if (failed) {
  console.error(
    "[coverage] Baseline ratchet failed. Improve coverage or update the baseline through review.",
  );
  process.exit(1);
}
