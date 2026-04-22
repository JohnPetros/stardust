import type { Mcp, Tool } from '@stardust/core/global/interfaces'

import { CHALLENGE_CREATION_INSTRUCTIONS } from '@/ai/challenging/constants'

type Output = {
  instructions: string
}

export class GetChallengeCreationInstructionsTool implements Tool<void, Output> {
  async handle(_: Mcp<void>): Promise<Output> {
    return {
      instructions: CHALLENGE_CREATION_INSTRUCTIONS,
    }
  }
}
