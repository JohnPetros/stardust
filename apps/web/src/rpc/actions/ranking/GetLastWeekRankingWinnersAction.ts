import type { TierDto, RankingUserDto } from '@stardust/core/ranking/dtos'
import type { Action, Call } from '@stardust/core/global/interfaces'
import type { RankingService } from '@stardust/core/ranking/interfaces'
import { GetLastWeekRankingWinnersUseCase } from '@stardust/core/ranking/use-cases'

type Response = {
  isUserLoser: boolean
  lastWeekTier: TierDto
  lastWeekRankingWinners: RankingUserDto[]
}

export const GetLastWeekRankingWinnersAction = (
  service: RankingService,
): Action<void, Response> => {
  return {
    async handle(call: Call) {
      const userDto = await call.getUser()
      const useCase = new GetLastWeekRankingWinnersUseCase(service)
      return await useCase.do(userDto)
    },
  }
}
