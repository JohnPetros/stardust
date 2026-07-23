import { execFileSync } from 'node:child_process'
import path from 'node:path'
import type { Command as CommanderCommand } from 'commander'

import { collectOptionValues } from '../../../utils/collect-option-values'
import {
  createResult,
  type CheckFinding,
  type DetailedCheckResult,
  errorResult,
} from '../../../utils/create-check-result'
import { printResult } from '../../../utils/print-check-result'
import type { CliCommand } from '../../CliCommand'

export type ScopeCheckOptions = {
  base: string
  allowedPaths: string[]
  rootDir?: string
}

type CommanderOptions = {
  base: string
  allowedPath: string[]
  root?: string
}

type ScopeDetails = {
  base: string
  allowedPaths: string[]
  changedPaths: string[]
}

export class ScopeCheckCommand implements CliCommand {
  register(parent: CommanderCommand): void {
    parent
      .command('scope')
      .description('Valida arquivos alterados contra paths permitidos')
      .requiredOption('--base <ref>', 'Commit ou referência base')
      .option(
        '--allowed-path <path>',
        'Path ou glob permitido; pode ser repetido',
        collectOptionValues,
        [],
      )
      .option('--root <path>', 'Raiz do repositório')
      .action((options: CommanderOptions) => this.run(options))
  }

  run(options: CommanderOptions): void {
    try {
      printResult(
        this.execute({
          base: options.base,
          allowedPaths: options.allowedPath,
          rootDir: options.root,
        }),
      )
    } catch (error) {
      printResult(errorResult('scope-check', error))
    }
  }

  execute(options: ScopeCheckOptions): DetailedCheckResult<ScopeDetails> {
    const rootDir = path.resolve(options.rootDir ?? process.cwd())
    const findings: CheckFinding[] = []
    if (options.allowedPaths.length === 0) {
      findings.push({
        code: 'SCOPE_ALLOWED_PATHS_MISSING',
        message: 'Informe ao menos um --allowed-path.',
      })
    }

    const changedPaths = this.collectChangedPaths(rootDir, options.base)
    for (const changedPath of changedPaths) {
      if (
        !options.allowedPaths.some((allowedPath) =>
          this.isAllowedPath(changedPath, allowedPath),
        )
      ) {
        findings.push({
          code: 'SCOPE_PATH_NOT_ALLOWED',
          message: `Arquivo alterado fora do escopo: ${changedPath}`,
          path: changedPath,
        })
      }
    }

    return createResult('scope-check', findings, {
      base: options.base,
      allowedPaths: options.allowedPaths,
      changedPaths,
    })
  }

  isAllowedPath(changedPath: string, allowedPath: string): boolean {
    const normalizedChanged = changedPath.replaceAll('\\', '/').replace(/^\.\//, '')
    const normalizedAllowed = allowedPath
      .replaceAll('\\', '/')
      .replace(/^\.\//, '')
      .replace(/\/+$/, '')
    if (!normalizedAllowed) return false

    if (/[*?]/.test(normalizedAllowed)) {
      return this.globToRegExp(normalizedAllowed).test(normalizedChanged)
    }
    return (
      normalizedChanged === normalizedAllowed ||
      normalizedChanged.startsWith(`${normalizedAllowed}/`)
    )
  }

  private collectChangedPaths(rootDir: string, base: string): string[] {
    this.git(rootDir, ['rev-parse', '--verify', `${base}^{commit}`])
    const tracked = this.parseNameStatus(
      this.git(rootDir, ['diff', '--name-status', '-z', '--find-renames', base, '--']),
    )
    const untrackedOutput = this.git(rootDir, [
      'ls-files',
      '--others',
      '--exclude-standard',
      '-z',
    ])
    const untracked = untrackedOutput ? untrackedOutput.split('\0').filter(Boolean) : []
    return [...new Set([...tracked, ...untracked])].sort()
  }

  private git(rootDir: string, args: string[]): string {
    return execFileSync('git', args, {
      cwd: rootDir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim()
  }

  private parseNameStatus(output: string): string[] {
    if (!output) return []
    const tokens = output.split('\0').filter(Boolean)
    const paths: string[] = []
    for (let index = 0; index < tokens.length; index += 1) {
      const status = tokens[index]
      const pathCount = /^[RC]/.test(status) ? 2 : 1
      paths.push(...tokens.slice(index + 1, index + 1 + pathCount))
      index += pathCount
    }
    return paths
  }

  private globToRegExp(pattern: string): RegExp {
    let expression = '^'
    for (let index = 0; index < pattern.length; index += 1) {
      const character = pattern[index]
      const next = pattern[index + 1]
      if (character === '*' && next === '*') {
        expression += '.*'
        index += 1
      } else if (character === '*') {
        expression += '[^/]*'
      } else if (character === '?') {
        expression += '[^/]'
      } else {
        expression += character.replace(/[\\^$+?.()|[\]{}]/g, '\\$&')
      }
    }
    return new RegExp(`${expression}$`)
  }
}
