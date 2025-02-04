import { useEffect, useState, type RefObject } from 'react'
import type { ImperativePanelHandle } from 'react-resizable-panels'

import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { COOKIES } from '@/constants'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useSecondsCounter } from '@/ui/global/hooks/useSecondsCounter'
import { ChallengeCraftsVisibility } from '@stardust/core/challenging/structs'
import { useCookieActions } from '@/ui/global/hooks/useCookieActions'
import type { PanelsOffset } from './types/PanelsOffset'

export function useChallengeLayout(
  tabsPanelRef: RefObject<ImperativePanelHandle>,
  codeEditorPanelRef: RefObject<ImperativePanelHandle>,
) {
  const { getChallengeSlice, getCraftsVisibilitySlice, resetStore } = useChallengeStore()
  const { setCraftsVislibility } = getCraftsVisibilitySlice()
  const { challenge } = getChallengeSlice()
  const { user } = useAuthContext()
  const { setCookie } = useCookieActions()
  const [isTransitionPageVisible, setIsTransitionPageVisible] = useState(true)
  const isChallengeCompleted =
    user?.hasCompletedChallenge(challenge?.id ?? '').isTrue ?? false
  useSecondsCounter(isChallengeCompleted)

  async function handlePanelDragging() {
    if (!tabsPanelRef.current || !codeEditorPanelRef.current) return

    const newLayout: PanelsOffset = {
      tabsPanelSize: tabsPanelRef.current?.getSize(),
      codeEditorPanelSize: codeEditorPanelRef.current?.getSize(),
    }

    await setCookie({
      key: COOKIES.keys.challengePanelsOffset,
      value: JSON.stringify(newLayout),
    })
  }

  useEffect(() => {
    let timeout: NodeJS.Timeout | number = 0
    timeout = setTimeout(() => setIsTransitionPageVisible(false), 5000)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  useEffect(() => {
    setCraftsVislibility(
      ChallengeCraftsVisibility.create({
        canShowComments: isChallengeCompleted,
        canShowSolutions: isChallengeCompleted,
      }),
    )
  }, [isChallengeCompleted, setCraftsVislibility])

  return {
    isTransitionPageVisible,
    handlePanelDragging,
  }
}
