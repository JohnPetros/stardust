'use client'

import { useChallengeCodeEditorSlot } from './useChallengeCodeEditorSlot'
import { ChallengeCodeEditorSlotView } from './ChallengeCodeEditorSlotView'

export const ChallengeCodeEditorSlot = () => {
  const {
    initialCode,
    originalCode,
    editorContainerRef,
    codeEditorRef,
    codeEditorHeight,
    handleCodeChange,
    handleRunCode,
  } = useChallengeCodeEditorSlot()

  return (
    <ChallengeCodeEditorSlotView
      editorContainerRef={editorContainerRef}
      codeEditorRef={codeEditorRef}
      codeEditorHeight={codeEditorHeight}
      originalCode={originalCode.value}
      initialCode={initialCode}
      isCodeCheckerDisabled={originalCode.hasFunction.isFalse}
      onCodeChange={handleCodeChange}
      onRunCode={handleRunCode}
    />
  )
}
