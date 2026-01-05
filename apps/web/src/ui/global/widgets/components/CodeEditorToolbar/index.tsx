'use client'

import { type PropsWithChildren, type RefObject, useRef } from 'react'

import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useAuthContext } from '@/ui/global/hooks/useAuthContext'
import { CodeEditorToolbarView } from './CodeEditorToolbarView'
import { useCodeEditorToolbar } from './useCodeEditorToolbar'
import type { CodeEditorRef } from '../CodeEditor/types'

type Props = {
  originalCode?: string
  codeEditorRef: RefObject<CodeEditorRef | null>
  onRunCode: () => void
}

export const CodeEditorToolbar = ({
  children,
  originalCode,
  codeEditorRef,
  onRunCode,
}: PropsWithChildren<Props>) => {
  const runCodeButtonRef = useRef<HTMLButtonElement | null>(null)
  const guidesDialogButtonRef = useRef<HTMLButtonElement | null>(null)
  const { isAccountAuthenticated } = useAuthContext()
  const { getIsAssistantEnabledSlice } = useChallengeStore()
  const { isAssistantEnabled, setIsAssistantEnabled } = getIsAssistantEnabledSlice()
  const { handleKeyDown, handleAssistantButtonClick } = useCodeEditorToolbar({
    originalCode,
    codeEditorRef,
    runCodeButtonRef,
    guidesDialogButtonRef,
  })

  return (
    <CodeEditorToolbarView
      runCodeButtonRef={runCodeButtonRef}
      guidesDialogButtonRef={guidesDialogButtonRef}
      onRunCode={onRunCode}
      onKeyDown={handleKeyDown}
      onResetCodeButtonClick={handleAssistantButtonClick}
      onAssistantEnabledChange={() => setIsAssistantEnabled(!isAssistantEnabled)}
      isAssistantAllowed={isAccountAuthenticated}
    >
      {children}
    </CodeEditorToolbarView>
  )
}
