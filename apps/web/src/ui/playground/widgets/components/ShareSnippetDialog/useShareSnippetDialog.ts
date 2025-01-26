import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { useClipboard } from '@/ui/global/hooks/useClipboard'

export function useShareSnippetDialog(snippetUrl: string) {
  const { copy } = useClipboard(snippetUrl)
  const toast = useToastContext()

  async function handleShareSnippet() {
    await copy()
    toast.show('Url copiada!', { type: 'success' })
  }

  return {
    handleShareSnippet,
  }
}
