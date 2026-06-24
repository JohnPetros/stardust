import fs from 'node:fs'
import path from 'node:path'

import { collectMetrics } from './collect'
import { compare } from './compare'
import { getWorkspace } from './config'
import { buildReport } from './report'
import type { Baseline } from './types'

/**
 * CLI da catraca de qualidade.
 *
 *   tsx scripts/quality-gate/index.ts --workspace=core
 *   tsx scripts/quality-gate/index.ts --workspace=core --update-baseline
 *
 * Sem `--update-baseline`: compara com o baseline e sai com código 1 se algo
 * piorou (trava o PR). Com `--update-baseline`: congela o estado atual.
 */
function parseArgs(argv: string[]): { workspace: string; updateBaseline: boolean } {
  let workspace = ''
  let updateBaseline = false
  for (const arg of argv) {
    if (arg.startsWith('--workspace=')) workspace = arg.slice('--workspace='.length)
    else if (arg === '--update-baseline') updateBaseline = true
  }
  if (!workspace) {
    throw new Error('Uso: --workspace=<nome> [--update-baseline]')
  }
  return { workspace, updateBaseline }
}

function baselinePath(workspaceKey: string): string {
  return path.join(__dirname, 'baselines', `${workspaceKey}.json`)
}

function writeStepSummary(markdown: string): void {
  const summaryFile = process.env.GITHUB_STEP_SUMMARY
  if (summaryFile) fs.appendFileSync(summaryFile, `${markdown}\n`)
}

function main(): void {
  const { workspace: workspaceKey, updateBaseline } = parseArgs(process.argv.slice(2))
  const workspace = getWorkspace(workspaceKey)

  console.log(`Quality Gate · ${workspace.name}\n`)
  const metrics = collectMetrics(workspace)

  if (updateBaseline) {
    const baseline: Baseline = {
      workspace: workspace.name,
      generatedAt: new Date().toISOString().slice(0, 10),
      metrics,
    }
    const file = baselinePath(workspaceKey)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, `${JSON.stringify(baseline, null, 2)}\n`)
    console.log(`\n✅ Baseline congelado em baselines/${workspaceKey}.json`)
    return
  }

  const file = baselinePath(workspaceKey)
  if (!fs.existsSync(file)) {
    throw new Error(`Baseline ausente: ${file}. Gere com --update-baseline.`)
  }
  const baseline = JSON.parse(fs.readFileSync(file, 'utf8')) as Baseline

  const violations = compare(metrics, baseline)
  const report = buildReport(metrics, baseline, violations)
  console.log(`\n${report}`)
  writeStepSummary(report)

  if (violations.length > 0) {
    console.error(`\n❌ Quality gate falhou: ${violations.length} regressão(ões).`)
    process.exit(1)
  }
  console.log('\n✅ Quality gate passou.')
}

main()
