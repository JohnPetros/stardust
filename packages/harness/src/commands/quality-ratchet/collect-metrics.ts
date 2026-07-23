import { collectBiomeWarnings } from './collectors/collect-biome-warnings'
import { collectCoverage } from './collectors/collect-coverage'
import { collectFileSize } from './collectors/collect-file-size'
import { collectTypeEscapes } from './collectors/collect-type-escapes'
import type { Metrics } from './define-metrics'
import type { WorkspaceConfig } from './get-workspace'

/** Roda todos os collectors e monta o conjunto de métricas do workspace. */
export function collectMetrics(workspace: WorkspaceConfig): Metrics {
  console.log('→ Biome warnings...')
  const biomeWarnings = collectBiomeWarnings(workspace)

  console.log('→ Escape hatches de tipo...')
  const typeEscapes = collectTypeEscapes(workspace)

  console.log('→ Tamanho de arquivos...')
  const fileSize = collectFileSize(workspace)

  let coverage: Metrics['coverage'] = {}
  if (workspace.measureCoverage === false) {
    console.log('→ Cobertura desabilitada para este workspace (pulando Jest).')
  } else {
    console.log('→ Cobertura por camada (rodando Jest)...')
    coverage = collectCoverage(workspace)
  }

  return { biomeWarnings, typeEscapes, fileSize, coverage }
}
