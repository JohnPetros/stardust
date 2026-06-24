import type { Baseline, Metrics, Violation } from './types'

/**
 * Gera o sumário em Markdown comparando métricas atuais com o baseline.
 *
 * É o que o agente de babysit lê no PR para saber o que corrigir: cada linha
 * mostra métrica, baseline e valor atual, e a seção de violações detalha as
 * regressões que travam o merge.
 */
export function buildReport(
  current: Metrics,
  baseline: Baseline,
  violations: Violation[],
): string {
  const base = baseline.metrics
  const passed = violations.length === 0
  const lines: string[] = []

  lines.push(`## Quality Gate — ${baseline.workspace}`)
  lines.push('')
  lines.push(passed ? '✅ **Passou** — nenhuma métrica piorou.' : `❌ **Falhou** — ${violations.length} regressão(ões).`)
  lines.push('')
  lines.push(`Baseline congelado em \`${baseline.generatedAt}\`.`)
  lines.push('')

  lines.push('### Métricas')
  lines.push('')
  lines.push('| Métrica | Baseline | Atual | Status |')
  lines.push('| --- | --- | --- | --- |')
  lines.push(row('Biome warnings', base.biomeWarnings, current.biomeWarnings, current.biomeWarnings <= base.biomeWarnings))
  lines.push(row('Escape hatches de tipo', base.typeEscapes.total, current.typeEscapes.total, current.typeEscapes.total <= base.typeEscapes.total))
  lines.push(
    row(
      `Arquivos > ${base.fileSize.limit} linhas`,
      Object.keys(base.fileSize.offenders).length,
      Object.keys(current.fileSize.offenders).length,
      !violations.some((v) => v.metric === 'Tamanho de arquivo'),
    ),
  )

  for (const [layer, baseCoverage] of Object.entries(base.coverage)) {
    const currentCoverage = current.coverage[layer]
    const ok =
      currentCoverage !== undefined &&
      currentCoverage.lines >= baseCoverage.lines - 0.01 &&
      currentCoverage.branches >= baseCoverage.branches - 0.01
    lines.push(
      row(
        `Cobertura \`${layer}\` (lines/branches)`,
        `${baseCoverage.lines}% / ${baseCoverage.branches}%`,
        currentCoverage ? `${currentCoverage.lines}% / ${currentCoverage.branches}%` : 'ausente',
        ok,
      ),
    )
  }

  if (!passed) {
    lines.push('')
    lines.push('### Regressões')
    lines.push('')
    lines.push('| Métrica | Detalhe | Baseline | Atual |')
    lines.push('| --- | --- | --- | --- |')
    for (const violation of violations) {
      lines.push(`| ${violation.metric} | ${violation.detail} | ${violation.baseline} | ${violation.current} |`)
    }
    lines.push('')
    lines.push('> A catraca só anda num sentido: corrija as regressões acima ou, se for melhoria intencional do baseline, rode com `--update-baseline`.')
  }

  lines.push('')
  return lines.join('\n')
}

function row(metric: string, baseline: number | string, current: number | string, ok: boolean): string {
  return `| ${metric} | ${baseline} | ${current} | ${ok ? '✅' : '❌'} |`
}
