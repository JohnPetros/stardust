import { spawn } from 'node:child_process'
import path from 'node:path'
import type { Command as CommanderCommand } from 'commander'

import { collectOptionValues } from '../../utils/collect-option-values'
import { PROJECT_ROOT } from '../../utils/resolve-project-root'
import type { CliCommand } from '../CliCommand'

export type GateStage = 'definition' | 'readiness' | 'implementation' | 'conclusion'

export type GateStep = {
  name: string
  command: string[]
  required: boolean
}

export type GateStepResult = GateStep & {
  passed: boolean
  exitCode: number | null
  stdout: string
  stderr: string
}

export type GateResult = {
  gate: GateStage
  passed: boolean
  steps: GateStepResult[]
}

export type CodeValidationOptions = {
  spec: string
  base: string
  allowedPath: string[]
  package: string[]
  testPath: string[]
  deadCodeConfig?: string
  deadCodeCommandJson?: string
  runtimeUrl?: string
  runtimeCommandJson?: string
  runtimeCwd?: string
  runtimeTimeoutMs: string
  migrationConfig?: string
  runMigrations?: boolean
  extraCommandJson: string[]
}

const NODE_TEST_RUNNER_PACKAGES = new Set(['@stardust/harness', '@stardust/lsp'])

const MAX_OUTPUT_CHARS = 8_000

export abstract class GateCommand<Options> implements CliCommand {
  protected abstract readonly stage: GateStage

  abstract register(parent: CommanderCommand): void

  abstract buildSteps(options: Options): GateStep[]

