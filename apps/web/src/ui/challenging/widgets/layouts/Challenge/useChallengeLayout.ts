import { useEffect, useState, type RefObject } from 'react'
import type { ImperativePanelHandle } from 'react-resizable-panels'

import { COOKIES } from '@/constants'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useSecondsCounter } from '@/ui/global/hooks/useSecondsCounter'
import { useCookieActions } from '@/ui/global/hooks/useCookieActions'
import type { PanelsOffset } from './types/PanelsOffset'

export function useChallengeLayout(
  tabsPanelRef: RefObject<ImperativePanelHandle | null>,
  codeEditorPanelRef: RefObject<ImperativePanelHandle | null>,
) {
  const { getChallengeSlice } = useChallengeStore()
  const { challenge } = getChallengeSlice()
  const { setCookie } = useCookieActions()
  const [isTransitionPageVisible, setIsTransitionPageVisible] = useState(true)
  const isChallengeCompleted = challenge?.isCompleted.isFalse ?? false
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
    const timeout = setTimeout(() => setIsTransitionPageVisible(false), 5000)
    return () => clearTimeout(timeout)
  }, [])

  return {
    isTransitionPageVisible,
    handlePanelDragging,
  }
}
