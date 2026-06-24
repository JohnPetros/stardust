import type { WorkspaceConfig } from './config'
import { collectBiomeWarnings } from './collectors/biome-warnings'
import { collectCoverage } from './collectors/coverage'
import { collectFileSize } from './collectors/file-size'
import { collectTypeEscapes } from './collectors/type-escapes'
import type { Metrics } from './types'

/** Roda todos os collectors e monta o conjunto de métricas do workspace. */
export function collectMetrics(workspace: WorkspaceConfig): Metrics {
  console.log('→ Biome warnings...')
  const biomeWarnings = collectBiomeWarnings(workspace)

  console.log('→ Escape hatches de tipo...')
  const typeEscapes = collectTypeEscapes(workspace)

  console.log('→ Tamanho de arquivos...')
  const fileSize = collectFileSize(workspace)

  console.log('→ Cobertura por camada (rodando Jest)...')
  const coverage = collectCoverage(workspace)

  return { biomeWarnings, typeEscapes, fileSize, coverage }
}
