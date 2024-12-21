import { useApi } from '../../useApi'
import { useInMemoryApi } from '../../../../../api/in-memory'
import type { IApi } from '../../../../../api/interfaces'

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
