/**
 * Tipos compartilhados pela catraca de qualidade (quality gate).
 *
 * O baseline congela o estado atual de cada métrica; um PR só passa se as
 * métricas empatarem ou melhorarem em relação a ele. Nunca podem piorar.
 */

/** Cobertura de uma camada arquitetural (em porcentagem, 2 casas). */
export type LayerCoverage = {
  lines: number
  branches: number
}

/** Conjunto de métricas coletadas de um workspace. */
export type Metrics = {
  /** Diagnostics de severidade "warn" do Biome (hoje invisíveis no CI). */
  biomeWarnings: number
  /** Escape hatches de tipagem que entram silenciosos num projeto TS. */
  typeEscapes: {
    any: number
    tsIgnore: number
    total: number
  }
  /** Arquivos acima do limite de linhas, mapa caminho -> LOC. */
  fileSize: {
    limit: number
    offenders: Record<string, number>
  }
  /** Cobertura agrupada por camada (domain, use-cases, ...). */
  coverage: Record<string, LayerCoverage>
}

/** Arquivo de baseline congelado, um por workspace. */
export type Baseline = {
  workspace: string
  generatedAt: string
  metrics: Metrics
}

/** Uma regressão detectada na comparação com o baseline. */
export type Violation = {
  metric: string
  detail: string
  baseline: string
  current: string
}
