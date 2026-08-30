#!/usr/bin/env node

import { cpSync, existsSync, mkdirSync, readdirSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { commandExists, fail, log, output, run, warn } from './utils.mjs'

const DEFAULT_BASE_BRANCH = 'origin/main'

function usage() {
  console.log(`Uso: node ./scripts/create-worktree.mjs <nome-da-worktree/branch> [branch-base]

Exemplos:
  node ./scripts/create-worktree.mjs feature/auth
  node ./scripts/create-worktree.mjs fix/payment origin/develop`)
}

function primaryWorktreeRoot() {
  const line = output('git', ['worktree', 'list', '--porcelain'])
    .split('\n')
    .find((entry) => entry.startsWith('worktree '))
  return line
    ? line.slice('worktree '.length)
    : output('git', ['rev-parse', '--show-toplevel'])
}

function worktreeFiles(root, excludedRoot) {
  const files = []
  const excluded = resolve(excludedRoot)
  function visit(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name)
      const resolvedPath = resolve(path)
      if (
        resolvedPath === resolve(root, '.git') ||
        resolvedPath === resolve(root, 'node_modules') ||
        resolvedPath === excluded ||
        resolvedPath.startsWith(`${excluded}/`)
      )
        continue
      if (entry.isDirectory()) visit(path)
      else if (entry.isFile() && entry.name.startsWith('.env')) files.push(path)
    }
  }
  visit(root)
  return files
}

function copyEnvFiles(sourceRoot, targetRoot, worktreeParent) {
  let copied = 0
  let skippedTracked = 0
  let skippedUnignored = 0
  log('Copiando arquivos .env* locais do projeto original...')
  for (const envFile of worktreeFiles(sourceRoot, worktreeParent)) {
    const relativePath = relative(sourceRoot, envFile)
    try {
      output('git', ['-C', sourceRoot, 'ls-files', '--error-unmatch', '--', relativePath])
      skippedTracked += 1
      continue
    } catch {
      // Untracked files are candidates for copying.
    }
    try {
      run('git', ['-C', sourceRoot, 'check-ignore', '--quiet', '--', relativePath], {
        stdio: 'ignore',
      })
    } catch {
      skippedUnignored += 1
      continue
    }
    const targetFile = join(targetRoot, relativePath)
    mkdirSync(dirname(targetFile), { recursive: true })
    cpSync(envFile, targetFile, { preserveTimestamps: true })
    console.log(`    ${relativePath}`)
    copied += 1
  }
  if (copied === 0)
    warn('nenhum arquivo .env* local foi encontrado. Continuando sem copiar envs.')
  else log(`${copied} arquivo(s) .env* copiado(s).`)
  if (skippedTracked > 0)
    log(`${skippedTracked} arquivo(s) .env* rastreado(s) pelo Git foram ignorado(s).`)
  if (skippedUnignored > 0)
    log(
      `${skippedUnignored} arquivo(s) .env* nao ignorado(s) pelo Git foram ignorado(s).`,
    )
}

function detectPackageManager(worktreePath) {
  if (existsSync(join(worktreePath, 'pnpm-lock.yaml'))) return 'pnpm'
  if (existsSync(join(worktreePath, 'package-lock.json'))) return 'npm'
  if (existsSync(join(worktreePath, 'yarn.lock'))) return 'yarn'
  if (
    existsSync(join(worktreePath, 'bun.lock')) ||
    existsSync(join(worktreePath, 'bun.lockb'))
  )
    return 'bun'
  return null
}

function installDependencies(worktreePath) {
  if (!existsSync(join(worktreePath, 'package.json')))
    return warn(
      'package.json nao encontrado na raiz da worktree. Instalacao de dependencias ignorada.',
    )
  const manager = detectPackageManager(worktreePath)
  if (!manager)
    return warn(
      'nenhum lockfile conhecido foi encontrado. Instalacao de dependencias ignorada.',
    )
  if (!commandExists(manager))
    fail(`gerenciador de pacotes '${manager}' nao encontrado no PATH.`)
  log(`Instalando dependencias com ${manager} install...`)
  try {
    run(manager, ['install'], { cwd: worktreePath })
  } catch {
    fail(`falha ao instalar dependencias com ${manager}.`)
  }
}

function runProjectSetup(worktreePath) {
  const setupScript = join(worktreePath, 'scripts', 'setup-project.mjs')
  if (!existsSync(setupScript))
    return warn(`script de setup nao encontrado: ${setupScript}`)
  log('Executando setup do projeto...')
  try {
    run(process.execPath, [setupScript], { cwd: worktreePath })
  } catch {
    fail('falha ao executar o setup do projeto.')
  }
}

function main() {
  const [branchName, baseBranch = DEFAULT_BASE_BRANCH] = process.argv.slice(2)
  if (!branchName) {
    usage()
    fail('informe o nome da worktree/branch como primeiro parametro.')
  }
  try {
    output('git', ['rev-parse', '--is-inside-work-tree'])
  } catch {
    fail('este comando deve ser executado dentro de um repositorio Git.')
  }
  try {
    run('git', ['check-ref-format', '--branch', branchName], { stdio: 'ignore' })
  } catch {
    fail(`nome de branch invalido: ${branchName}`)
  }
  const sourceRoot = output('git', ['rev-parse', '--show-toplevel'])
  const repoRoot = primaryWorktreeRoot()
  const worktreeParent = join(repoRoot, '.worktree')
  const worktreePath = join(worktreeParent, branchName.replaceAll('/', '-'))
  try {
    run('git', ['show-ref', '--verify', '--quiet', `refs/heads/${branchName}`], {
      stdio: 'ignore',
    })
    fail(`a branch local '${branchName}' ja existe. Nenhuma alteracao foi feita.`)
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Erro:')) throw error
  }
  if (existsSync(worktreePath)) fail(`a pasta da worktree ja existe: ${worktreePath}`)
  log(`Repositorio atual: ${sourceRoot}`)
  log(`Repositorio principal: ${repoRoot}`)
  log(`Branch nova: ${branchName}`)
  log(`Branch base: ${baseBranch}`)
  log(`Destino da worktree: ${worktreePath}`)
  mkdirSync(worktreeParent, { recursive: true })
  log('Atualizando referencias remotas com git fetch...')
  run('git', ['fetch'])
  try {
    run('git', ['rev-parse', '--verify', '--quiet', `${baseBranch}^{commit}`], {
      stdio: 'ignore',
    })
  } catch {
    fail(`branch base nao encontrada ou invalida: ${baseBranch}`)
  }
  log('Criando worktree e branch local...')
  try {
    run('git', ['worktree', 'add', '-b', branchName, worktreePath, baseBranch])
  } catch {
    fail('falha ao criar a worktree.')
  }
  copyEnvFiles(sourceRoot, worktreePath, worktreeParent)
  installDependencies(worktreePath)
  runProjectSetup(worktreePath)
  log(`Worktree criada com sucesso em: ${worktreePath}`)
}

main()
