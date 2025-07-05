import { useEventListener } from './useEventListener'

export function useRefreshPage(
  onRefreshPage: (() => void | Promise<void>) | null = null,
  isEnabled = true,
) {
  async function handlePageRefresh(event: BeforeUnloadEvent) {
    if (!isEnabled) return

    event.preventDefault()
    if (onRefreshPage) await onRefreshPage()
  }

  useEventListener('beforeunload', handlePageRefresh)
}
