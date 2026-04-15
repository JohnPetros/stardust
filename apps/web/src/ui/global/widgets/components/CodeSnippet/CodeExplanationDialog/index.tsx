'use client'

import { useCodeExplanationDialog } from './useCodeExplanationDialog'
import { CodeExplanationDialogView } from './CodeExplanationDialogView'

type CodeExplanationDialogProps = {
  isOpen: boolean
  code: string
  explanation: string
  isLoading: boolean
  onRetry: () => void
  onClose: () => void
}

export const CodeExplanationDialog = ({
  isOpen,
  code,
  explanation,
  isLoading,
  onRetry,
  onClose,
}: CodeExplanationDialogProps) => {
  const { codePanelHeight } = useCodeExplanationDialog({ code })

  if (!isOpen) return null

  return (
    <CodeExplanationDialogView
      isOpen={isOpen}
      code={code}
      explanation={explanation}
      isLoading={isLoading}
      codePanelHeight={codePanelHeight}
      onRetry={onRetry}
      onClose={onClose}
    />
  )
}
