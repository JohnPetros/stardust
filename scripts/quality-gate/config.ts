import path from 'node:path'

/**
 * Registro de workspaces cobertos pela catraca.
 *
 * Cada CI roda o gate apenas para o seu workspace (aproveitando o filtro de
 * `paths:` já existente nos workflows). Por isso a configuração é por workspace.
 */

export type LayerName = string

export type WorkspaceConfig = {
  /** Nome do pacote npm, usado em logs e no baseline. */
  name: string
  /** Caminho do workspace relativo à raiz do monorepo. */
  dir: string
  /** Diretório de código-fonte relativo a `dir`. */
  srcDir: string
  /** Limite de linhas por arquivo; acima disso vira "offender". */
  fileSizeLimit: number
  /**
   * Mapeia um caminho de arquivo (relativo ao workspace) para a camada usada na
   * cobertura. Retornar `null` exclui o arquivo da métrica de cobertura
   * (ex.: arquivos só de tipos, que não têm runtime relevante).
   */
  resolveLayer: (relativeFilePath: string) => LayerName | null
}

const REPO_ROOT = path.resolve(__dirname, '..', '..')

/** Resolve um caminho absoluto a partir da raiz do monorepo. */
export function fromRepoRoot(...segments: string[]): string {
  return path.join(REPO_ROOT, ...segments)
}

/**
 * Camadas do @stardust/core seguem a estrutura DDD:
 * src/<contexto>/<camada>/... onde camada ∈ {domain, use-cases, interfaces, factories}.
 * `interfaces` é só de tipos -> fora da cobertura. Demais arquivos caem em "other".
 */
function resolveCoreLayer(relativeFilePath: string): LayerName | null {
  const segments = relativeFilePath.split(path.sep)
  if (segments.includes('interfaces')) return null
  if (segments.includes('domain')) return 'domain'
  if (segments.includes('use-cases')) return 'use-cases'
  if (segments.includes('factories')) return 'factories'
  return 'other'
}

export const WORKSPACES: Record<string, WorkspaceConfig> = {
  core: {
    name: '@stardust/core',
    dir: 'packages/core',
    srcDir: 'src',
    fileSizeLimit: 300,
    resolveLayer: resolveCoreLayer,
  },
}

export function getWorkspace(key: string): WorkspaceConfig {
  const workspace = WORKSPACES[key]
  if (!workspace) {
    const known = Object.keys(WORKSPACES).join(', ')
    throw new Error(`Workspace desconhecido: "${key}". Disponíveis: ${known}`)
  }
  return workspace
}
