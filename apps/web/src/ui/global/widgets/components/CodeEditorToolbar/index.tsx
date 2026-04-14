'use client'

import { type PropsWithChildren, type RefObject, useRef } from 'react'

import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useAuthContext } from '@/ui/global/hooks/useAuthContext'
import { useEditorContext } from '@/ui/global/hooks/useEditorContext'
import { useLsp } from '@/ui/global/hooks/useLsp'
import { useOperatingSystem } from '@/ui/global/hooks/useOperatingSystem'
import { CodeEditorToolbarView } from './CodeEditorToolbarView'
import { useCodeEditorToolbar } from './useCodeEditorToolbar'
import type { CodeEditorRef } from '../CodeEditor/types'

type Props = {
  originalCode?: string
  codeEditorRef: RefObject<CodeEditorRef | null>
  onRunCode: () => void
  onOpenConsole?: () => void
}

export const CodeEditorToolbar = ({
  children,
  originalCode,
  codeEditorRef,
  onRunCode,
  onOpenConsole,
}: PropsWithChildren<Props>) => {
  const runCodeButtonRef = useRef<HTMLButtonElement | null>(null)
  const guidesDialogButtonRef = useRef<HTMLButtonElement | null>(null)
  const { isAccountAuthenticated } = useAuthContext()
  const { getEditorConfig } = useEditorContext()
  const { lspProvider } = useLsp()
  const { isMacOS } = useOperatingSystem()
  const { getIsAssistantEnabledSlice } = useChallengeStore()
  const { isAssistantEnabled, setIsAssistantEnabled } = getIsAssistantEnabledSlice()
  const { handleKeyDown, handleAssistantButtonClick, handleFormatCode } =
    useCodeEditorToolbar({
      originalCode,
      codeEditorRef,
      runCodeButtonRef,
      guidesDialogButtonRef,
      lspProvider,
      isMacOS,
      onEditorConfig: getEditorConfig,
    })

  return (
    <CodeEditorToolbarView
      runCodeButtonRef={runCodeButtonRef}
      guidesDialogButtonRef={guidesDialogButtonRef}
      onRunCode={onRunCode}
      onOpenConsole={onOpenConsole}
      onKeyDown={handleKeyDown}
      onFormatCode={handleFormatCode}
      onResetCodeButtonClick={handleAssistantButtonClick}
      onAssistantEnabledChange={() => setIsAssistantEnabled(!isAssistantEnabled)}
      isAssistantAllowed={isAccountAuthenticated}
      isMacOS={isMacOS}
    >
      {children}
    </CodeEditorToolbarView>
  )
}
