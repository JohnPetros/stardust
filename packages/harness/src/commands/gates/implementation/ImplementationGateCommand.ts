import type { Command as CommanderCommand } from 'commander'

import { type CodeValidationOptions, GateCommand, type GateStep } from '../GateCommand'

export class ImplementationGateCommand extends GateCommand<CodeValidationOptions> {
  protected readonly stage = 'implementation' as const

  register(parent: CommanderCommand): void {
    const command = parent
      .command('implementation')
      .description('Executa sensores obrigatórios durante a implementação')
    this.registerCodeValidationOptions(command)
    command.action((options: CodeValidationOptions) => this.run(options))
  }

  buildSteps(options: CodeValidationOptions): GateStep[] {
    return this.buildCodeValidationSteps(options)
  }
}
