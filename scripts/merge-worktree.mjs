#!/usr/bin/env node

import { fail, log, output, run } from './utils.mjs'

function usage() {
  console.log(`Uso: node ./scripts/merge-worktree.mjs <branch-da-worktree-destino>

Exemplos:
  node ./scripts/merge-worktree.mjs main
  node ./scripts/merge-worktree.mjs feature/auth`)
}

function ensureClean(path, label) {
  if (output('git', ['-C', path, 'status', '--porcelain']))
    fail(`${label} possui alteracoes nao commitadas: ${path}`)
}

function pathForBranch(branch) {
  const lines = output('git', ['worktree', 'list', '--porcelain']).split('\n')
  let current
  for (const line of lines) {
    if (line.startsWith('worktree ')) current = line.slice(9)
    if (line === `branch refs/heads/${branch}`) return current
  }
  return ''
}

function main() {
  const [targetBranch] = process.argv.slice(2)
  if (!targetBranch) {
    usage()
    fail('informe a branch da worktree de destino como primeiro parametro.')
  }
  try {
    output('git', ['rev-parse', '--is-inside-work-tree'])
  } catch {
    fail('este comando deve ser executado dentro de um repositorio Git.')
  }
  try {
    run('git', ['show-ref', '--verify', '--quiet', `refs/heads/${targetBranch}`], {
      stdio: 'ignore',
    })
  } catch {
    fail(`branch local nao encontrada: ${targetBranch}`)
  }
  const sourceRoot = output('git', ['rev-parse', '--show-toplevel'])
  let sourceBranch
  try {
    sourceBranch = output('git', ['symbolic-ref', '--quiet', '--short', 'HEAD'])
  } catch {
    fail(
      'HEAD destacado nao e suportado. Faça checkout de uma branch antes de continuar.',
    )
  }
  if (sourceBranch === targetBranch)
    fail(`a branch atual e a branch de destino sao a mesma: ${sourceBranch}`)
  ensureClean(sourceRoot, 'A worktree atual')
  const targetPath = pathForBranch(targetBranch)
  if (!targetPath)
    fail(`nenhuma worktree registrada foi encontrada para a branch '${targetBranch}'.`)
  ensureClean(targetPath, 'A worktree de destino')
  log(`Worktree atual: ${sourceRoot}`)
  log(`Branch atual: ${sourceBranch}`)
  log(`Branch destino: ${targetBranch}`)
  log(`Worktree destino: ${targetPath}`)
  log('Executando merge da branch atual na worktree de destino...')
  try {
    run('git', ['-C', targetPath, 'merge', sourceBranch])
  } catch {
    fail(
      `falha ao fazer merge de '${sourceBranch}' em '${targetPath}'. Resolva o conflito manualmente.`,
    )
  }
  log('Merge concluido com sucesso.')
}

main()
