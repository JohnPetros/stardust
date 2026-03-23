import { useState, type RefObject } from 'react'

import type { Challenge } from '@stardust/core/challenging/entities'
import type { NavigationProvider } from '@stardust/core/global/interfaces'

import { STORAGE } from '@/constants'
import { useLocalStorage } from '@/ui/global/hooks/useLocalStorage'
import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'

type Params = {
  challenge: Challenge | null
  navigationProvider: NavigationProvider
  dialogRef: RefObject<AlertDialogRef | null>
}

export function useChallengeNavigationGuard({
  challenge,
  navigationProvider,
  dialogRef,
}: Params) {
  const [pendingRoute, setPendingRoute] = useState<string | null>(null)
  const challengeCodeLocalStorage = useLocalStorage<string>(
    STORAGE.keys.challengeCode(challenge?.id.value ?? ''),
  )

  function isDirty() {
    if (!challenge) return false

    const draftCode = challengeCodeLocalStorage.get()
    if (draftCode === null) return false

    return draftCode !== challenge.code
  }

  function requestNavigation(route: string): void {
    if (!isDirty()) {
      navigationProvider.goTo(route)
      return
    }

    setPendingRoute(route)
    dialogRef.current?.open()
  }

  function confirmNavigation(): void {
    challengeCodeLocalStorage.remove()
    dialogRef.current?.close()

    const route = pendingRoute
    setPendingRoute(null)

    if (!route) return

    navigationProvider.goTo(route)
  }

  function cancelNavigation(): void {
    setPendingRoute(null)
    dialogRef.current?.close()
  }

  return {
    requestNavigation,
    confirmNavigation,
    cancelNavigation,
    isDirty,
  }
}
