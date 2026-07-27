import type { Command as CommanderCommand } from 'commander'

import type { CliCommand } from '../../../commands/CliCommand'

export class ChecksRouter {
  constructor(private readonly commands: CliCommand[]) {}

  register(parent: CommanderCommand): void {
    const checks = parent.command('check').description('Executa checks determinísticos')

    for (const command of this.commands) command.register(checks)
  }
}
