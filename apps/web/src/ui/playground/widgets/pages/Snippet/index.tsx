'use client'

import { useRef } from 'react'

import type { SnippetDto } from '@stardust/core/playground/entities/dtos'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'
import type { PlaygroundCodeEditorRef } from '@/ui/global/widgets/components/PlaygroundCodeEditor/types'
import { useLsp } from '@/ui/global/hooks/useLsp'
import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { SnippetPageView } from './SnippetPageView'
import { useSnippetPage } from './useSnippetPage'

type SnippetPageProps = {
  snippetDto?: SnippetDto
}

export const SnippetPage = ({ snippetDto }: SnippetPageProps) => {
  const playgroudCodeEditorRef = useRef<PlaygroundCodeEditorRef>(null)
  const authAlertDialogRef = useRef<AlertDialogRef>(null)
  const replaceSnippetAlertDialogRef = useRef<AlertDialogRef>(null)
  const { user } = useAuthContext()
  const { exampleSnippets } = useLsp()
  const { playgroundService } = useRestContext()
  const {
    pageHeight,
    formControl,
    snippetId,
    canExecuteAction,
    snippetFieldErrors,
    isSnippetPublic,
    isActionDisabled,
    isActionSuccess,
    isActionFailure,
    isUserSnippetAuthor,
    isActionExecuting,
    handleRunCode,
    handleActionButtonClick,
    handleAuthAlertDialogConfirm,
    handleExampleSnippetSelect,
    handleExampleSnippetReplaceConfirm,
  } = useSnippetPage({
    userId: user?.id,
    playgroudCodeEditorRef,
    authAlertDialogRef,
    replaceSnippetAlertDialogRef,
    snippetDto,
    playgroundService,
  })

  return (
    <SnippetPageView
      pageHeight={pageHeight}
      formControl={formControl}
      snippetId={snippetId}
      snippetFieldErrors={snippetFieldErrors}
      isSnippetPublic={isSnippetPublic}
      isActionDisabled={isActionDisabled}
      canExecuteAction={canExecuteAction}
      isActionSuccess={isActionSuccess}
      isActionFailure={isActionFailure}
      isActionExecuting={isActionExecuting}
      isUserSnippetAuthor={isUserSnippetAuthor}
      exampleSnippets={exampleSnippets}
      playgroudCodeEditorRef={playgroudCodeEditorRef}
      authAlertDialogRef={authAlertDialogRef}
      replaceSnippetAlertDialogRef={replaceSnippetAlertDialogRef}
      onAuthConfirm={handleAuthAlertDialogConfirm}
      onRunCode={handleRunCode}
      onActionButtonClick={handleActionButtonClick}
      onExampleSnippetSelect={handleExampleSnippetSelect}
      onExampleSnippetReplaceConfirm={handleExampleSnippetReplaceConfirm}
    />
  )
}
