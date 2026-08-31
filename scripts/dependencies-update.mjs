import { execFileSync } from 'node:child_process'
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'

const NCU_VERSION = '19.1.1'
const REPORT_PATH =
  process.env.DEPENDENCIES_UPDATE_REPORT ?? 'dependencies-update-report.json'
const MARKDOWN_PATH =
  process.env.DEPENDENCIES_UPDATE_MARKDOWN ?? 'dependencies-update-pr.md'
const BASE_REF = process.env.DEPENDENCIES_UPDATE_BASE_REF
const isDryRun = process.env.DEPENDENCIES_UPDATE_DRY_RUN === '1'

const dependencySections = [
  'dependencies',
  'devDependencies',
  'optionalDependencies',
  'peerDependencies',
]

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function readJsonAtRef(ref, path) {
  try {
    return JSON.parse(
      execFileSync('git', ['show', `${ref}:${path}`], {
        cwd: process.cwd(),
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }),
    )
  } catch {
    return null
  }
}

function listWorkspaceManifests() {
  const manifests = ['package.json']

  for (const directory of ['apps', 'packages']) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        manifests.push(join(directory, entry.name, 'package.json'))
      }
    }
  }

  return manifests
}

function dependencyRanges(manifest) {
  const ranges = new Map()

  for (const section of dependencySections) {
    for (const [name, version] of Object.entries(manifest[section] ?? {})) {
      ranges.set(`${section}:${name}`, { name, section, version })
    }
  }

  return ranges
}

function runNcu(args, options = {}) {
  return execFileSync('npx', ['--yes', `npm-check-updates@${NCU_VERSION}`, ...args], {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: options.capture ? ['ignore', 'pipe', 'inherit'] : 'inherit',
    env: {
      ...process.env,
      NO_COLOR: '1',
    },
  })
}

function findEligibleUpdates(manifestPaths, before) {
  const updates = []

  for (const manifestPath of manifestPaths) {
    const output = runNcu(
      [
        '--packageFile',
        manifestPath,
        '--target',
        'minor',
        '--cooldown',
        '7d',
        '--jsonUpgraded',
      ],
      { capture: true },
    ).trim()
    const proposed = output ? JSON.parse(output) : {}
    const currentRanges = dependencyRanges(before.get(manifestPath))

    for (const [name, target] of Object.entries(proposed)) {
      const current = [...currentRanges.values()].find(
        (dependency) => dependency.name === name,
      )

      if (current) {
        updates.push({
          workspace: relative(process.cwd(), manifestPath),
          section: current.section,
          package: name,
          from: current.version,
          to: target,
        })
      }
    }
  }

  return updates
}

function findCommittedUpdates(baseRef, manifestPaths, current) {
  const updates = []

  for (const manifestPath of manifestPaths) {
    const baseManifest = readJsonAtRef(baseRef, manifestPath)
    if (!baseManifest) continue

    const baseRanges = dependencyRanges(baseManifest)
    const currentRanges = dependencyRanges(current.get(manifestPath))

    for (const [key, currentDependency] of currentRanges) {
      const baseDependency = baseRanges.get(key)
      if (baseDependency && baseDependency.version !== currentDependency.version) {
        updates.push({
          workspace: relative(process.cwd(), manifestPath),
          section: currentDependency.section,
          package: currentDependency.name,
          from: baseDependency.version,
          to: currentDependency.version,
          final: currentDependency.version,
        })
      }
    }
  }

  return updates
}

function classifyUpdates(eligibleUpdates, after) {
  const applied = []
  const rejected = []

  for (const update of eligibleUpdates) {
    const ranges = dependencyRanges(after.get(update.workspace))
    const finalVersion = ranges.get(`${update.section}:${update.package}`)?.version
    const result = { ...update, final: finalVersion ?? update.from }

    if (finalVersion === update.to) {
      applied.push(result)
    } else {
      rejected.push(result)
    }
  }

  return { applied, rejected }
}

