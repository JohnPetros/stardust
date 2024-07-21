'use client'

import { useOutsideClick } from '@/modules/global/hooks/useOutsideClick'
import { useRef, useState } from 'react'

export function useEditableTitle(
  initialTitle: string,
  onEditTitle: (title: string) => Promise<void>
) {
  const [title, setTitle] = useState(initialTitle)
  const [canEditTitle, setCanEditTitle] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  function handleCanEditTitle() {
    setCanEditTitle(!canEditTitle)
  }

  async function handleKeyup(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      await onEditTitle(title)
      setCanEditTitle(false)
    }
  }

  async function handleButtonClick() {
    await onEditTitle(title)
  }

  function handleTitleChange(newTitle: string) {
    setTitle(newTitle)
  }

  async function handleClickOutside() {
    if (canEditTitle) {
      await onEditTitle(title)
      setCanEditTitle(false)
    }
  }

  useOutsideClick(inputRef, handleClickOutside)

  return {
    title,
    inputRef,
    canEditTitle,
    handleTitleChange,
    handleCanEditTitle,
    handleButtonClick,
    handleKeyup,
  }
}
