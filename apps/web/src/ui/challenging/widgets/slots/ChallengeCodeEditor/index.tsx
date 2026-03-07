'use client'

import { useChallengeCodeEditorSlot } from './useChallengeCodeEditorSlot'
import { ChallengeCodeEditorSlotView } from './ChallengeCodeEditorSlotView'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useCodeSelection } from './useCodeSelection'

export const ChallengeCodeEditorSlot = () => {
  const {
    initialCode,
    originalCode,
    editorContainerRef,
    codeEditorRef,
    codeEditorHeight,
    consoleRef,
    outputs,
    isMobile,
    handleCodeChange,
    handleRunCode,
    handleOpenConsole,
  } = useChallengeCodeEditorSlot()

  const { isAssistantEnabled } = useChallengeStore().getIsAssistantEnabledSlice()
  const { setCodeSelection } = useChallengeStore().getAssistantSelectionsSlice()

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
      isAssistantEnabled={isAssistantEnabled}
      isSelectionButtonVisible={isButtonVisible}
      selectionButtonPosition={buttonPosition}
      onAddCodeSelection={handleAddSelection}
    />
  )
}