  async run(options: Options): Promise<void> {
    try {
      const result = await this.execute(options)
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)
      if (!result.passed) process.exitCode = 1
    } catch (error) {
      process.stdout.write(
        `${JSON.stringify(
          {
            gate: this.stage,
            passed: false,
            error: error instanceof Error ? error.message : String(error),
          },
          null,
          2,
        )}\n`,
      )
      process.exitCode = 1
    }
  }

  async execute(options: Options): Promise<GateResult> {
    const steps = this.buildSteps(options)
    const results: GateStepResult[] = []
    for (const step of steps) {
      const result = await this.runStep(step)
      results.push(result)
      if (step.required && !result.passed) break
    }
    return {
      gate: this.stage,
      passed: results.every((result) => !result.required || result.passed),
      steps: results,
    }
  }

  protected registerCodeValidationOptions(
    command: CommanderCommand,
    requirePackage = false,
  ): void {
    const packageOption = requirePackage
      ? command.requiredOption(
          '--package <name>',
          'Pacote npm alvo dos sensores; pode ser repetido',
          collectOptionValues,
        )
      : command.option(
          '--package <name>',
          'Pacote npm alvo dos sensores; pode ser repetido',
          collectOptionValues,
          [],
        )

    packageOption
      .requiredOption('--spec <path>', 'Caminho da Spec')
      .requiredOption('--base <ref>', 'Commit ou referência base')
      .option(
        '--allowed-path <path>',
        'Path ou glob permitido; pode ser repetido',
        collectOptionValues,
        [],
      )
      .option(
        '--test-path <path>',
        'Teste relativo ao pacote alvo; pode ser repetido',
        collectOptionValues,
        [],
      )
      .option('--dead-code-config <path>', 'Configuração do dead-code check')
      .option('--dead-code-command-json <json>', 'Comando externo de dead code')
      .option('--runtime-url <url>', 'URL para runtime smoke')
      .option('--runtime-command-json <json>', 'Comando que inicia o runtime')
      .option('--runtime-cwd <path>', 'Diretório do runtime')
      .option('--runtime-timeout-ms <number>', 'Timeout do runtime', '30000')
      .option('--migration-config <path>', 'Configuração de migrations')
      .option('--run-migrations', 'Executa comandos de migration')
      .option(
        '--extra-command-json <json>',
        'Comando adicional; pode ser repetido',
        collectOptionValues,
        [],
      )
  }

  protected buildCodeValidationSteps(options: CodeValidationOptions): GateStep[] {
    if (options.allowedPath.length === 0) {
      throw new Error('Implementation/Conclusion Gate exige ao menos um --allowed-path')
    }
    if (this.stage === 'implementation' && options.package.length === 0) {
      throw new Error('Implementation Gate exige ao menos um --package')
    }
    if (options.testPath.length > 0 && options.package.length === 0) {
      throw new Error('Informe ao menos um --package ao usar --test-path')
    }

    const steps: GateStep[] = [
      this.checkStep('scope-check', 'scope', [
        '--base',
        options.base,
        ...options.allowedPath.flatMap((allowedPath) => ['--allowed-path', allowedPath]),
      ]),
    ]

    if (options.package.length === 0) {
      steps.push(
        this.npmStep('codecheck'),
        this.npmStep('typecheck'),
        this.npmStep('test:unit'),
      )
    } else {
      for (const packageName of options.package) {
        const testArgs =
          options.testPath.length > 0 && !NODE_TEST_RUNNER_PACKAGES.has(packageName)
            ? ['--runTestsByPath', ...options.testPath]
            : []
        steps.push(
          this.npmWorkspaceStep('codecheck', packageName),
          this.npmWorkspaceStep('typecheck', packageName),
          this.npmWorkspaceStep('test:unit', packageName, testArgs),
        )
      }
    }

    steps.push(this.checkStep('architecture-check', 'architecture'))

    if (options.deadCodeConfig) {
      steps.push(
        this.checkStep('dead-code-check', 'dead-code', [
          `--config=${options.deadCodeConfig}`,
        ]),
      )
    } else if (options.deadCodeCommandJson) {
      steps.push(
        this.checkStep('dead-code-check', 'dead-code', [
          `--command-json=${options.deadCodeCommandJson}`,
        ]),
      )
    }

    if (options.runtimeUrl) {
      const args = [`--url=${options.runtimeUrl}`]
      if (options.runtimeCommandJson) {
        args.push(`--command-json=${options.runtimeCommandJson}`)
      }
      if (options.runtimeCwd) args.push(`--cwd=${options.runtimeCwd}`)
      args.push(`--timeout-ms=${options.runtimeTimeoutMs}`)
      steps.push(this.checkStep('runtime-smoke', 'runtime', args))
    }

    if (options.migrationConfig) {
      steps.push(
        this.checkStep('migration-check', 'migration', [
          `--config=${options.migrationConfig}`,
          ...(options.runMigrations === true ? ['--run'] : []),
        ]),
      )
    } else {
      steps.push(this.checkStep('migration-check', 'migration'))
    }

    steps.push(
      this.checkStep('contract-check', 'contract', ['--spec', options.spec, '--run']),
    )

    for (const [index, rawCommand] of options.extraCommandJson.entries()) {
      steps.push(
        this.commandStep(
          `extra-command:${index + 1}`,
          this.parseCommand(rawCommand, 'extra-command-json'),
        ),
      )
    }

    return steps
  }

  protected checkStep(name: string, command: string, args: string[] = []): GateStep {
    return {
      name,
      command: [
        process.execPath,
        '--import',
        'tsx',
        path.join(PROJECT_ROOT, 'packages/harness/src/cli.ts'),
        'check',
        command,
        ...args,
      ],
      required: true,
    }
  }

  protected npmStep(script: string, args: string[] = []): GateStep {
    return {
      name: script,
      command: ['npm', 'run', script, ...(args.length > 0 ? ['--', ...args] : [])],
      required: true,
    }
  }

  protected npmWorkspaceStep(
    script: string,
    packageName: string,
    args: string[] = [],
  ): GateStep {
    return {
      name: `${script}:${packageName}`,
      command: [
        'npm',
        'run',
        script,
        '--workspace',
        packageName,
        ...(args.length > 0 ? ['--', ...args] : []),
      ],
      required: true,
    }
  }

  protected commandStep(name: string, command: string[]): GateStep {
    return { name, command, required: true }
  }

  private parseCommand(raw: string, argumentName: string): string[] {
    const command = JSON.parse(raw) as unknown
    if (
      !Array.isArray(command) ||
      command.length === 0 ||
      command.some((item) => typeof item !== 'string' || item.length === 0)
    ) {
      throw new Error(`--${argumentName} deve ser um JSON array de strings não vazio`)
    }
    return command
  }

  private async runStep(step: GateStep): Promise<GateStepResult> {
    return new Promise((resolve) => {
      const child = spawn(step.command[0], step.command.slice(1), {
        cwd: PROJECT_ROOT,
        env: process.env,
        shell: false,
        stdio: ['ignore', 'pipe', 'pipe'],
      })
      let stdout = ''
      let stderr = ''
      child.stdout.on('data', (chunk) => {
        stdout += String(chunk)
      })
      child.stderr.on('data', (chunk) => {
        stderr += String(chunk)
      })
      child.on('error', (error) => {
        resolve({
          ...step,
          passed: false,
          exitCode: null,
          stdout: this.compactOutput(stdout),
          stderr: this.compactOutput(`${stderr}\n${error.message}`.trim()),
        })
      })
      child.on('close', (exitCode) => {
        resolve({
          ...step,
          passed: exitCode === 0,
          exitCode,
          stdout: this.compactOutput(stdout),
          stderr: this.compactOutput(stderr),
        })
      })
    })
  }

  private compactOutput(output: string): string {
    if (output.length <= MAX_OUTPUT_CHARS) return output
    return `…${output.slice(-MAX_OUTPUT_CHARS)}`
  }
}
