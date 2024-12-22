import { useRouter } from ''@/ui/global/hooks'/useRouter'

jest.mock(''@/ui/global/hooks'/useRouter')

export function useRouterMock(returnMock?: Partial<ReturnType<typeof useRouter>>) {
  const goToMock = jest.fn()
  const getCurrentrouteMock = jest.fn()

  jest.mocked(useRouter).mockReturnValue({
    goTo: goToMock,
    getCurrentRoute: getCurrentrouteMock,
    ...returnMock,
  })

  return {
    goToMock,
    getCurrentrouteMock,
  }
}
