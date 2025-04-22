import type { IApi } from '@stardust/core/global/interfaces'
import {
  ProfileServiceMock,
  AuthServiceMock,
  ChallengingServiceMock,
  RankingServiceMock,
  SpaceServiceMock,
} from '@stardust/core/mocks/services'

export function useInMemoryApi(): IApi {
  const inMemoryApi = {}

  return Object.assign(
    inMemoryApi,
    new AuthServiceMock(),
    new ChallengingServiceMock(),
    new RankingServiceMock(),
    new SpaceServiceMock(),
    new ProfileServiceMock(),
  ) as unknown as IApi
}
