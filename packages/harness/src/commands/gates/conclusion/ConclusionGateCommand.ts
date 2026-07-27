import type { Command as CommanderCommand } from 'commander'

import { type CodeValidationOptions, GateCommand, type GateStep } from '../GateCommand'

export class ConclusionGateCommand extends GateCommand<CodeValidationOptions> {
  protected readonly stage = 'conclusion' as const

  register(parent: CommanderCommand): void {
    const command = parent
      .command('conclusion')
      .description('Executa a validação integrada antes da conclusão')
    this.registerCodeValidationOptions(command)
    command.action((options: CodeValidationOptions) => this.run(options))
  }

  buildSteps(options: CodeValidationOptions): GateStep[] {
    return this.buildCodeValidationSteps(options)
  }
}
