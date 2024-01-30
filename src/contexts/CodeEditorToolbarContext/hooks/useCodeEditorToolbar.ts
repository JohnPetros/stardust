import { KeyboardEvent, RefObject } from 'react'

import { CodeEditorRef } from '@/app/components/CodeEditor'

type UseCodeEditorToolbarParams = {
  codeEditorRef: RefObject<CodeEditorRef>
  runCodeButtonRef: RefObject<HTMLButtonElement>
  onChangeCode: (newCode: string) => void
}

export function useCodeEditorToolbar({
  codeEditorRef,
  runCodeButtonRef,
  onChangeCode,
}: UseCodeEditorToolbarParams) {
  function handleShiftEnter() {
    if (!codeEditorRef.current) return

    runCodeButtonRef.current?.click()

    const currentCursorPosition = codeEditorRef.current?.getCursorPosition()

    const currentValue = codeEditorRef.current.getValue()
    onChangeCode(currentValue)

    setTimeout(() => {
      codeEditorRef.current?.setValue(currentValue)

      if (currentCursorPosition)
        codeEditorRef.current?.setCursorPosition(currentCursorPosition)
    }, 15)
  }

  function handleSelectedLines(line: string, selectedLines: string[]) {
    const isSelected = selectedLines.includes(line) && line !== ''
    const isCommented = line.slice(0, 2) == '//'

    if (isSelected && isCommented) {
      return line.replace('//', '').trimStart()
    } else if (isSelected) {
      return '// ' + line
    } else {
      return line
    }
  }

  function handleCtrlDot() {
    const currentValue = codeEditorRef.current?.getValue()
    if (!currentValue) return

    const selectedLinesRange = codeEditorRef.current?.getSelectedLinesRange()
    if (!selectedLinesRange) return

    const lines = currentValue.split('\n')

    const selectedLines = lines.slice(
      selectedLinesRange.start - 1,
      selectedLinesRange.end
    )

    const newLines = lines.map((line) =>
      handleSelectedLines(line, selectedLines)
    )

    codeEditorRef.current?.setValue(newLines.join('\n'))
    codeEditorRef.current?.setCursorPosition({
      lineNumber: selectedLinesRange.start,
      columnNumber: 1,
    })
  }

  function handleKeyDown({ shiftKey, ctrlKey, key }: KeyboardEvent) {
    if (shiftKey && key.toLowerCase() === 'enter') {
      handleShiftEnter()
      return
    }

    if (ctrlKey && key === '.') {
      handleCtrlDot()
      return
    }
  }

  return {
    handleKeyDown,
  }
}
