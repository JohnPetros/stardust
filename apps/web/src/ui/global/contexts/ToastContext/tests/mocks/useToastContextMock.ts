import { useToastContext } from '@/ui/global/contexts/ToastContext'

export function useToastContextMock(
  returnMock?: Partial<ReturnType<typeof useToastContext>>,
) {
  const showMock = jest.fn()
  const showSuccessMock = jest.fn()
  const showErrorMock = jest.fn()

  jest.mocked(useToastContext).mockReturnValue({
    show: showMock,
    showSuccess: showSuccessMock,
    showError: showErrorMock,
    ...returnMock,
  })

  return {
    showMock,
  }
}
