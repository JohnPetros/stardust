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
  const [isDismissed, setIsDismissed] = useState(false)

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
      setIsDismissed(false)
      return
    }

    // Verifica se é uma nova seleção diferente da anterior
    const isNewSelection =
      !selectedRange ||
      selectedRange.start !== range.start ||
      selectedRange.end !== range.end

    // Se é uma nova seleção, reseta o estado de dismissed
    if (isNewSelection) {
      setIsDismissed(false)
    }

    // Se o usuário descartou o tooltip e ainda está na mesma seleção, não mostra
    if (isDismissed && !isNewSelection) {
      return
    }

    if (!isNewSelection) {
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
  }, [codeEditorRef, editorContainerRef, isDismissed, selectedRange])

  function handleAddSelection() {
    if (!selectedRange || !codeEditorRef.current) return

    const editor = codeEditorRef.current

    // Pega o texto exatamente como foi selecionado
    const selectedText = editor.getSelectedText()

    if (!selectedText) return

    setCodeSelection(
      CodeSelection.create({
        content: selectedText,
        startLine: selectedRange.start,
        endLine: selectedRange.end,
      }),
    )

    setIsButtonVisible(false)
    setSelectedRange(null)
    setIsDismissed(false)
  }

  function hideButton() {
    setIsButtonVisible(false)
    setIsDismissed(true)
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
        setIsDismissed(true)
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
