import path from 'node:path'
import type { Command as CommanderCommand } from 'commander'

import {
  type CheckFinding,
  type CheckResult,
  errorResult,
} from '../../../utils/create-check-result'
import {
  extractImports,
  resolveRelativeImport,
} from '../../../utils/extract-source-imports'
import { walkFiles } from '../../../utils/find-files'
import { printResult } from '../../../utils/print-check-result'
import { readJson } from '../../../utils/read-json'
import { runCommand } from '../../../utils/run-command'
import type { CliCommand } from '../../CliCommand'

export type DeadCodeConfig = {
  roots: string[]
  entrypoints: string[]
  extensions?: string[]
  exclude?: string[]
}

type DeadCodeOptions = {
  config?: string
  commandJson?: string
  cwd?: string
}

export class DeadCodeCheckCommand implements CliCommand {
  register(parent: CommanderCommand): void {
    parent
      .command('dead-code')
      .description('Detecta código não alcançável')
      .option('--config <path>', 'Arquivo JSON com roots e entrypoints')
      .option('--command-json <json>', 'Comando externo serializado como JSON')
      .option('--cwd <path>', 'Diretório do comando externo')
      .action((options: DeadCodeOptions) => this.run(options))
  }

  async run(options: DeadCodeOptions): Promise<void> {
    try {
      if (options.commandJson) {
        printResult(
          await this.executeTool(
            JSON.parse(options.commandJson) as string[],
            options.cwd,
          ),
        )
        return
      }
      if (!options.config) {
        throw new Error(
          'Informe --config=<dead-code.json> ou --command-json=\'["tool","arg"]\'',
        )
      }
      printResult(this.execute(readJson<DeadCodeConfig>(options.config)))
    } catch (error) {
      printResult(errorResult('dead-code-check', error))
    }
  }

  execute(config: DeadCodeConfig): CheckResult {
    if (config.entrypoints.length === 0) {
      throw new Error(
        'A análise exige entrypoints explícitos para evitar falsos positivos',
      )
    }
    const extensions = config.extensions ?? ['.ts', '.tsx', '.js', '.jsx']
    const excluded = (config.exclude ?? []).map((pattern) => new RegExp(pattern))
    const files = new Set(
      config.roots
        .flatMap((root) => walkFiles(root, extensions, excluded))
        .map((file) => path.resolve(file)),
    )
    const pending = config.entrypoints.map((entrypoint) => path.resolve(entrypoint))
    const reachable = new Set<string>()

    while (pending.length > 0) {
      const file = pending.pop()
      if (!file || reachable.has(file) || !files.has(file)) continue
      reachable.add(file)
      for (const imported of extractImports(file)) {
        const resolved = resolveRelativeImport(file, imported.source, extensions)
        if (resolved && files.has(resolved) && !reachable.has(resolved)) {
          pending.push(resolved)
        }
      }
    }

    const findings: CheckFinding[] = [...files]
      .filter((file) => !reachable.has(file))
      .sort()
      .map((file) => ({
        code: 'UNREACHABLE_FILE',
        file: path.relative(process.cwd(), file).split(path.sep).join('/'),
        message: 'Arquivo não alcançável pelos entrypoints configurados',
      }))

    return {
      check: 'dead-code-check',
      passed: findings.length === 0,
      findings,
      evidence: { filesScanned: files.size, reachableFiles: reachable.size },
    }
  }

  private async executeTool(command: string[], cwd?: string): Promise<CheckResult> {
    const result = await runCommand(command, { cwd })
    return {
      check: 'dead-code-check',
      passed: result.exitCode === 0,
      findings:
        result.exitCode === 0
          ? []
          : [
              {
                code: 'DEAD_CODE_TOOL_FAILED',
                message: result.stderr || result.stdout,
              },
            ],
      evidence: { command, exitCode: result.exitCode },
    }
  }
}
