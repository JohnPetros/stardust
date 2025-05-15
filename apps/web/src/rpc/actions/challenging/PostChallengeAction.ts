import type { Action, Call } from '@stardust/core/global/interfaces'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import { PostChallengeUseCase } from '@stardust/core/challenging/use-cases'
import type { ChallengeDto } from '@stardust/core/challenging/entities/dtos'
import type { ChallengeSchema } from '@stardust/validation/challenging/types'
import { User } from '@stardust/core/global/entities'

type Request = ChallengeSchema

export const PostChallengeAction = (
  challengingService: ChallengingService,
): Action<Request, ChallengeDto> => {
  return {
    async handle(call: Call<Request>) {
      const {
        title,
        code,
        description,
        categories,
        difficultyLevel,
        testCases,
        function: challengeFunction,
      } = call.getRequest()
      const user = User.create(await call.getUser())
      const useCase = new PostChallengeUseCase(challengingService)
      return await useCase.execute({
        challengeDto: {
          title,
          code,
          description,
          difficultyLevel,
          author: {
            id: user.id.value,
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
