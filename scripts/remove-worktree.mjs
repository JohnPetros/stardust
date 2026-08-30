#!/usr/bin/env node

import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { fail, log, output, run } from './utils.mjs'

function usage() {
  console.log(`Uso: node ./scripts/remove-worktree.mjs <nome-da-worktree/branch>

Exemplos:
  node ./scripts/remove-worktree.mjs feature/auth
  node ./scripts/remove-worktree.mjs fix/payment`)
}

function primaryWorktreeRoot() {
  const line = output('git', ['worktree', 'list', '--porcelain'])
    .split('\n')
    .find((entry) => entry.startsWith('worktree '))
  return line ? line.slice(9) : output('git', ['rev-parse', '--show-toplevel'])
}

function worktreeEntries() {
  const entries = []
  let current
  for (const line of output('git', ['worktree', 'list', '--porcelain']).split('\n')) {
    if (line.startsWith('worktree ')) {
      current = { path: line.slice(9), branch: '' }
      entries.push(current)
    } else if (current && line.startsWith('branch '))
      current.branch = line.slice(7).replace(/^refs\/heads\//, '')
  }
  return entries
}

function main() {
  const [worktreeName] = process.argv.slice(2)
  if (!worktreeName) {
    usage()
    fail('informe o nome da worktree/branch como primeiro parametro.')
  }
  try {
    output('git', ['rev-parse', '--is-inside-work-tree'])
  } catch {
    fail('este comando deve ser executado dentro de um repositorio Git.')
  }
  const currentRoot = output('git', ['rev-parse', '--show-toplevel'])
  const targetPath = join(
    primaryWorktreeRoot(),
    '.worktree',
    worktreeName.replaceAll('/', '-'),
  )
  if (currentRoot === targetPath)
    fail(
      'nao remova a worktree a partir dela mesma. Execute o comando pelo repositorio principal ou por outra worktree.',
    )
  if (!existsSync(targetPath)) fail(`worktree nao encontrada em: ${targetPath}`)
  const target = worktreeEntries().find((entry) => entry.path === targetPath)
  if (!target)
    fail(`a pasta existe, mas nao esta registrada como Git worktree: ${targetPath}`)
  log(`Repositorio atual: ${currentRoot}`)
  log(`Repositorio principal: ${primaryWorktreeRoot()}`)
  log(`Worktree informada: ${worktreeName}`)
  log(`Destino esperado: ${targetPath}`)
  log(`Removendo worktree em: ${targetPath}`)
  try {
    run('git', ['worktree', 'remove', targetPath])
  } catch {
    fail('falha ao remover a worktree. Verifique se existem alteracoes nao commitadas.')
  }
  log('Limpando metadados obsoletos de worktrees...')
  run('git', ['worktree', 'prune'])
  if (target.branch) {
    log(`Removendo branch local: ${target.branch}`)
    try {
      run('git', ['branch', '-d', target.branch])
    } catch {
      fail(
        `falha ao remover a branch local '${target.branch}'. Verifique se ela ja foi mesclada.`,
      )
    }
  } else log('Nenhuma branch local associada foi detectada para a worktree.')
  log('Worktree removida com sucesso.')
}

main()
