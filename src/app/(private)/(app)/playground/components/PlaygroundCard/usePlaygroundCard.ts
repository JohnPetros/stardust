'use client'

import { useEffect, useRef, useState } from 'react'

import { useToastContext } from '@/contexts/ToastContext/hooks/useToastContext'
import { PromptRef } from '@/global/components/Prompt'
import { APP_ERRORS, ROUTES } from '@/global/constants'
import { getAppBaseUrl } from '@/global/helpers'
import { useClipboard } from '@/global/hooks/useClipboard'
import { useApi } from '@/services/api'

export function usePlaygroundCard(
  id: string,
  initialTitle: string,
  onDelete: (deletedPlaygroundId: string) => void
) {
  const [title, setTitle] = useState(initialTitle)

  const playgroundUrl = `${getAppBaseUrl()}${ROUTES.private.playground}/${id}`

  const { copy } = useClipboard(playgroundUrl)

  const api = useApi()
  const toast = useToastContext()

  const promptRef = useRef<PromptRef>(null)

  async function handleDeletePlayground() {
    try {
      await api.deletePlaygroundById(id)
      onDelete(id)
    } catch (error) {
      console.error(error)
      toast.show(APP_ERRORS.playgrounds.failedDeletion)
    }
  }

  async function handleEditPlaygroundTitle() {
    const newTitle = promptRef.current?.value
    if (!newTitle) return

    try {
      await api.updatePlaygroundTitleById(newTitle, id)
      setTitle(newTitle)
    } catch (error) {
      console.error(error)
      toast.show(APP_ERRORS.playgrounds.failedTitleEdition, {
        seconds: 4,
        type: 'error',
      })
    } finally {
      promptRef.current.setValue('')
    }
  }

  async function handleSharePlayground() {
    try {
      await copy()
      toast.show('Url copiada!', { type: 'success' })
    } catch (error) {
      toast.show(APP_ERRORS.playgrounds.failedCoying, {
        type: 'error',
        seconds: 8,
      })
    }
  }

  useEffect(() => {
    setTitle(initialTitle)
  }, [initialTitle])

  return {
    title,
    playgroundUrl,
    promptRef,
    handleDeletePlayground,
    handleSharePlayground,
    handleEditPlaygroundTitle,
  }
}
