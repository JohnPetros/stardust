import type { Command as CommanderCommand } from 'commander'

import type { CliCommand } from '../../../commands/CliCommand'
import type { ChecksRouter } from './ChecksRouter'
import type { GatesRouter } from './GatesRouter'

export class HarnessRouter {
  constructor(
    private readonly checksRouter: ChecksRouter,
    private readonly gatesRouter: GatesRouter,
    private readonly rootCommands: CliCommand[],
  ) {}

  register(program: CommanderCommand): void {
    this.checksRouter.register(program)
    this.gatesRouter.register(program)
    for (const command of this.rootCommands) command.register(program)
  }
}
