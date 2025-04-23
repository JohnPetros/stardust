import type { Action, Call, IChallengingService } from '@stardust/core/global/interfaces'
import { EditChallengeUseCase } from '@stardust/core/challenging/use-cases'
import type { ChallengeDto } from '@stardust/core/challenging/dtos'
import type { ChallengeSchema } from '@stardust/validation/challenging/types'
import { User } from '@stardust/core/global/entities'

type Request = {
  challengeId: string
  challenge: ChallengeSchema
}

export const EditChallengeAction = (
  challengingService: IChallengingService,
): Action<Request, ChallengeDto> => {
  return {
    async handle(call: Call<Request>) {
      const {
        challengeId,
        challenge: {
          title,
          code,
          description,
          categories,
          difficultyLevel,
          isPublic,
          testCases,
          function: challengeFunction,
        },
      } = call.getRequest()
      const user = User.create(await call.getUser())
      const useCase = new EditChallengeUseCase(challengingService)
      return await useCase.do({
        challengeDto: {
          id: challengeId,
          title,
          code,
          description,
          difficultyLevel,
          author: {
            id: user.id,
          },
          function: {
            name: challengeFunction.name,
            params: challengeFunction.params.map((param) => ({
              name: param.name,
            })),
          },
          testCases: testCases.map((testCase, index) => ({
            position: index + 1,
            inputs: testCase.inputs.map((input) => input.value),
            isLocked: testCase.isLocked,
            expectedOutput: testCase.expectedOutput.value,
          })),
          categories,
          isPublic,
        },
      })
    },
  }
}
