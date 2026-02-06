import type { Mcp } from '@stardust/core/global/interfaces'

export class MastraMcp<Input = unknown> implements Mcp<Input> {
  constructor(private readonly input: Input) {}

  getInput(): Input {
    return this.input
  }
}
