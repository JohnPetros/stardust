import type { Command as CommanderCommand } from 'commander'

export interface CliCommand {
  register(parent: CommanderCommand): void
}
