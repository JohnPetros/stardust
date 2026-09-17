import type { EditChallengeStarUseCase } from '@stardust/core/challenging/use-cases'
import type { Controller, Http } from '@stardust/core/global/interfaces'

type Schema = {
  routeParams: {
    challengeId: string
  }
  body: {
    starId: string
  }
}

export class EditChallengeStarController implements Controller<Schema> {
  constructor(private readonly editChallengeStar: EditChallengeStarUseCase) {}

  async handle(http: Http<Schema>) {
    const { challengeId } = http.getRouteParams()
    const { starId } = await http.getBody()
    const challengeDto = await this.editChallengeStar.execute({ challengeId, starId })
    return http.send(challengeDto)
  }
}
