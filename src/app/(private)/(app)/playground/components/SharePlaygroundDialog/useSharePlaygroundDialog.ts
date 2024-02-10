import { useToastContext } from '@/contexts/ToastContext/hooks/useToastContext'
import { APP_ERRORS } from '@/global/constants'
import { useClipboard } from '@/global/hooks/useClipboard'

export function useSharePlaygroundDialog(playgroundUrl: string) {
  const { copy } = useClipboard(playgroundUrl)

  const toast = useToastContext()

  async function handleSharePlayground() {
    try {
      await copy()
      toast.show('Url copiada!', { type: 'success' })
    } catch (error) {
      toast.show(APP_ERRORS.playgrounds.failedCoying, {
        type: 'error',
        seconds: 8,
      })
    }
  }

  return {
    handleSharePlayground,
  }
}
