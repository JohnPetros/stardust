import { spawn, type ChildProcess } from 'node:child_process'
import type { Command as CommanderCommand } from 'commander'

import { type CheckResult, errorResult } from '../../../utils/create-check-result'
import { printResult } from '../../../utils/print-check-result'
import type { CliCommand } from '../../CliCommand'

export type RuntimeCheckOptions = {
  url: string
  command?: string[]
  cwd?: string
  timeoutMs?: number
  intervalMs?: number
  expectedStatus?: number
}

type CommanderOptions = {
  url: string
  commandJson?: string
  cwd?: string
  timeoutMs: string
  intervalMs: string
  expectedStatus: string
}

export class RuntimeCheckCommand implements CliCommand {
  register(parent: CommanderCommand): void {
    parent
      .command('runtime')
      .alias('runtime-smoke')
      .description('Executa um health check HTTP com processo opcional')
      .requiredOption('--url <url>', 'URL do health check')
      .option('--command-json <json>', 'Processo a iniciar, serializado como JSON')
      .option('--cwd <path>', 'Diretório do processo')
      .option('--timeout-ms <number>', 'Timeout total', '30000')
      .option('--interval-ms <number>', 'Intervalo entre tentativas', '500')
      .option('--expected-status <number>', 'Status HTTP esperado', '200')
      .action((options: CommanderOptions) => this.run(options))
  }

  async run(options: CommanderOptions): Promise<void> {
    try {
      printResult(
        await this.execute({
          url: options.url,
          command: options.commandJson
            ? (JSON.parse(options.commandJson) as string[])
            : undefined,
          cwd: options.cwd,
          timeoutMs: this.parseNumber(options.timeoutMs, 'timeout-ms'),
          intervalMs: this.parseNumber(options.intervalMs, 'interval-ms'),
          expectedStatus: this.parseNumber(options.expectedStatus, 'expected-status'),
        }),
      )
    } catch (error) {
      printResult(errorResult('runtime-smoke', error))
    }
  }

  async execute(options: RuntimeCheckOptions): Promise<CheckResult> {
    const timeoutMs = options.timeoutMs ?? 30_000
    const intervalMs = options.intervalMs ?? 500
    const expectedStatus = options.expectedStatus ?? 200
    let child: ChildProcess | undefined
    let stderr = ''

    try {
      if (options.command) {
        if (options.command.length === 0) throw new Error('Comando de runtime vazio')
        child = spawn(options.command[0], options.command.slice(1), {
          cwd: options.cwd,
          env: process.env,
          detached: process.platform !== 'win32',
          shell: false,
          stdio: ['ignore', 'ignore', 'pipe'],
        })
        child.stderr?.on('data', (chunk) => {
          stderr = `${stderr}${String(chunk)}`.slice(-4_000)
        })
      }

      const startedAt = Date.now()
      let lastError = ''
      while (Date.now() - startedAt < timeoutMs) {
        if (child && child.exitCode !== null) {
          return {
            check: 'runtime-smoke',
            passed: false,
            findings: [
              {
                code: 'RUNTIME_EXITED',
                message: `Processo encerrou antes do health check (exit ${child.exitCode})`,
                detail: stderr,
              },
            ],
          }
        }
        try {
          const response = await fetch(options.url, {
            signal: AbortSignal.timeout(intervalMs),
          })
          if (response.status === expectedStatus) {
            return {
              check: 'runtime-smoke',
              passed: true,
              findings: [],
              evidence: {
                url: options.url,
                status: response.status,
                elapsedMs: Date.now() - startedAt,
              },
            }
          }
          lastError = `status ${response.status}; esperado ${expectedStatus}`
        } catch (error) {
          lastError = error instanceof Error ? error.message : String(error)
        }
        await new Promise((resolve) => setTimeout(resolve, intervalMs))
      }
      return {
        check: 'runtime-smoke',
        passed: false,
        findings: [
          {
            code: 'RUNTIME_TIMEOUT',
            message: `Health check não respondeu em ${timeoutMs}ms`,
            detail: lastError,
          },
        ],
      }
    } finally {
      if (child) await this.stopProcess(child)
    }
  }

  private parseNumber(value: string, option: string): number {
    const parsed = Number(value)
    if (!Number.isFinite(parsed) || parsed < 0) {
      throw new Error(`--${option} deve ser um número válido`)
    }
    return parsed
  }

  private async stopProcess(child: ChildProcess): Promise<void> {
    if (child.exitCode !== null || child.signalCode !== null) return
    const signal = (value: NodeJS.Signals): void => {
      if (process.platform !== 'win32' && child.pid) {
        try {
          process.kill(-child.pid, value)
          return
        } catch {
          // O processo pode ter encerrado entre a inspeção e o sinal.
        }
      }
      child.kill(value)
    }
    signal('SIGTERM')
    await Promise.race([
      new Promise<void>((resolve) => child.once('close', () => resolve())),
      new Promise<void>((resolve) =>
        setTimeout(() => {
          if (child.exitCode === null) signal('SIGKILL')
          resolve()
        }, 2_000),
      ),
    ])
  }
}
