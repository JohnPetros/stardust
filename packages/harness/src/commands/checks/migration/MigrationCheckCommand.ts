import fs from 'node:fs'
import path from 'node:path'
import type { Command as CommanderCommand } from 'commander'

import {
  type CheckFinding,
  type CheckResult,
  errorResult,
} from '../../../utils/create-check-result'
import { printResult } from '../../../utils/print-check-result'
import { readJson } from '../../../utils/read-json'
import { runCommand } from '../../../utils/run-command'
import type { CliCommand } from '../../CliCommand'

export type MigrationConfig = {
  directories: string[]
  filenamePattern?: string
  commands?: string[][]
  cwd?: string
}

type MigrationOptions = {
  config?: string
  run?: boolean
}

export class MigrationCheckCommand implements CliCommand {
  register(parent: CommanderCommand): void {
    parent
      .command('migration')
      .description('Valida migrations e comandos executáveis')
      .option('--config <path>', 'Arquivo JSON de configuração')
      .option('--run', 'Executa os comandos declarados na configuração')
      .action((options: MigrationOptions) => this.run(options))
  }

  async run(options: MigrationOptions): Promise<void> {
    try {
      const config = options.config
        ? readJson<MigrationConfig>(options.config)
        : { directories: ['apps/server/supabase/migrations'] }
      const staticResult = this.execute(config)
      if (!staticResult.passed || !options.run) {
        printResult(staticResult)
        return
      }
      if (!config.commands || config.commands.length === 0) {
        throw new Error('--run exige commands explícitos no arquivo de configuração')
      }

      const commandEvidence = []
      const findings: CheckFinding[] = []
      for (const command of config.commands) {
        const result = await runCommand(command, { cwd: config.cwd })
        commandEvidence.push({ command, exitCode: result.exitCode })
        if (result.exitCode !== 0) {
          findings.push({
            code: 'MIGRATION_COMMAND_FAILED',
            message: `Comando falhou: ${command.join(' ')}`,
            detail: result.stderr || result.stdout,
          })
          break
        }
      }
      printResult({
        ...staticResult,
        passed: findings.length === 0,
        findings,
        evidence: { ...staticResult.evidence, commands: commandEvidence },
      })
    } catch (error) {
      printResult(errorResult('migration-check', error))
    }
  }

  execute(config: MigrationConfig): CheckResult {
    const pattern = new RegExp(
      config.filenamePattern ?? '^(?<timestamp>\\d{14})_[a-z0-9]+(?:_[a-z0-9]+)*\\.sql$',
    )
    const findings: CheckFinding[] = []
    const seenTimestamps = new Map<string, string>()
    let filesScanned = 0

    for (const directory of config.directories) {
      const absoluteDirectory = path.resolve(directory)
      if (!fs.existsSync(absoluteDirectory)) {
        findings.push({
          code: 'MIGRATION_DIRECTORY_MISSING',
          file: directory,
          message: 'Diretório de migrations não existe',
        })
        continue
      }
      for (const name of fs.readdirSync(absoluteDirectory).sort()) {
        const file = path.join(absoluteDirectory, name)
        if (!fs.statSync(file).isFile()) continue
        filesScanned += 1
        const match = pattern.exec(name)
        if (!match) {
          findings.push({
            code: 'INVALID_MIGRATION_NAME',
            file: path.relative(process.cwd(), file),
            message: 'Nome de migration fora do padrão canônico',
          })
          continue
        }
        const timestamp = match.groups?.timestamp ?? match[1] ?? name.slice(0, 14)
        const previous = seenTimestamps.get(timestamp)
        if (previous) {
          findings.push({
            code: 'DUPLICATE_MIGRATION_TIMESTAMP',
            file: path.relative(process.cwd(), file),
            message: `Timestamp duplicado com ${previous}`,
          })
        } else {
          seenTimestamps.set(timestamp, path.relative(process.cwd(), file))
        }
        if (fs.readFileSync(file, 'utf8').trim().length === 0) {
          findings.push({
            code: 'EMPTY_MIGRATION',
            file: path.relative(process.cwd(), file),
            message: 'Migration vazia',
          })
        }
      }
    }

    return {
      check: 'migration-check',
      passed: findings.length === 0,
      findings,
      evidence: { filesScanned, directories: config.directories },
    }
  }
}
