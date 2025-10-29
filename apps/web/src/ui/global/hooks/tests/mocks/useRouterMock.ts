import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'

jest.mock('@/ui/global/hooks/useNavigationProvider')

export function useRouterMock(
  returnMock?: Partial<ReturnType<typeof useNavigationProvider>>,
) {
  const goToMock = jest.fn()
  const goBackMock = jest.fn()
  const refreshMock = jest.fn()

  jest.mocked(useNavigationProvider).mockReturnValue({
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
