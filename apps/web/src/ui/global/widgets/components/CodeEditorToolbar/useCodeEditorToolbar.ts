import { type KeyboardEvent, type RefObject, useRef } from 'react'
import type { CodeEditorRef } from '../CodeEditor/types'

type UseCodeEditorToolbarParams = {
  codeEditorRef: RefObject<CodeEditorRef>
  runCodeButtonRef: RefObject<HTMLButtonElement>
  docsDialogButtonRef: RefObject<HTMLButtonElement>
}

export function useCodeEditorToolbar({
  codeEditorRef,
  runCodeButtonRef,
  docsDialogButtonRef,
}: UseCodeEditorToolbarParams) {
  const hasCodedEditorReset = useRef(false)

  function resetCode() {
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
    docsDialogButtonRef.current?.click()
  }

  function handleCtrlZ() {
    // TODO: handleCtrlZ
  }

  function handleKeyDown({ altKey, ctrlKey, key }: KeyboardEvent) {
    const typedKey = key.toLowerCase()

    if (altKey && typedKey === 'enter') {
      handleAltEnter()
      return
    }

    if (ctrlKey && typedKey === '.') {
      handleCtrlDot()
      return
    }

    if (ctrlKey && typedKey === 'k') {
      handleCtrlK()
      return
    }

    if (ctrlKey && typedKey === 'z') {
      handleCtrlZ()
      return
    }

    hasCodedEditorReset.current = false
  }

  return {
    resetCode,
    handleKeyDown,
  }
}
