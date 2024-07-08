import { useRouter } from '@/modules/global/hooks/useRouter'

jest.mock('@/modules/global/hooks/useRouter')

export function useRouterMock(returnMock?: Partial<ReturnType<typeof useRouter>>) {
  const goToMock = jest.fn()

  jest.mocked(useRouter).mockReturnValue({
    goTo: goToMock,
    ...returnMock,
  })

  return {
    goToMock,
  }
}
