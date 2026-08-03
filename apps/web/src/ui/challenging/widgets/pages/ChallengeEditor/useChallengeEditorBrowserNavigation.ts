import { useCallback, useEffect, useRef } from 'react'

type NavigationDestination = {
  key?: string | null
  sameDocument?: boolean
  url?: string
}

type NavigateEvent = Event & {
  canIntercept?: boolean
  destination: NavigationDestination
  navigationType?: string
  intercept?: (options: { handler: () => Promise<void> }) => void
}

type Navigation = EventTarget & {
  currentEntry?: { key?: string | null }
  addEventListener: typeof window.addEventListener
  removeEventListener: typeof window.removeEventListener
  traverseTo: (key: string) => Promise<unknown> | unknown
}

type NavigationRequest = {
  href: string
  navigate: () => void
}

type Params = {
  isDirty: boolean
  onNavigationRequest?: (request: NavigationRequest) => void
  onNavigationAllowed?: () => void
  onNavigationRestored?: () => void
}

type Result = {
  runWithNavigationBypass: (navigation: () => void) => void
}

const navigationCancelError = () =>
  new DOMException('The navigation was canceled by the editor guard.', 'AbortError')

function getBrowserNavigation(): Navigation | null {
  if (typeof window === 'undefined') return null
  return (window as Window & { navigation?: Navigation }).navigation ?? null
}

export function useChallengeEditorBrowserNavigation({
  isDirty,
  onNavigationRequest,
  onNavigationAllowed,
  onNavigationRestored,
}: Params): Result {
  const bypassRef = useRef(false)
  const callbacksRef = useRef({
    onNavigationRequest,
    onNavigationAllowed,
    onNavigationRestored,
  })
  callbacksRef.current = {
    onNavigationRequest,
    onNavigationAllowed,
    onNavigationRestored,
  }

  const runWithNavigationBypass = useCallback((navigation: () => void) => {
    bypassRef.current = true
    try {
      navigation()
    } finally {
      bypassRef.current = false
    }
  }, [])

  useEffect(() => {
    if (!isDirty || typeof window === 'undefined') return

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (bypassRef.current) return
      event.preventDefault()
      event.returnValue = ''
    }

    const handleInternalLink = (event: MouseEvent) => {
      if (bypassRef.current || event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const target = event.target
      if (!(target instanceof Element)) return
      const anchor = target.closest('a')
      if (!(anchor instanceof HTMLAnchorElement)) return
      if (anchor.hasAttribute('download')) return
      if (anchor.target && anchor.target !== '_self') return

      const url = new URL(anchor.href, window.location.href)
      if (url.origin !== window.location.origin) return

      event.preventDefault()
      callbacksRef.current.onNavigationRequest?.({
        href: url.href,
        navigate: () => runWithNavigationBypass(() => anchor.click()),
      })
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('click', handleInternalLink, true)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('click', handleInternalLink, true)
    }
  }, [isDirty, runWithNavigationBypass])

  useEffect(() => {
    const navigation = getBrowserNavigation()
    if (!navigation) return

    let editorEntryKey = navigation.currentEntry?.key ?? null
    let pendingTraversal: {
      destinationKey: string
      editorEntryKey: string
    } | null = null
    let isRestoringEntry = false

    const handleCurrentEntryChange = () => {
      // A confirmed traversal normally reaches this event without re-entering
      // `navigate`; consume the same one-shot bypass at that boundary too.
      bypassRef.current = false
      if (pendingTraversal || isRestoringEntry) return
      editorEntryKey = navigation.currentEntry?.key ?? null
    }

    const handleNavigate = (event: Event) => {
      if (bypassRef.current) {
        bypassRef.current = false
        return
      }
      if (!isDirty || pendingTraversal || isRestoringEntry) return
      const navigateEvent = event as NavigateEvent
      const destinationKey = navigateEvent.destination?.key
      if (
        navigateEvent.navigationType !== 'traverse' ||
        !destinationKey ||
        !editorEntryKey ||
        destinationKey === editorEntryKey ||
        navigateEvent.destination.sameDocument !== true ||
        navigateEvent.canIntercept !== true ||
        typeof navigateEvent.intercept !== 'function'
      )
        return

      const originalEntryKey = editorEntryKey
      pendingTraversal = {
        destinationKey,
        editorEntryKey: originalEntryKey,
      }

      try {
        navigateEvent.intercept({
          handler: async () => {
            const confirmed = window.confirm(
              'Você tem alterações não salvas. Deseja sair?',
            )
            if (confirmed) {
              // The Navigation API may re-enter the navigate listener while
              // the accepted traversal is being committed. Let that original
              // transition pass exactly once, without disabling the guard.
              bypassRef.current = true
              pendingTraversal = null
              callbacksRef.current.onNavigationAllowed?.()
              return
            }

            isRestoringEntry = true
            try {
              await Promise.resolve(navigation.traverseTo(originalEntryKey))
            } catch {
              // A failed restoration must still abort the original traversal.
            } finally {
              isRestoringEntry = false
              pendingTraversal = null
              callbacksRef.current.onNavigationRestored?.()
            }
            throw navigationCancelError()
          },
        })
      } catch {
        pendingTraversal = null
      }
    }

    navigation.addEventListener('currententrychange', handleCurrentEntryChange)
    if (isDirty) navigation.addEventListener('navigate', handleNavigate)

    return () => {
      navigation.removeEventListener('currententrychange', handleCurrentEntryChange)
      if (isDirty) navigation.removeEventListener('navigate', handleNavigate)
      editorEntryKey = null
      pendingTraversal = null
      isRestoringEntry = false
      bypassRef.current = false
    }
  }, [isDirty])

  return { runWithNavigationBypass }
}

export type { NavigationRequest, Params as ChallengeEditorBrowserNavigationParams }
