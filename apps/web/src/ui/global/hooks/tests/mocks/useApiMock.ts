import type { IApi } from '@stardust/core/interfaces'
import { useApi } from '../../useApi'
import { useInMemoryApi } from '../../useInMemoryApi'

export function useApiMock(customApiMock?: Partial<IApi>) {
  const mockedUseApi = jest.mocked(useApi)
  const inMemoryApi = useInMemoryApi()

  mockedUseApi.mockReturnValue({
    ...inMemoryApi,
    ...customApiMock,
  })

  const apiMock = mockedUseApi()

  return apiMock
}
