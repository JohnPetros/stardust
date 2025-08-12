import { useToastContext } from '@/ui/global/contexts/ToastContext'

export function useToastContextMock(
  returnMock?: Partial<ReturnType<typeof useToastContext>>,
) {
  const show = jest.fn()
  const showSuccess = jest.fn()
  const showError = jest.fn()

  jest.mocked(useToastContext).mockReturnValue({
    show,
    showSuccess,
    showError,
    ...returnMock,
  })

  return {
    show,
    showSuccess,
    showError,
  }
}
