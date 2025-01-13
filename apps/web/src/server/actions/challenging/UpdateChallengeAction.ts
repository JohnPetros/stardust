import type {
  IAction,
  IActionServer,
  IChallengingService,
} from '@stardust/core/interfaces'
import { UpdateChallengeUseCase } from '@stardust/core/challenging/use-cases'
import type { ChallengeDto } from '@stardust/core/challenging/dtos'
import type { ChallengeSchema } from '@stardust/validation/challenging/types'
import { User } from '@stardust/core/global/entities'

type Request = {
  challengeId: string
  challenge: ChallengeSchema
}

export const UpdateChallengeAction = (
  challengingService: IChallengingService,
): IAction<Request, ChallengeDto> => {
  return {
    async handle(actionServer: IActionServer<Request>) {
      const {
        challengeId,
        challenge: {
          title,
          code,
          description,
          categories,
          difficultyLevel,
          testCases,
          function: challengeFunction,
        },
      } = actionServer.getRequest()
      const user = User.create(await actionServer.getUser())
      const useCase = new UpdateChallengeUseCase(challengingService)
      console.log('action', testCases)
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
        },
      })
    },
  }
}
