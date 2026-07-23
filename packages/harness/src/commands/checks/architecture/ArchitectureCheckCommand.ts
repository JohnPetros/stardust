import path from 'node:path'
import type { Command as CommanderCommand } from 'commander'

import type { CheckFinding, CheckResult } from '../../../utils/create-check-result'
import { errorResult } from '../../../utils/create-check-result'
import {
  extractImports,
  resolveRelativeImport,
} from '../../../utils/extract-source-imports'
import { walkFiles } from '../../../utils/find-files'
import { printResult } from '../../../utils/print-check-result'
import { readJson } from '../../../utils/read-json'
import type { CliCommand } from '../../CliCommand'

export type ArchitectureRule = {
  id: string
  from: string
  disallow: string[]
  message?: string
}

export type ArchitectureConfig = {
  roots: string[]
  extensions?: string[]
  exclude?: string[]
  rules: ArchitectureRule[]
}

type ArchitectureOptions = {
  config?: string
}

export class ArchitectureCheckCommand implements CliCommand {
  static readonly defaultConfig: ArchitectureConfig = {
    roots: ['packages/core/src', 'apps/server/src', 'apps/web/src', 'apps/studio/src'],
    exclude: ['(?:^|/)node_modules/', '\\.(?:test|spec)\\.[cm]?[jt]sx?$'],
    rules: [
      {
        id: 'CORE_MUST_NOT_IMPORT_APPS',
        from: 'packages/core/src*',
        disallow: [
          '@stardust/server*',
          '@stardust/web*',
          '@stardust/studio*',
          'apps/server*',
          'apps/web*',
          'apps/studio*',
        ],
      },
      {
        id: 'SERVER_MUST_NOT_IMPORT_FRONTENDS',
        from: 'apps/server/src*',
        disallow: ['@stardust/web*', '@stardust/studio*', 'apps/web*', 'apps/studio*'],
      },
      {
        id: 'WEB_MUST_NOT_IMPORT_OTHER_APPS',
        from: 'apps/web/src*',
        disallow: [
          '@stardust/server*',
          '@stardust/studio*',
          'apps/server*',
          'apps/studio*',
        ],
      },
      {
        id: 'STUDIO_MUST_NOT_IMPORT_OTHER_APPS',
        from: 'apps/studio/src*',
        disallow: ['@stardust/server*', '@stardust/web*', 'apps/server*', 'apps/web*'],
      },
    ],
  }

  register(parent: CommanderCommand): void {
    parent
      .command('architecture')
      .description('Valida dependências entre camadas e aplicações')
      .option('--config <path>', 'Arquivo JSON com regras de arquitetura')
      .action((options: ArchitectureOptions) => this.run(options))
  }

  run(options: ArchitectureOptions): void {
    try {
      const config = options.config
        ? readJson<ArchitectureConfig>(options.config)
        : ArchitectureCheckCommand.defaultConfig
      printResult(this.execute(config))
    } catch (error) {
      printResult(errorResult('architecture-check', error))
    }
  }

  execute(config: ArchitectureConfig): CheckResult {
    const extensions = config.extensions ?? ['.ts', '.tsx', '.js', '.jsx']
    const excluded = (
      config.exclude ?? ['(?:^|/)node_modules/', '\\.(?:test|spec)\\.[cm]?[jt]sx?$']
    ).map((pattern) => new RegExp(pattern))
    const files = config.roots.flatMap((root) => walkFiles(root, extensions, excluded))
    const findings: CheckFinding[] = []

    for (const file of files) {
      const relativeFile = path.relative(process.cwd(), file).split(path.sep).join('/')
      for (const rule of config.rules) {
        if (!this.matches(relativeFile, rule.from)) continue
        for (const imported of extractImports(file)) {
          const resolved = resolveRelativeImport(file, imported.source, extensions)
          const target = resolved
            ? path.relative(process.cwd(), resolved).split(path.sep).join('/')
            : imported.source
          if (
            !rule.disallow.some(
              (pattern) =>
                this.matches(imported.source, pattern) || this.matches(target, pattern),
            )
          ) {
            continue
          }
          findings.push({
            code: rule.id,
            file: relativeFile,
            message: rule.message ?? `Import proibido por ${rule.id}: ${imported.source}`,
            detail: `linha ${imported.line}`,
          })
        }
      }
    }

    return {
      check: 'architecture-check',
      passed: findings.length === 0,
      findings,
      evidence: { filesScanned: files.length, rulesApplied: config.rules.length },
    }
  }

  private matches(value: string, pattern: string): boolean {
    if (pattern.startsWith('re:')) return new RegExp(pattern.slice(3)).test(value)
    if (pattern.endsWith('*')) return value.startsWith(pattern.slice(0, -1))
    return value === pattern || value.startsWith(`${pattern}/`)
  }
}
