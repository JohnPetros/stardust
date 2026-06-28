import type { Baseline, Metrics, Violation } from './types'

/** Tolerância para comparação de cobertura (absorve ruído de 2ª casa decimal). */
const COVERAGE_EPSILON = 0.01

/**
 * Compara as métricas atuais com o baseline congelado e retorna as regressões.
 *
 * Regra de ouro (catraca): nada pode piorar. Cada métrica só pode empatar ou
 * melhorar. Lista vazia = PR passa no gate.
 */
export function compare(current: Metrics, baseline: Baseline): Violation[] {
  const violations: Violation[] = []
  const base = baseline.metrics

  // 1. Warnings do Biome não podem aumentar.
  if (current.biomeWarnings > base.biomeWarnings) {
    violations.push({
      metric: 'Biome warnings',
      detail: 'novos warnings introduzidos',
      baseline: String(base.biomeWarnings),
      current: String(current.biomeWarnings),
    })
  }

  // 2. Escape hatches de tipo não podem aumentar.
  if (current.typeEscapes.total > base.typeEscapes.total) {
    violations.push({
      metric: 'Escape hatches de tipo',
      detail: `any=${current.typeEscapes.any} ts-ignore=${current.typeEscapes.tsIgnore}`,
      baseline: String(base.typeEscapes.total),
      current: String(current.typeEscapes.total),
    })
  }

  // 3. Tamanho de arquivo: nenhum offender novo e nenhum offender existente cresce.
  for (const [file, lines] of Object.entries(current.fileSize.offenders)) {
    const baselineLines = base.fileSize.offenders[file]
    if (baselineLines === undefined) {
      violations.push({
        metric: 'Tamanho de arquivo',
        detail: `${file} cruzou o limite de ${current.fileSize.limit} linhas`,
        baseline: `≤ ${current.fileSize.limit}`,
        current: String(lines),
      })
    } else if (lines > baselineLines) {
      violations.push({
        metric: 'Tamanho de arquivo',
        detail: `${file} cresceu`,
        baseline: String(baselineLines),
        current: String(lines),
      })
    }
  }

  // 4. Cobertura: nenhuma camada do baseline pode cair.
  for (const [layer, baseCoverage] of Object.entries(base.coverage)) {
    const currentCoverage = current.coverage[layer]
    if (!currentCoverage) {
      violations.push({
        metric: 'Cobertura',
        detail: `camada "${layer}" sumiu do relatório`,
        baseline: `lines ${baseCoverage.lines}%`,
        current: 'ausente',
      })
      continue
    }
    if (currentCoverage.lines < baseCoverage.lines - COVERAGE_EPSILON) {
      violations.push({
        metric: 'Cobertura (lines)',
        detail: `camada "${layer}"`,
        baseline: `${baseCoverage.lines}%`,
        current: `${currentCoverage.lines}%`,
      })
    }
    if (currentCoverage.branches < baseCoverage.branches - COVERAGE_EPSILON) {
      violations.push({
        metric: 'Cobertura (branches)',
        detail: `camada "${layer}"`,
        baseline: `${baseCoverage.branches}%`,
        current: `${currentCoverage.branches}%`,
      })
    }
  }

  return violations
}
