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
   * Quando `false`, a catraca não coleta cobertura para este workspace (e
   * `resolveLayer` é dispensável). Útil quando rodar a suíte exige
   * infraestrutura pesada (ex.: o `server`, cujos testes precisam de Supabase).
   * Default: `true`.
   */
  measureCoverage?: boolean
  /**
   * Exclui um arquivo (relativo ao workspace) de todas as métricas estáticas
   * — tamanho e escape hatches. Use para código gerado (ex.: tipos do
   * Supabase), que não é escrito à mão e distorceria a catraca.
   */
  isIgnored?: (relativeFilePath: string) => boolean
  /**
   * Mapeia um caminho de arquivo (relativo ao workspace) para a camada usada na
   * cobertura. Retornar `null` exclui o arquivo da métrica de cobertura
   * (ex.: arquivos só de tipos, que não têm runtime relevante).
   * Obrigatório quando `measureCoverage` não é `false`.
   */
  resolveLayer?: (relativeFilePath: string) => LayerName | null
  /**
   * Argumentos extras passados ao Jest na coleta de cobertura. Use para
   * restringir quais testes rodam — ex.: no server, medimos só a suíte unitária
   * (mocks, sem Supabase), ignorando os testes de rota que dependem de banco.
   */
  coverageJestArgs?: string[]
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

/** Caminho do arquivo de tipos gerado pelo `db:types` (Supabase). */
const SERVER_GENERATED_TYPES = path.join('src', 'database', 'supabase', 'types', 'Database.ts')

/**
 * Camadas do @stardust/server, do ponto de vista da suíte UNITÁRIA (mocks).
 *
 * Só ratcheamos o que os testes unitários exercem de fato: `ai` (tools),
 * `queue` (jobs) e `rest` (controllers). As camadas de infraestrutura —
 * `app` (routers Hono), `database` (repositories) e `provision` (adapters) —
 * só têm cobertura via testes de integração/rota, que ficam fora desta medição;
 * por isso saem da métrica (retornam `null`) em vez de congelar em 0%.
 * Tipos gerados, código de teste e fixtures também são excluídos.
 */
function resolveServerLayer(relativeFilePath: string): LayerName | null {
  const segments = relativeFilePath.split(path.sep)
  if (segments.includes('tests') || segments.includes('fixtures')) return null
  if (segments.includes('types')) return null
  const [, topLevel] = segments
  if (['app', 'database', 'provision'].includes(topLevel)) return null
  if (['ai', 'queue', 'rest'].includes(topLevel)) return topLevel
  return 'other'
}

/** No web, o `db:types` gera os tipos do Supabase neste caminho. */
const WEB_GENERATED_TYPES = path.join('src', 'api', 'supabase', 'types', 'Database.ts')
/** Conteúdo/seed de licões: dados autorais, não lógica — fora das métricas. */
const WEB_MOCKS_DIR = path.join('src', 'mocks') + path.sep

/** Primitivos de UI do shadcn: código vendorizado, não autoral — fora das métricas. */
const STUDIO_SHADCN_DIR = path.join('src', 'ui', 'shadcn') + path.sep

export const WORKSPACES: Record<string, WorkspaceConfig> = {
  core: {
    name: '@stardust/core',
    dir: 'packages/core',
    srcDir: 'src',
    fileSizeLimit: 300,
    resolveLayer: resolveCoreLayer,
  },
  server: {
    name: '@stardust/server',
    dir: 'apps/server',
    srcDir: 'src',
    fileSizeLimit: 300,
    // Cobertura medida só sobre a suíte unitária (mocks), sem Supabase: rápida,
    // determinística e roda no job da catraca sem subir banco. Os testes de rota
    // (`src/tests/routes`) e os de integração (routers) ficam de fora.
    resolveLayer: resolveServerLayer,
    coverageJestArgs: [
      '--selectProjects',
      'server',
      '--testPathIgnorePatterns',
      '/node_modules/',
      'src/app/hono/routers/',
      'src/tests/routes/',
    ],
    isIgnored: (relativeFilePath) => relativeFilePath === SERVER_GENERATED_TYPES,
  },
  web: {
    name: '@stardust/web',
    dir: 'apps/web',
    srcDir: 'src',
    fileSizeLimit: 300,
    // App Next.js: a suíte unitária roda em jsdom e depende de env de teste;
    // como no server, a Fase 3 congela só as métricas estáticas.
    measureCoverage: false,
    isIgnored: (relativeFilePath) =>
      relativeFilePath === WEB_GENERATED_TYPES || relativeFilePath.startsWith(WEB_MOCKS_DIR),
  },
  studio: {
    name: '@stardust/studio',
    dir: 'apps/studio',
    srcDir: 'src',
    fileSizeLimit: 300,
    // App React Router (admin), poucos testes só de UI: cobertura de baixo sinal,
    // como no web. Fase 4 congela só as métricas estáticas.
    measureCoverage: false,
    isIgnored: (relativeFilePath) => relativeFilePath.startsWith(STUDIO_SHADCN_DIR),
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
