import {
  AchievementsServiceMock,
  UsersServiceMock,
} from '@/@core/__tests__/mocks/services'
import type { IApi } from '../types'

export function useInMemoryApi(): IApi {
  const inMemoryApi = {}

  return Object.assign(
    inMemoryApi,
    new AchievementsServiceMock(),
    new UsersServiceMock(),
  ) as unknown as IApi
}
