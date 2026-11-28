import { execFileSync, spawnSync } from 'node:child_process'
import { lstatSync, rmSync } from 'node:fs'
import { relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

import { getUseCaseModule } from './mutation-targets.mjs'

const PACKAGE = 'packages/core'
const USAGE =
  'Usage: pnpm --filter @stardust/core run test:mutation [--all [--shard N/M] | --base <ref> | --files <paths...>] [--dry-run]'
// A change to any of these can move the score of every use case.
const SHARED_INPUTS = [
  `${PACKAGE}/jest.config.ts`,
  `${PACKAGE}/package.json`,
  `${PACKAGE}/stryker.config.mjs`,
  `${PACKAGE}/tsconfig.json`,
  'package.json',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  'scripts/mutation-targets.mjs',
  'scripts/test-mutation.mjs',
]

function parseShard(value) {
  const [, index, count] = value?.match(/^([1-9]\d*)\/([1-9]\d*)$/) ?? []
  if (!index || Number(index) > Number(count)) {
    throw new Error('--shard requires N/M with 1 <= N <= M.')
  }
  return { index: Number(index), count: Number(count) }
}

export function parseArguments(argumentsList) {
  const options = { all: false, dryRun: false, files: [] }
  const queue = argumentsList.filter((argument) => argument !== '--')
  while (queue.length) {
    const flag = queue.shift()
    if (flag === '--all') options.all = true
    else if (flag === '--dry-run') options.dryRun = true
    else if (flag === '--shard') options.shard = parseShard(queue.shift())
    else if (flag === '--base' && queue[0]) options.base = queue.shift()
    else if (flag === '--files') {
      while (queue[0] && !queue[0].startsWith('--')) options.files.push(queue.shift())
      if (!options.files.length) throw new Error(USAGE)
    } else throw new Error(USAGE)
  }
  const scopes = [options.all, options.base, options.files.length].filter(Boolean)
  if (scopes.length > 1 || (options.shard && !options.all)) throw new Error(USAGE)
  return options
}

// Largest files first, each into the lightest shard: source size approximates the work.
export function partitionFiles(files, count) {
  const shards = Array.from({ length: count }, () => ({ bytes: 0, paths: [] }))
  const ordered = [...files].sort(
    (a, b) => b.bytes - a.bytes || a.path.localeCompare(b.path, 'en'),
  )
  for (const { path, bytes } of ordered) {
    const lightest = shards.reduce((best, shard) =>
      shard.bytes < best.bytes ? shard : best,
    )
    lightest.paths.push(path)
    lightest.bytes += bytes
  }
  return shards.map(({ paths }) => paths.sort())
}

// `changed` holds repository-relative paths. A changed use-case test selects its module.
export function selectChangedFiles(candidates, changed) {
  const shared = changed.filter((path) => SHARED_INPUTS.includes(path))
  if (shared.length) {
    throw new Error(
      `Shared inputs changed (${shared.join(', ')}): choose the scope with --files or --all.`,
    )
  }
  const selected = new Set()
  for (const path of changed) {
    const local = path.slice(PACKAGE.length + 1)
    if (!path.startsWith(`${PACKAGE}/`)) continue
    if (candidates.includes(local)) selected.add(local)
    const tested = local.match(/^(src\/[^/]+\/use-cases)\/tests\//)?.[1]
    if (!tested) continue
    for (const candidate of candidates) {
      if (candidate.startsWith(`${tested}/`)) selected.add(candidate)
    }
  }
  return [...selected].sort()
}

function git(root, argumentsList) {
  return execFileSync('git', ['-C', root, ...argumentsList], { encoding: 'utf8' })
}

function gitPaths(root, argumentsList) {
  return git(root, argumentsList).split('\0').filter(Boolean)
}

export function listUseCases(root, directory) {
  return gitPaths(root, [
    'ls-files',
    '-z',
    '--cached',
    '--others',
    '--exclude-standard',
    '--',
    PACKAGE,
  ])
    .map((path) => path.slice(PACKAGE.length + 1))
    .filter((path) => getUseCaseModule(path))
    .filter((path) =>
      lstatSync(resolve(directory, path), { throwIfNoEntry: false })?.isFile(),
    )
}

// Compares the working tree, including untracked files, with the branching point.
function changedPaths(root, base) {
  const reference = base ?? git(root, ['merge-base', 'HEAD', 'origin/main']).trim()
  return [
    ...gitPaths(root, ['diff', '--no-renames', '--name-only', '-z', reference, '--']),
    ...gitPaths(root, ['ls-files', '--others', '--exclude-standard', '-z']),
  ]
}

function explicitFiles(candidates, files, directory) {
  return files.map((file) => {
    const path = relative(directory, resolve(directory, file)).split(sep).join('/')
    if (!candidates.includes(path)) {
      throw new Error(`Not a Core use-case file: ${file}`)
    }
    return path
  })
}

function selectFiles(options, root, directory) {
  const candidates = listUseCases(root, directory)
  if (options.files.length) return explicitFiles(candidates, options.files, directory)
  if (!options.all) {
    return selectChangedFiles(candidates, changedPaths(root, options.base))
  }
  if (!options.shard) return candidates.sort()
  const sized = candidates.map((path) => ({
    path,
    bytes: lstatSync(resolve(directory, path)).size,
  }))
  return partitionFiles(sized, options.shard.count)[options.shard.index - 1]
}

export function runMutation(argumentsList, directory = process.cwd()) {
  const options = parseArguments(argumentsList)
  const root = git(directory, ['rev-parse', '--show-toplevel']).trim()
  if (relative(root, directory).split(sep).join('/') !== PACKAGE) {
    throw new Error(`Run test:mutation from ${PACKAGE}.`)
  }
  const files = [...new Set(selectFiles(options, root, directory))].sort()
  if (!files.length) {
    throw new Error(
      'No Core use-case files selected, so no mutation check ran. Use --files or --all.',
    )
  }
  const shard = options.shard
    ? `, shard ${options.shard.index}/${options.shard.count}`
    : ''
  console.log(
    `Mutation scope: ${files.length} use-case file(s)${shard}\n${files.join('\n')}`,
  )
  if (options.dryRun) return 0

  // A report left by an earlier run must never stand for this one.
  rmSync(resolve(directory, 'reports/mutation/mutation.json'), { force: true })
  const result = spawnSync(
    process.execPath,
    [
      resolve(directory, 'node_modules/@stryker-mutator/core/bin/stryker.js'),
      'run',
      'stryker.config.mjs',
      '--mutate',
      files.join(','),
    ],
    { cwd: directory, stdio: 'inherit' },
  )
  if (result.error) throw result.error
  return result.status ?? 1
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    process.exitCode = runMutation(process.argv.slice(2))
  } catch (error) {
    console.error(`Core mutation: ${error.message}`)
    process.exitCode = 1
  }
}
