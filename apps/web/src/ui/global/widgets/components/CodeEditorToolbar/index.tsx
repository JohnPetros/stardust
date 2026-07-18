'use client'

import { type PropsWithChildren, type ReactNode, type RefObject, useRef } from 'react'
import type { DraggableAttributes, DraggableSyntheticListeners } from '@dnd-kit/core'

import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useAuthContext } from '@/ui/global/hooks/useAuthContext'
import { CodeEditorToolbarView } from './CodeEditorToolbarView'
import { useCodeEditorToolbar } from './useCodeEditorToolbar'
import type { CodeEditorRef } from '../CodeEditor/types'

type Props = {
  originalCode?: string
  codeEditorRef: RefObject<CodeEditorRef | null>
  onRunCode: () => void
  onOpenConsole?: () => void
  isRunCodeLoading?: boolean
  canOpenConsole?: boolean
  options?: {
    customActions?: ReactNode
    shouldHideAssistantButton?: boolean
  }
  dragHandle?: DockablePanelDragHandle | null
}

type DockablePanelDragHandle = {
  attributes: DraggableAttributes
  listeners?: DraggableSyntheticListeners
  setRef: (element: HTMLElement | null) => void
}

export const CodeEditorToolbar = ({
  children,
  originalCode,
  codeEditorRef,
  onRunCode,
  onOpenConsole,
  isRunCodeLoading,
  canOpenConsole = true,
  options,
  dragHandle,
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
      onOpenConsole={canOpenConsole ? onOpenConsole : undefined}
      isRunCodeLoading={isRunCodeLoading}
      onKeyDown={handleKeyDown}
      onResetCodeButtonClick={handleAssistantButtonClick}
      onAssistantEnabledChange={() => setIsAssistantEnabled(!isAssistantEnabled)}
      isAssistantAllowed={isAccountAuthenticated}
      customActions={options?.customActions}
      shouldHideAssistantButton={options?.shouldHideAssistantButton}
      dragHandle={dragHandle ?? undefined}
    >
      {children}
    </CodeEditorToolbarView>
  )
}
