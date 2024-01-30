import { useEffect, useRef, useState } from 'react'
import { ImperativePanelHandle } from 'react-resizable-panels'

import { PanelsOffset } from '../../actions/getPanelsOffset'

import { setCookie } from '@/app/server/actions/setCookie'
import { useChallengeStore } from '@/stores/challengeStore'
import { COOKIES, STORAGE } from '@/utils/constants'

export function useLayout() {
  const resetState = useChallengeStore((store) => store.actions.resetState)

  const [isTransitionPageVisible, setIsTransitionPageVisible] = useState(true)

  const tabsPanelRef = useRef<ImperativePanelHandle>(null)
  const codeEditorPanelRef = useRef<ImperativePanelHandle>(null)

  async function handlePanelDragging() {
    if (!tabsPanelRef.current || !codeEditorPanelRef.current) return

    const newLayout: PanelsOffset = {
      tabsPanelSize: tabsPanelRef.current?.getSize(),
      codeEditorPanelSize: codeEditorPanelRef.current?.getSize(),
    }

    await setCookie(COOKIES.challengePanelsOffset, JSON.stringify(newLayout))
  }

  useEffect(() => {
    let timeout: NodeJS.Timeout | number = 0

    timeout = setTimeout(() => setIsTransitionPageVisible(false), 5000)

    return () => {
      resetState()
      localStorage.removeItem(STORAGE.challengeCode)
      clearTimeout(timeout)
    }
  }, [resetState])

  return {
    tabsPanelRef,
    codeEditorPanelRef,
    isTransitionPageVisible,
    handlePanelDragging,
  }
}
