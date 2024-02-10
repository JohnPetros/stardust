'use client'

import { KeyboardEvent, useCallback, useRef, useState } from 'react'

import { useToast } from '@/contexts/ToastContext'
import { useOutsideClick } from '@/hooks/useOutsideClick'
import { useApi } from '@/services/api'
import { useSaveButtonStore } from '@/stores/saveButtonStore'
import { ERRORS } from '@/utils/constants'

export function usePlaygroundHeader(
  playgroundId: string,
  playgroundTitle: string
) {
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
  const toast = useToast()

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
    setSaveHandler(editPlaygroudTitle)
    setShouldSave(true)
    setCanEditTitle(false)
  }, [api, toast, title, playgroundId, setSaveHandler, setShouldSave])

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
    handleEditPlaygroudTitle()
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
