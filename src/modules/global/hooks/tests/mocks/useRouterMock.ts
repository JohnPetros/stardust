import { useRouter } from '@/modules/global/hooks/useRouter'

jest.mock('@/modules/global/hooks/useRouter')

export function useRouterMock(returnMock?: Partial<ReturnType<typeof useRouter>>) {
  const goToMock = jest.fn()
  const getCurrentrouteMock = jest.fn()

  jest.mocked(useRouter).mockReturnValue({
    goTo: goToMock,
    getCurrentroute: getCurrentrouteMock,
    ...returnMock,
  })

  return {
    goToMock,
    getCurrentrouteMock,
  }
}
