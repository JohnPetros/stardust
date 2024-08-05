import { useToastContext } from '@/ui/global/contexts/ToastContext'

export function useToastContextMock(
  returnMock?: Partial<ReturnType<typeof useToastContext>>
) {
  const showMock = jest.fn()

  jest.mocked(useToastContext).mockReturnValue({
    show: showMock,
    ...returnMock,
  })

  return {
    showMock,
  }
}
