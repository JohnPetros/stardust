import type { Command as CommanderCommand } from 'commander'

import { GateCommand, type GateStep } from '../GateCommand'

type DefinitionGateOptions = {
  spec: string
}

export class DefinitionGateCommand extends GateCommand<DefinitionGateOptions> {
  protected readonly stage = 'definition' as const

  register(parent: CommanderCommand): void {
    parent
      .command('definition')
      .description('Valida se a Spec está pronta para planejamento ou implementação')
      .requiredOption('--spec <path>', 'Caminho da Spec')
      .action((options: DefinitionGateOptions) => this.run(options))
  }

  buildSteps(options: DefinitionGateOptions): GateStep[] {
    return [this.checkStep('spec-check', 'spec', ['--spec', options.spec])]
  }
}
