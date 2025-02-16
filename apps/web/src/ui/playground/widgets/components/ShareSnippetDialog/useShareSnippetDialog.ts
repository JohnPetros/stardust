import { useClipboard } from '@/ui/global/hooks/useClipboard'

export function useShareSnippetDialog(snippetUrl: string) {
  const { copy } = useClipboard()

  async function handleShareSnippet() {
    await copy(snippetUrl, 'Url copiada!')
  }

  return {
    handleShareSnippet,
  }
}
