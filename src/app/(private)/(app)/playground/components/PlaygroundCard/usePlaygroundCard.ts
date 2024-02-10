'use client'

import { useRef, useState } from 'react'

import { PromptRef } from '@/app/components/Prompt'
import { useToast } from '@/contexts/ToastContext'
import { useClipboard } from '@/hooks/useClipboard'
import { useApi } from '@/services/api'
import { APP_ERRORS, ROUTES } from '@/utils/constants'
import { getAppBaseUrl } from '@/utils/helpers'

export function usePlaygroundCard(id: string, initialTitle: string) {
  const [title, setTitle] = useState(initialTitle)

  const playgroundUrl = `${getAppBaseUrl()}${ROUTES.private.playground}/${id}`

  const { copy } = useClipboard(playgroundUrl)

  const api = useApi()
  const toast = useToast()

  const promptRef = useRef<PromptRef>(null)

  async function handleDeletePlayground() {
    await api.deletePlaygroundById(id)
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

  return {
    title,
    playgroundUrl,
    promptRef,
    handleDeletePlayground,
    handleSharePlayground,
    handleEditPlaygroundTitle,
  }
}
