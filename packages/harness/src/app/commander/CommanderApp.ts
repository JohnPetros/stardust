import { Command as CommanderProgram } from 'commander'

import type { HarnessRouter } from './routers/HarnessRouter'

export class CommanderApp {
  private readonly program = new CommanderProgram()

  constructor(private readonly router: HarnessRouter) {
    this.program
      .name('harness')
      .description('Harness determinístico do projeto StarDust')
      .version('0.1.0')
      .showHelpAfterError()

    this.router.register(this.program)
  }

  async run(argv: string[] = process.argv): Promise<void> {
    await this.program.parseAsync(argv)
  }
}
