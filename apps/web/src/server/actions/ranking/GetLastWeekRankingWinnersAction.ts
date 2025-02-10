import type { TierDto, RankingUserDto } from '@stardust/core/ranking/dtos'
import type { IAction, IActionServer, IRankingService } from '@stardust/core/interfaces'
import { GetLastWeekRankingWinnersUseCase } from '@stardust/core/ranking/use-cases'

type Response = {
  isUserLoser: boolean
  lastWeekTier: TierDto
  lastWeekRankingWinners: RankingUserDto[]
}

export const GetLastWeekRankingWinnersAction = (
  service: IRankingService,
): IAction<void, Response> => {
  return {
    async handle(actionServer: IActionServer) {
      const userDto = await actionServer.getUser()
      const useCase = new GetLastWeekRankingWinnersUseCase(service)
      return await useCase.do(userDto)
    },
  }
}
