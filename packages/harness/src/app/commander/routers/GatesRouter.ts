import type { Command as CommanderCommand } from 'commander'

import type { CliCommand } from '../../../commands/CliCommand'

export class GatesRouter {
  constructor(private readonly commands: CliCommand[]) {}

  register(parent: CommanderCommand): void {
    const gates = parent.command('gate').description('Executa gates do workflow SDD')

    for (const command of this.commands) command.register(gates)
  }
}
