import { useCallback, useEffect, useState } from 'react'

import { CodeSelection } from '@stardust/core/global/structures'

import type { CodeEditorRef } from '@/ui/global/widgets/components/CodeEditor/types'

type Position = {
  top: number
  left: number
}

type Params = {
  codeEditorRef: React.RefObject<CodeEditorRef | null>
  editorContainerRef: React.RefObject<HTMLDivElement | null>
  setCodeSelection: (selection: CodeSelection | null) => void
}

export function useCodeSelection({
  codeEditorRef,
  editorContainerRef,
  setCodeSelection,
}: Params) {
  const [isButtonVisible, setIsButtonVisible] = useState(false)
  const [buttonPosition, setButtonPosition] = useState<Position>({ top: 0, left: 0 })
  const [selectedRange, setSelectedRange] = useState<{
    start: number
    end: number
  } | null>(null)

  const checkSelection = useCallback(() => {
    const editor = codeEditorRef.current
    const container = editorContainerRef.current

    if (!editor || !container) {
      setIsButtonVisible(false)
      return
    }

    const range = editor.getSelectedLinesRange()

    if (!range || range.start > range.end) {
      setIsButtonVisible(false)
      setSelectedRange(null)
      return
    }

    setSelectedRange(range)

    const containerRect = container.getBoundingClientRect()
    const lineHeight = 20
    const offset = 40
    const top = (range.start - 1) * lineHeight - offset
    const left = containerRect.width / 2 - 60

    setButtonPosition({
      top: Math.max(0, Math.min(top, containerRect.height - 40)),
      left,
    })
    setIsButtonVisible(true)
  }, [codeEditorRef, editorContainerRef])

  function handleAddSelection() {
    if (!selectedRange || !codeEditorRef.current) return

    const editor = codeEditorRef.current
    const fullCode = editor.getValue()
    const lines = fullCode.split('\n')

    const selectedLines = lines.slice(selectedRange.start - 1, selectedRange.end)
    const content = selectedLines.join('\n')

    setCodeSelection(
      CodeSelection.create({
        content,
        startLine: selectedRange.start,
        endLine: selectedRange.end,
      }),
    )

    setIsButtonVisible(false)
    setSelectedRange(null)
  }

  function hideButton() {
    setIsButtonVisible(false)
  }

  useEffect(() => {
    const editor = codeEditorRef.current
    if (!editor) return

    const interval = setInterval(checkSelection, 300)

    return () => {
      clearInterval(interval)
    }
  }, [checkSelection, codeEditorRef])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!editorContainerRef.current?.contains(event.target as Node)) {
        setIsButtonVisible(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [editorContainerRef])

  return {
    isButtonVisible,
    buttonPosition,
    handleAddSelection,
    hideButton,
  }
}
