import { useState } from 'react'

export function useHeader(playgroundTitle: string) {
  const [title, setTitle] = useState(playgroundTitle)
  const [canEditTitle, setCanEditTitle] = useState(false)

  function handleCanEditTitle() {
    setCanEditTitle(!canEditTitle)
  }

  function handleTitleChange(newTitle: string) {
    setTitle(newTitle)
  }

  return {
    title,
    canEditTitle,
    handleTitleChange,
    handleCanEditTitle,
  }
}
