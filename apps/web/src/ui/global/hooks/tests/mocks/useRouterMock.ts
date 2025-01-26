import { useRouter } from '@/ui/global/hooks/useRouter'

jest.mock('@/ui/global/hooks/useRouter')

export function useRouterMock(returnMock?: Partial<ReturnType<typeof useRouter>>) {
  const goToMock = jest.fn()
  const goBackMock = jest.fn()
  const refreshMock = jest.fn()

  jest.mocked(useRouter).mockReturnValue({
    goTo: goToMock,
    goBack: goBackMock,
    refresh: refreshMock,
    currentRoute: '',
    ...returnMock,
  })

  return {
    goToMock,
    goBackMock,
    refreshMock,
  }
}
