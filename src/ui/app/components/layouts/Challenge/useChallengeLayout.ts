import { useEffect, useRef, useState } from 'react'

import { useChallengeStore } from '@/ui/app/stores/ChallengeStore'
import { COOKIES, STORAGE } from '@/ui/global/constants'
import { _setCookie } from '@/ui/global/actions'

export function useChallengeLayout() {
  const { getChallengeSlice, resetStore } = useChallengeStore()
  const { challenge } = getChallengeSlice()
  const [isTransitionPageVisible, setIsTransitionPageVisible] = useState(true)
  const tabsPanelRef = useRef<ImperativePanelHandle>(null)
  const codeEditorPanelRef = useRef<ImperativePanelHandle>(null)

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
  }, [])

  useEffect(() => {
    setCanShowComments(isEnd)
  }, [isEnd, setCanShowComments])

  useEffect(() => {
    if (!challenge) return

    setCanShowComments(challenge.isCompleted ?? false)
    setCanShowSolutions(challenge.isCompleted ?? false)
  }, [challenge, setCanShowComments, setCanShowSolutions])

  return {
    tabsPanelRef,
    codeEditorPanelRef,
    isTransitionPageVisible,
    handlePanelDragging,
  }
}
