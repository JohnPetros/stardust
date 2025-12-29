import { Challenge } from '@stardust/core/challenging/entities'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import type { Tool } from '@stardust/core/global/interfaces'
import type { Mcp } from '@stardust/core/global/interfaces'
import { Id } from '@stardust/core/global/structures'

type Input = {
  challengeId: string
}

export const GetChallengeDescriptionTool = (
  service: ChallengingService,
): Tool<Input, string> => {
  return {
    async handle(mcp: Mcp<Input>) {
      const { challengeId }= mcp.getInput() 
      const response = await service.fetchChallengeById(Id.create(challengeId))
      if (response.isFailure) response.throwError()
      const challenge = Challenge.create(response.body)
      return `Título: ${challenge.title.value} 
Descrição: 
${challenge.description.value}`
    },
  }
}
