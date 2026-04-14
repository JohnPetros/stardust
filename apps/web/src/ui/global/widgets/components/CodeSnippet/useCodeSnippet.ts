import { type RefObject, useEffect, useMemo, useRef } from 'react'

import type { LspProvider } from '@stardust/core/global/interfaces'
import type { EditorContextState } from '@/ui/global/contexts/EditorContext/types'
import type { PlaygroundCodeEditorRef } from '../PlaygroundCodeEditor/types'
import { useClipboard } from '@/ui/global/hooks/useClipboard'

type UseCodeSnippetProps = {
  code: string
  isRunnable?: boolean
  codeEditorRef: RefObject<PlaygroundCodeEditorRef | null>
  lspProvider: LspProvider
  onEditorConfig: () => EditorContextState
}

export function useCodeSnippet({
  codeEditorRef,
  code,
  isRunnable,
  lspProvider,
  onEditorConfig,
}: UseCodeSnippetProps) {
  const { copy } = useClipboard()
  const initialCodeRef = useRef(code)

  useEffect(() => {
    if (!initialCodeRef.current) return

    void (async () => {
      const { formatter, linter, tabSize } = onEditorConfig()
      const formatterConfiguration = {
        ...formatter,
        indentationSize: tabSize,
      }
      const lintedCode =
        linter.isEnabled &&
        (linter.namingConvention.isEnabled || linter.consistentParadigm.isEnabled)
          ? await lspProvider.lintCode(initialCodeRef.current, linter)
          : initialCodeRef.current

      const formattedCode = await lspProvider.formatCode(
        lintedCode,
        formatterConfiguration,
      )

      if (formattedCode === initialCodeRef.current) return

      setTimeout(() => {
        codeEditorRef.current?.setValue(formattedCode)
      }, 1000)
    })()
  }, [codeEditorRef, lspProvider, onEditorConfig])

  async function handleRunCode() {
    codeEditorRef.current?.runCode()
  }

  function handleReloadCodeButtonClick() {
    codeEditorRef.current?.reloadValue()
  }

  async function handleCopyCodeButtonClick() {
    const codeValue = codeEditorRef.current?.getValue()
    if (codeValue) await copy(codeValue, 'Código copiado!')
  }

  const editorHeight = useMemo(() => {
    if (!code) return 0
    const lines = code.split('\n').length

    if (isRunnable) return 100 + lines * (lines >= 10 ? 20 : 32)

    return lines * (lines >= 10 ? 24 : 32)
  }, [code, isRunnable])

  return {
    codeEditorRef,
    editorHeight,
    handleRunCode,
    handleReloadCodeButtonClick,
    handleCopyCodeButtonClick,
  }
}
