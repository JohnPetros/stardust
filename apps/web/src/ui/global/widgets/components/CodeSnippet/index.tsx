'use client'

import { useRef } from 'react'
import type { LessonService } from '@stardust/core/lesson/interfaces'

import { useCodeSnippet } from './useCodeSnippet'
import type { PlaygroundCodeEditorRef } from '../PlaygroundCodeEditor/types'
import { CodeSnippetView } from './CodeSnippetView'
import { useRestContext } from '@/ui/global/hooks/useRestContext'

export type LessonCodeExplanation =
  | { source: 'story'; chunkIndex: number }
  | { source: 'quiz' }

export type CodeSnippetProps = {
  code: string
  isRunnable?: boolean
  onChange?: (code: string) => void
  lessonCodeExplanation?: LessonCodeExplanation
}

export const CodeSnippet = ({
  code,
  isRunnable = false,
  onChange,
  lessonCodeExplanation,
}: CodeSnippetProps) => {
  const { lessonService } = useRestContext()
  const codeEditorRef = useRef<PlaygroundCodeEditorRef>(null)
  const {
    editorHeight,
    handleReloadCodeButtonClick,
    handleCopyCodeButtonClick,
    handleRunCode,
    canExplainCode,
    explanation,
    isCodeExplanationDialogOpen,
    isCodeExplanationAlertDialogOpen,
    codeExplanationAlertDialogMode,
    isGeneratingCodeExplanation,
    isConfirmingCodeExplanation,
    remainingUses,
    handleCodeExplanationButtonClick,
    handleCodeExplanationRetry,
    handleCloseCodeExplanationDialog,
    handleCloseCodeExplanationAlertDialog,
    handleConfirmCodeExplanationAlertDialog,
  } = useCodeSnippet({
    codeEditorRef,
    code,
    isRunnable,
    lessonService: lessonService as LessonService,
    lessonCodeExplanation,
  })

  if (editorHeight)
    return (
      <CodeSnippetView
        code={code}
        isRunnable={isRunnable}
        editorHeight={editorHeight}
        codeEditorRef={codeEditorRef}
        onReloadCodeButtonClick={handleReloadCodeButtonClick}
        onCopyCodeButtonClick={handleCopyCodeButtonClick}
        onRunCode={handleRunCode}
        canExplainCode={canExplainCode}
        explanation={explanation}
        isCodeExplanationDialogOpen={isCodeExplanationDialogOpen}
        isCodeExplanationAlertDialogOpen={isCodeExplanationAlertDialogOpen}
        codeExplanationAlertDialogMode={codeExplanationAlertDialogMode}
        isGeneratingCodeExplanation={isGeneratingCodeExplanation}
        isConfirmingCodeExplanation={isConfirmingCodeExplanation}
        remainingUses={remainingUses}
        onCodeExplanationButtonClick={handleCodeExplanationButtonClick}
        onCodeExplanationRetry={handleCodeExplanationRetry}
        onCloseCodeExplanationDialog={handleCloseCodeExplanationDialog}
        onCloseCodeExplanationAlertDialog={handleCloseCodeExplanationAlertDialog}
        onConfirmCodeExplanationAlertDialog={handleConfirmCodeExplanationAlertDialog}
        onChange={onChange}
      />
    )
}