function groupByWorkspace(updates) {
  return Map.groupBy(updates, (update) => update.workspace)
}

function renderUpdateList(updates, emptyMessage) {
  if (updates.length === 0) return emptyMessage

  const lines = []
  for (const [workspace, workspaceUpdates] of groupByWorkspace(updates)) {
    lines.push(`#### \`${workspace}\``)
    lines.push('')
    for (const update of workspaceUpdates) {
      lines.push(`- \`${update.package}\`: \`${update.from}\` → \`${update.to}\``)
    }
    lines.push('')
  }

  return lines.join('\n').trimEnd()
}

function renderMarkdown(report) {
  return `<!-- dependencies-update -->
## Atualização semanal de dependências

### Escopo

- Somente atualizações patch e minor.
- Versões major e prereleases não utilizadas foram ignoradas.
- Versões publicadas há menos de 7 dias foram excluídas por segurança.
- Merge automático desabilitado.

### Atualizações incluídas

${renderUpdateList(report.applied, 'Nenhuma atualização compatível foi incluída.')}

### Atualizações adiadas

${renderUpdateList(report.rejected, 'Nenhuma atualização elegível foi rejeitada pela validação.')}

As atualizações acima foram adiadas porque o modo determinístico de diagnóstico não conseguiu validá-las no lote final.

### Validações

\`\`\`sh
npm ci
npm run check:code
npm run check:types
npm run check:architecture
npm run build:lsp
npm run test:unit
npm run test:integration
npm run build
\`\`\`

Todas as validações obrigatórias passaram para o estado publicado nesta branch. Os workflows normais do Pull Request executarão novamente como fonte final de evidência.

### Resultado

- Atualizações incluídas: **${report.applied.length}**
- Atualizações adiadas: **${report.rejected.length}**
- Ferramenta de atualização: \`npm-check-updates@${report.ncuVersion}\`
`
}

const manifestPaths = listWorkspaceManifests()
const before = new Map(
  manifestPaths.map((manifestPath) => [manifestPath, readJson(manifestPath)]),
)
const eligibleUpdates = findEligibleUpdates(manifestPaths, before)

if (isDryRun) {
  const report = {
    ncuVersion: NCU_VERSION,
    eligible: eligibleUpdates,
    applied: [],
    rejected: [],
  }
  writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`)
  process.stdout.write(`Dry run found ${eligibleUpdates.length} eligible update(s).\n`)
  process.exit(0)
}

if (eligibleUpdates.length === 0) {
  const committedUpdates = BASE_REF
    ? findCommittedUpdates(BASE_REF, manifestPaths, before)
    : []
  const report = {
    ncuVersion: NCU_VERSION,
    eligible: committedUpdates,
    applied: committedUpdates,
    rejected: [],
  }
  writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`)
  writeFileSync(MARKDOWN_PATH, renderMarkdown(report))
  process.stdout.write(
    committedUpdates.length > 0
      ? `Recovered ${committedUpdates.length} committed update(s) from ${BASE_REF}.\n`
      : 'No eligible patch or minor updates were found.\n',
  )
  process.exit(0)
}

runNcu([
  '--doctor',
  '--upgrade',
  '--workspaces',
  '--target',
  'minor',
  '--cooldown',
  '7d',
  '--doctorInstall',
  'npm install --ignore-scripts --no-audit --no-fund',
  '--doctorTest',
  'npm run check:dependencies-update',
])

const after = new Map(
  manifestPaths.map((manifestPath) => [manifestPath, readJson(manifestPath)]),
)
const { applied, rejected } = classifyUpdates(eligibleUpdates, after)
const report = {
  ncuVersion: NCU_VERSION,
  eligible: eligibleUpdates,
  applied,
  rejected,
}

writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`)
writeFileSync(MARKDOWN_PATH, renderMarkdown(report))
process.stdout.write(
  `Applied ${applied.length} update(s); deferred ${rejected.length} update(s).\n`,
)
