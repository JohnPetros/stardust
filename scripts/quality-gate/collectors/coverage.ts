import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

import { fromRepoRoot, type WorkspaceConfig } from '../config'
import type { LayerCoverage, Metrics } from '../types'

type IstanbulMetric = { total: number; covered: number }
type IstanbulFileSummary = { lines: IstanbulMetric; branches: IstanbulMetric }
type CoverageSummary = Record<string, IstanbulFileSummary>

/** Arredonda para 2 casas, evitando ruído de ponto flutuante entre execuções. */
function round2(value: number): number {
  return Math.round(value * 100) / 100
}

/**
 * Roda o Jest com cobertura e agrupa o relatório por camada arquitetural.
 *
 * Em vez de um número único por workspace, exigimos cobertura por camada: o
 * domínio (lógica pura) deve ser mais coberto que a borda. A catraca congela
 * o percentual atual de cada camada — ele só pode subir.
 */
export function collectCoverage(workspace: WorkspaceConfig): Metrics['coverage'] {
  const { resolveLayer } = workspace
  if (!resolveLayer) {
    throw new Error(`Workspace "${workspace.name}" mede cobertura mas não define resolveLayer.`)
  }
  const workspaceRoot = fromRepoRoot(workspace.dir)

  execFileSync(
    'npx',
    [
      'jest',
      '--coverage',
      '--coverageReporters=json-summary',
      `--collectCoverageFrom=${workspace.srcDir}/**/*.ts`,
      `--collectCoverageFrom=!${workspace.srcDir}/**/*.test.ts`,
      '--silent',
      ...(workspace.coverageJestArgs ?? []),
    ],
    { cwd: workspaceRoot, encoding: 'utf8', stdio: ['ignore', 'ignore', 'inherit'] },
  )

  const summaryPath = path.join(workspaceRoot, 'coverage', 'coverage-summary.json')
  const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8')) as CoverageSummary

  type Accumulator = { lc: number; lt: number; bc: number; bt: number }
  const layers = new Map<string, Accumulator>()

  for (const [absolutePath, fileSummary] of Object.entries(summary)) {
    if (absolutePath === 'total') continue
    const relativePath = path.relative(workspaceRoot, absolutePath).split(path.sep).join('/')
    const layer = resolveLayer(relativePath)
    if (!layer) continue

    const acc = layers.get(layer) ?? { lc: 0, lt: 0, bc: 0, bt: 0 }
    acc.lc += fileSummary.lines.covered
    acc.lt += fileSummary.lines.total
    acc.bc += fileSummary.branches.covered
    acc.bt += fileSummary.branches.total
    layers.set(layer, acc)
  }

  const coverage: Record<string, LayerCoverage> = {}
  for (const [layer, acc] of [...layers.entries()].sort()) {
    coverage[layer] = {
      lines: acc.lt ? round2((100 * acc.lc) / acc.lt) : 100,
      branches: acc.bt ? round2((100 * acc.bc) / acc.bt) : 100,
    }
  }

  return coverage
}
