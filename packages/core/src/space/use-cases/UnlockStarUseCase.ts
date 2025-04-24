import type { ISpaceService, IUseCase } from '../../global/interfaces'

type Request = {
  starId: string
  userId: string
}

export class UnlockStarUseCase implements IUseCase<Request> {
  constructor(private readonly spaceService: ISpaceService) {}

  async do({ starId, userId }: Request) {
    await this.fetchStar(starId)
    await this.saveUnlockedStar(starId, userId)
  }

  async fetchStar(starId: string) {
    const response = await this.spaceService.fetchStarById(starId)
    if (response.isFailure) response.throwError()
  }

  async saveUnlockedStar(starId: string, userId: string) {
    const response = await this.spaceService.saveUnlockedStar(starId, userId)
    if (response.isFailure) response.throwError()
  }
}
