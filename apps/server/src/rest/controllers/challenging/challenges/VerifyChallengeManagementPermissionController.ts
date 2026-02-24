import { ChallengeNotFoundError } from '@stardust/core/challenging/errors'
import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'
import { GetChallengeUseCase } from '@stardust/core/challenging/use-cases'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { InsigniaRole } from '@stardust/core/global/structures'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { GetUserUseCase } from '@stardust/core/profile/use-cases'
import { Challenge } from '@stardust/core/challenging/entities'
import { User } from '@stardust/core/profile/entities'

type Schema = {
  routeParams: {
    challengeId: string
  }
}

export class VerifyChallengeManagementPermissionController implements Controller<Schema> {
  constructor(
    private readonly challengesRepository: ChallengesRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const { challengeId } = http.getRouteParams()
    const account = await http.getAccount()

    const getChallengeUseCase = new GetChallengeUseCase(this.challengesRepository)
    const getUserUseCase = new GetUserUseCase(this.usersRepository)

    const challenge = Challenge.create(
      await getChallengeUseCase.execute({
        challengeId,
      }),
    )
    const user = User.create(
      await getUserUseCase.execute({
        userId: account.id,
      }),
    )

    const isAuthor = challenge.isChallengeAuthor(user.id).isTrue
    const isGod = user.hasInsignia(InsigniaRole.createAsGod()).isTrue

    if (!isAuthor && !isGod) {
      throw new ChallengeNotFoundError()
    }

    return http.pass()
  }
}
