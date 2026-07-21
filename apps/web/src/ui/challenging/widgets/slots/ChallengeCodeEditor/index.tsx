'use client'

import { useChallengeCodeEditorSlot } from './useChallengeCodeEditorSlot'
import { ChallengeCodeEditorSlotView } from './ChallengeCodeEditorSlotView'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useCodeSelection } from './useCodeSelection'
import { useDockablePanelDragHandle } from '../../layouts/Challenge/DockablePanel/DockablePanelDragHandleContext'
import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { useAuthContext } from '@/ui/global/hooks/useAuthContext'

export const ChallengeCodeEditorSlot = () => {
  const dragHandle = useDockablePanelDragHandle()
  const { challengingService } = useRestContext()
  const { isAccountAuthenticated, invalidateSession } = useAuthContext()
  const {
    initialCode,
    originalCode,
    editorContainerRef,
    codeEditorRef,
    codeEditorHeight,
    consoleRef,
    outputs,
    isCodeRunning,
    isMobile,
    handleCodeChange,
    handleRunCode,
    handleOpenConsole,
  } = useChallengeCodeEditorSlot({
    challengingService,
    isAccountAuthenticated,
    onUnauthorized: invalidateSession,
  })

  const challengeStore = useChallengeStore()
  const { isAssistantEnabled } = challengeStore.getIsAssistantEnabledSlice()
  const { setCodeSelection } = challengeStore.getAssistantSelectionsSlice()
  const { challenge } = challengeStore.getChallengeSlice()

  const { isButtonVisible, buttonPosition, handleAddSelection } = useCodeSelection({
    codeEditorRef,
    editorContainerRef,
    setCodeSelection,
  })

  return (
    <ChallengeCodeEditorSlotView
      editorContainerRef={editorContainerRef}
      codeEditorRef={codeEditorRef}
      codeEditorHeight={codeEditorHeight}
      consoleRef={consoleRef}
      outputs={outputs}
      isMobile={isMobile}
      originalCode={originalCode.value}
      initialCode={initialCode}
      isCodeCheckerDisabled={originalCode.hasFunction.isFalse}
      onCodeChange={handleCodeChange}
      onRunCode={handleRunCode}
      onOpenConsole={handleOpenConsole}
      isRunCodeLoading={isCodeRunning}
      shouldShowConsole={challenge?.isEvaluatedByFunction.isFalse ?? true}
      isAssistantEnabled={isAssistantEnabled}
      isSelectionButtonVisible={isButtonVisible}
      selectionButtonPosition={buttonPosition}
      onAddCodeSelection={handleAddSelection}
      dragHandle={dragHandle}
    />
  )
}
