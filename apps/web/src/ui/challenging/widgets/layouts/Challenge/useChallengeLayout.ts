import { useEffect, useState, type RefObject } from 'react'
import type { ImperativePanelHandle } from 'react-resizable-panels'

import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { COOKIES, STORAGE } from '@/constants'
import { _setCookie } from '@/ui/global/actions'
import type { PanelsOffset } from './types/PanelsOffset'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useSecondsCounter } from '@/ui/global/hooks/useSecondsCounter'
import { ChallengeCraftsVisibility } from '@stardust/core/challenging/structs'

export function useChallengeLayout(
  tabsPanelRef: RefObject<ImperativePanelHandle>,
  codeEditorPanelRef: RefObject<ImperativePanelHandle>,
) {
  const { getChallengeSlice, getCraftsVisibilitySlice, resetStore } = useChallengeStore()
  const { setCraftsVislibility } = getCraftsVisibilitySlice()
  const { challenge } = getChallengeSlice()
  const { user } = useAuthContext()
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

    await _setCookie(COOKIES.keys.challengePanelsOffset, JSON.stringify(newLayout))
  }

  useEffect(() => {
    let timeout: NodeJS.Timeout | number = 0

    timeout = setTimeout(() => setIsTransitionPageVisible(false), 5000)

    return () => {
      localStorage.removeItem(STORAGE.keys.challengeCode)
      clearTimeout(timeout)
      resetStore()
    }
  }, [resetStore])

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
