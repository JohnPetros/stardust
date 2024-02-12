'use client'

import { KeyboardEvent, useCallback, useRef, useState } from 'react'

import { useToastContext } from '@/contexts/ToastContext/hooks/useToastContext'
import { APP_ERRORS } from '@/global/constants'
import { useOutsideClick } from '@/global/hooks/useOutsideClick'
import { useApi } from '@/services/api'
import { useSaveButtonStore } from '@/stores/saveButtonStore'

type UsePlaygroundHeaderParams = {
  playgroundId: string
  playgroundTitle: string
  hasPlayground: boolean
  onCreatePlayground: (title: string) => Promise<void>
}

export function usePlaygroundHeader({
  playgroundId,
  playgroundTitle,
  hasPlayground,
  onCreatePlayground,
}: UsePlaygroundHeaderParams) {
  const [title, setTitle] = useState(playgroundTitle)
  const [canEditTitle, setCanEditTitle] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  const setSaveHandler = useSaveButtonStore(
    (store) => store.actions.setSaveHandler
  )
  const setShouldSave = useSaveButtonStore(
    (store) => store.actions.setShouldSave
  )

  const api = useApi()

  const toast = useToastContext()

  const handleEditPlaygroudTitle = useCallback(async () => {
    async function editPlaygroudTitle() {
      try {
        await api.updatePlaygroundTitleById(title, playgroundId)
      } catch (error) {
        console.error(error)
        toast.show(APP_ERRORS.playgrounds.failedTitleEdition, {
          type: 'error',
          seconds: 8,
        })
      }
    }

    setSaveHandler(
      hasPlayground ? editPlaygroudTitle : () => onCreatePlayground(title)
    )
    setShouldSave(true)
    setCanEditTitle(false)
  }, [
    api,
    toast,
    title,
    playgroundId,
    hasPlayground,
    onCreatePlayground,
    setSaveHandler,
    setShouldSave,
  ])

  function handleCanEditTitle() {
    setCanEditTitle(!canEditTitle)
  }

  function handleTitleChange(newTitle: string) {
    setTitle(newTitle)
  }

  async function handleKeyup(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      handleEditPlaygroudTitle()
    }
  }

  async function handleClickOutside() {
    if (canEditTitle) handleEditPlaygroudTitle()
  }

  useOutsideClick(inputRef, handleClickOutside)

  return {
    title,
    inputRef,
    canEditTitle,
    handleTitleChange,
    handleCanEditTitle,
    handleKeyup,
  }
}
