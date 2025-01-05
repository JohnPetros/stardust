import { type KeyboardEvent, type RefObject, useRef } from 'react'
import type { EditorRef } from '../Editor/types'

type UseCodeEditorToolbarParams = {
  previousUserCode: RefObject<string>
  codeEditorRef: RefObject<EditorRef>
  runCodeButtonRef: RefObject<HTMLButtonElement>
  docsDialogButtonRef: RefObject<HTMLButtonElement>
}

export function useCodeEditorToolbar({
  previousUserCode,
  codeEditorRef,
  runCodeButtonRef,
  docsDialogButtonRef,
}: UseCodeEditorToolbarParams) {
  const hasCodedEditorReset = useRef(false)

  function resetCode() {
    codecodeEditorRef.current?.reloadValue()
  }

  function handleAltEnter() {
    if (!codecodeEditorRef.current) return
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
    const currentValue = codecodeEditorRef.current?.getValue()
    if (!currentValue) return

    const selectedLinesRange = codecodeEditorRef.current?.getSelectedLinesRange()
    if (!selectedLinesRange) return

    const lines = currentValue.split('\n')

    const selectedLines = lines.slice(
      selectedLinesRange.start - 1,
      selectedLinesRange.end,
    )

    const newLines = lines.map((line) => handleSelectedLines(line, selectedLines))

    codecodeEditorRef.current?.setValue(newLines.join('\n'))
    codecodeEditorRef.current?.setCursorPosition({
      lineNumber: selectedLinesRange.start,
      columnNumber: 1,
    })

    hasCodedEditorReset.current = true
  }

  function handleCtrlK() {
    docsDialogButtonRef.current?.click()
  }

  function handleCtrlZ() {
    if (
      hasCodedEditorReset.current &&
      codecodeEditorRef.current &&
      previousUserCode.current
    ) {
      const cursorPosition = codecodeEditorRef.current?.getCursorPosition()

      codecodeEditorRef.current.setValue(previousUserCode.current)
      if (cursorPosition) codecodeEditorRef.current?.setCursorPosition(cursorPosition)
    }
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
