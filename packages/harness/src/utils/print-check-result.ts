import type { CheckResult } from './create-check-result'

export function printResult(result: CheckResult): void {
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)
  if (!result.passed) process.exitCode = 1
}
