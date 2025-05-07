import { useApi } from '../../useApi'

export function useApiMock() {
  const mockedUseApi = jest.mocked(useApi)
  // const inMemoryApi = useInMemoryApi()

  // mockedUseApi.mockReturnValue({
  //   ...inMemoryApi,
  // })

  const apiMock = mockedUseApi()

  return apiMock
}
