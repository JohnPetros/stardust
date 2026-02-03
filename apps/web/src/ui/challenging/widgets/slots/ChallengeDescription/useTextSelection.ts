import { TextSelection } from '@stardust/core/global/structures'
import { useCallback, useEffect, useState } from 'react'

type Position = {
  top: number
  left: number
}

type Params = {
  containerRef: React.RefObject<HTMLElement | null>
  setTextSelection: (selection: TextSelection | null) => void
}

export function useTextSelection({ containerRef, setTextSelection }: Params) {
  const [isButtonVisible, setIsButtonVisible] = useState(false)
  const [buttonPosition, setButtonPosition] = useState<Position>({ top: 0, left: 0 })
  const [selectedText, setSelectedText] = useState('')

  const calculateButtonPosition = useCallback(
    (selection: Selection) => {
      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()
      const containerRect = containerRef.current?.getBoundingClientRect()

      if (!containerRect) return { top: 0, left: 0 }

      const offset = 40

      return {
        top: Math.max(rect.top - containerRect.top - offset, 0),
        left: rect.left - containerRect.left + rect.width / 2 - 60,
      }
    },
    [containerRef],
  )

  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection()
    const text = selection?.toString().trim() || ''

    if (!text || !containerRef.current) {
      setIsButtonVisible(false)
      setSelectedText('')
      return
    }
    if (!selection) return

    const range = selection?.getRangeAt(0)
    if (!range) return

    const container = containerRef.current
    const isInsideContainer = container.contains(range.commonAncestorContainer)

    if (!isInsideContainer) {
      setIsButtonVisible(false)
      setSelectedText('')
      return
    }

    setSelectedText(text)
    const position = calculateButtonPosition(selection)
    setButtonPosition(position)
    setIsButtonVisible(true)
  }, [containerRef, calculateButtonPosition])

  function handleAddSelection() {
    if (!selectedText) return

    const preview =
      selectedText.length > 500 ? `${selectedText.slice(0, 500)}...` : selectedText

    setTextSelection(TextSelection.create({ content: selectedText, preview }))

    setIsButtonVisible(false)
    setSelectedText('')
    window.getSelection()?.removeAllRanges()
  }

  function hideButton() {
    setIsButtonVisible(false)
  }

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange)

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange)
    }
  }, [handleSelectionChange])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsButtonVisible(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [containerRef])

  return {
    isButtonVisible,
    buttonPosition,
    selectedText,
    handleAddSelection,
    hideButton,
  }
}
