import type {
  IAction,
  IActionServer,
  IChallengingService,
} from '@stardust/core/interfaces'
import { PostChallengeUseCase } from '@stardust/core/challenging/use-cases'
import type { ChallengeDto } from '@stardust/core/challenging/dtos'
import type { ChallengeSchema } from '@stardust/validation/challenging/types'

type Request = ChallengeSchema

export const PostChallengeAction = (
  challengingService: IChallengingService,
): IAction<Request, ChallengeDto> => {
  return {
    async handle(actionServer: IActionServer<Request>) {
      const {
        title,
        code,
        description,
        authorId,
        categories,
        difficultyLevel,
        testCases,
        function: challengeFunction,
      } = actionServer.getRequest()
      const useCase = new PostChallengeUseCase(challengingService)
      return await useCase.do({
        challengeDto: {
          title,
          code,
          description,
          difficultyLevel,
          author: {
            id: authorId,
          },
          function: {
            name: challengeFunction.name,
            params: challengeFunction.params.map((param) => ({
              name: param.name,
            })),
          },
          testCases: testCases.map((testCase, index) => ({
            position: index + 1,
            inputs: testCase.inputs,
            isLocked: testCase.isLocked,
            expectedOutput: testCase.expectedOutput,
          })),
          categories,
        },
      })
    },
  }
}
