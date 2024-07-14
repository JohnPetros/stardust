import { useApi } from '../..'
import { useInMemoryApi } from '../../in-memory'
import type { IApi } from '../../types'

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
