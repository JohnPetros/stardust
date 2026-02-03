import { useCallback, useEffect, useState, type RefObject, useRef } from 'react'
import { TextSelection } from '@stardust/core/global/structures'

type Position = {
  top: number
  left: number
}

type UseTextSelectionProps = {
  containerRef: RefObject<HTMLDivElement | null>
  setTextSelection: (selection: TextSelection | null) => void
}

export const useTextSelection = ({
  containerRef,
  setTextSelection,
}: UseTextSelectionProps) => {
  const [isButtonVisible, setIsButtonVisible] = useState(false)
  const [buttonPosition, setButtonPosition] = useState<Position>({ top: 0, left: 0 })
  const [selectedText, setSelectedText] = useState('')
  const isSelectingRef = useRef(false)

  const handleSelection = useCallback(() => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      setIsButtonVisible(false)
      return
    }

    const range = selection.getRangeAt(0)
    const container = containerRef.current

    if (!container || !container.contains(range.commonAncestorContainer)) {
      setIsButtonVisible(false)
      return
    }

    const rect = range.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()

    const text = selection.toString().trim()
    if (!text) {
      setIsButtonVisible(false)
      return
    }

    setSelectedText(text)

    // Calculate position
    const rawTop = rect.top - containerRect.top - 45
    const rawLeft = rect.left - containerRect.left + rect.width / 2 - 50

    const maxTop = Math.max(0, containerRect.height - 40)
    const maxLeft = Math.max(0, containerRect.width - 100)

    setButtonPosition({
      top: Math.max(0, Math.min(rawTop, maxTop)),
      left: Math.max(0, Math.min(rawLeft, maxLeft)),
    })
    setIsButtonVisible(true)
  }, [containerRef])

  useEffect(() => {
    const handleMouseDown = () => {
      isSelectingRef.current = true
    }

    const handleMouseUp = () => {
      isSelectingRef.current = false
      requestAnimationFrame(handleSelection)
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (
        e.shiftKey &&
        (e.key.startsWith('Arrow') || e.key === 'Home' || e.key === 'End')
      ) {
        handleSelection()
      }
    }

    document.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleSelection])

  useEffect(() => {
    const handleSelectionChange = () => {
      if (isSelectingRef.current) return

      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
        setIsButtonVisible(false)
        return
      }

      const range = selection.getRangeAt(0)
      const container = containerRef.current

      if (!container || !container.contains(range.commonAncestorContainer)) {
        setIsButtonVisible(false)
      }
    }

    document.addEventListener('selectionchange', handleSelectionChange)
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange)
    }
  }, [containerRef])

  const handleAddSelection = useCallback(() => {
    if (!selectedText) return

    const preview =
      selectedText.length > 500 ? `${selectedText.substring(0, 500)}...` : selectedText

    setTextSelection(
      TextSelection.create({
        content: selectedText,
        preview,
      }),
    )

    setIsButtonVisible(false)
    window.getSelection()?.removeAllRanges()
  }, [selectedText, setTextSelection])

  return {
    isButtonVisible,
    buttonPosition,
    handleAddSelection,
  }
}
