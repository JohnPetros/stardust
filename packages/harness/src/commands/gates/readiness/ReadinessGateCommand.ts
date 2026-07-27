import type { Command as CommanderCommand } from 'commander'

import { GateCommand, type GateStep } from '../GateCommand'

type ReadinessGateOptions = {
  spec: string
  revision: string
  plan?: string
  task?: string
}

export class ReadinessGateCommand extends GateCommand<ReadinessGateOptions> {
  protected readonly stage = 'readiness' as const

  register(parent: CommanderCommand): void {
    parent
      .command('readiness')
      .description('Valida revisão da Spec, Plan, tarefa e dependências')
      .requiredOption('--spec <path>', 'Caminho da Spec')
      .requiredOption('--revision <sha1>', 'Revisão git blob da Spec')
      .option('--plan <path>', 'Caminho do Plan')
      .option('--task <id>', 'ID da tarefa')
      .action((options: ReadinessGateOptions) => this.run(options))
  }

  buildSteps(options: ReadinessGateOptions): GateStep[] {
    const args = ['--spec', options.spec, '--revision', options.revision]
    if (options.plan) args.push('--plan', options.plan)
    if (options.task) args.push('--task', options.task)
    return [this.checkStep('readiness-check', 'readiness', args)]
  }
}
