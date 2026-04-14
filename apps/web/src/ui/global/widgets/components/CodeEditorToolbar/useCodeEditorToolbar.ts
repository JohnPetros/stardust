import { type KeyboardEvent, type RefObject, useRef } from 'react'

import type { LspProvider } from '@stardust/core/global/interfaces'

import type { EditorContextState } from '@/ui/global/contexts/EditorContext/types'
import type { CodeEditorRef } from '../CodeEditor/types'

type UseCodeEditorToolbarParams = {
  originalCode?: string
  codeEditorRef: RefObject<CodeEditorRef | null>
  runCodeButtonRef: RefObject<HTMLButtonElement | null>
  guidesDialogButtonRef: RefObject<HTMLButtonElement | null>
  lspProvider: LspProvider
  isMacOS: boolean
  onEditorConfig: () => EditorContextState
}

export function useCodeEditorToolbar({
  originalCode,
  codeEditorRef,
  runCodeButtonRef,
  guidesDialogButtonRef,
  lspProvider,
  isMacOS,
  onEditorConfig,
}: UseCodeEditorToolbarParams) {
  const hasCodedEditorReset = useRef(false)

  function handleResetCodeButtonClick() {
    if (originalCode) {
      codeEditorRef.current?.setValue(originalCode)
      return
    }
    codeEditorRef.current?.reloadValue()
  }

  function handleAssistantButtonClick() {
    if (originalCode) {
      codeEditorRef.current?.setValue(originalCode)
      return
    }
    codeEditorRef.current?.reloadValue()
  }

  function handleAltEnter() {
    if (!codeEditorRef.current) return
    runCodeButtonRef.current?.click()
  }

  function handleSelectedLines(line: string, selectedLines: string[]) {
    const isSelected = selectedLines.includes(line) && line !== ''
    const isCommented = line.slice(0, 2) === '//'

    if (isSelected && isCommented) {
      return line.replace('//', '').trimStart()
    }
    if (isSelected) {
      return `// ${line}`
    }
    return line
  }

  function handleCtrlDot() {
    const currentValue = codeEditorRef.current?.getValue()
    if (!currentValue) return

    const selectedLinesRange = codeEditorRef.current?.getSelectedLinesRange()
    if (!selectedLinesRange) return

    const lines = currentValue.split('\n')

    const selectedLines = lines.slice(
      selectedLinesRange.start - 1,
      selectedLinesRange.end,
    )

    const newLines = lines.map((line) => handleSelectedLines(line, selectedLines))

    codeEditorRef.current?.setValue(newLines.join('\n'))
    codeEditorRef.current?.setCursorPosition({
      lineNumber: selectedLinesRange.start,
      columnNumber: 1,
    })

    hasCodedEditorReset.current = true
  }

  function handleCtrlK() {
    guidesDialogButtonRef.current?.click()
  }

  function handleCtrlZ() {
    codeEditorRef.current?.undoValue()
  }

  async function handleFormatCode() {
    const currentCode = codeEditorRef.current?.getValue()

    if (!currentCode) return

    const { formatter, linter, tabSize } = onEditorConfig()
    const formatterConfiguration = {
      ...formatter,
      indentationSize: tabSize,
    }

    try {
      const lintedCode =
        linter.isEnabled &&
        (linter.namingConvention.isEnabled || linter.consistentParadigm.isEnabled)
          ? await lspProvider.lintCode(currentCode, linter)
          : currentCode
      const formattedCode = await lspProvider.formatCode(
        lintedCode,
        formatterConfiguration,
      )

      codeEditorRef.current?.setValue(formattedCode)
    } catch {
      codeEditorRef.current?.setValue(currentCode)
    }
  }

  function handleKeyDown({ altKey, ctrlKey, metaKey, key }: KeyboardEvent) {
    const typedKey = key.toLowerCase()
    const isPrimaryModifierPressed = isMacOS ? metaKey : ctrlKey

    if (altKey && typedKey === 'enter') {
      handleAltEnter()
      return
    }

    if (isPrimaryModifierPressed && typedKey === 'm') {
      void handleFormatCode()
      return
    }

    if (isPrimaryModifierPressed && typedKey === '.') {
      handleCtrlDot()
      return
    }

    if (isPrimaryModifierPressed && typedKey === 'k') {
      handleCtrlK()
      return
    }

    if (isPrimaryModifierPressed && typedKey === 'z') {
      handleCtrlZ()
      return
    }

    hasCodedEditorReset.current = false
  }

  return {
    handleResetCodeButtonClick,
    handleAssistantButtonClick,
    handleKeyDown,
    handleFormatCode,
  }
}
