import { useEffect, useRef, useState } from 'react'
import { ImperativePanelHandle } from 'react-resizable-panels'

import { PanelsOffset } from '../../actions/_getPanelsOffset'

import { setCookie } from '@/global/actions/setCookie'
import { COOKIES, STORAGE } from '@/global/constants'
import { useChallengeStore } from '@/stores/challengeStore'

export function useChallengeLayout() {
  const challenge = useChallengeStore((store) => store.state.challenge)
  const isEnd = useChallengeStore((store) => store.state.isEnd)
  const resetState = useChallengeStore((store) => store.actions.resetState)
  const setCanShowComments = useChallengeStore(
    (store) => store.actions.setCanShowComments
  )
  const setCanShowSolutions = useChallengeStore(
    (store) => store.actions.setCanShowSolutions
  )

  const [isTransitionPageVisible, setIsTransitionPageVisible] = useState(true)

  const tabsPanelRef = useRef<ImperativePanelHandle>(null)
  const codeEditorPanelRef = useRef<ImperativePanelHandle>(null)

  async function handlePanelDragging() {
    if (!tabsPanelRef.current || !codeEditorPanelRef.current) return

    const newLayout: PanelsOffset = {
      tabsPanelSize: tabsPanelRef.current?.getSize(),
      codeEditorPanelSize: codeEditorPanelRef.current?.getSize(),
    }

    await setCookie(
      COOKIES.keys.challengePanelsOffset,
      JSON.stringify(newLayout)
    )
  }

  useEffect(() => {
    let timeout: NodeJS.Timeout | number = 0

    timeout = setTimeout(() => setIsTransitionPageVisible(false), 5000)

    return () => {
      localStorage.removeItem(STORAGE.keys.challengeCode)
      clearTimeout(timeout)
      resetState()
    }
  }, [resetState])

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
