'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import type { PlaygroundLayoutProps } from './types/PlaygroundLayoutProps'

import { useAuthContext } from '@/contexts/AuthContext/hooks/useAuthContext'
import { useToastContext } from '@/contexts/ToastContext/hooks/useToastContext'
import { CodeEditorPlaygroundRef } from '@/global/components/CodeEditorPlayground'
import { APP_ERRORS } from '@/global/constants'
import { generateId } from '@/global/helpers'
import { useWindowSize } from '@/global/hooks/useWindowSize'
import { useApi } from '@/services/api'
import { useSaveButtonStore } from '@/stores/saveButtonStore'

export function usePlaygroundLayout({
  isPlaygroundPublic,
  playgroundId,
  playgroundUser,
}: Omit<PlaygroundLayoutProps, 'playgroundCode' | 'playgroundTitle'>) {
  const [id, setId] = useState(playgroundId)
  const [isPublic, setIsPublic] = useState(isPlaygroundPublic)
  const [hasPlayground, setHasPlayground] = useState(Boolean(playgroundUser))
  const [isFromAuthUser, setIsFromAuthUser] = useState(false)

  const { user } = useAuthContext()
  const toast = useToastContext()

  const api = useApi()

  const codeEditorPlaygroudRef = useRef<CodeEditorPlaygroundRef>(null)
  const previousUserCode = useRef('')

  const windowSize = useWindowSize()

  const saveButtonActions = useSaveButtonStore((store) => store.actions)

  async function saveCode() {
    try {
      const code = codeEditorPlaygroudRef.current?.getValue()

      if (!code) return

      await api.updatePlaygroundCodeById(code, id)
    } catch (error) {
      console.error(error)
      toast.show(APP_ERRORS.playgrounds.failedCodeEdition, {
        seconds: 8,
      })
    }
  }

  const createPlayground = useCallback(
    async (title: string = 'Sem título') => {
      if (!user) return

      try {
        const code = codeEditorPlaygroudRef.current?.getValue()

        const id = generateId()

        await api.addPlayground({
          id,
          title,
          code,
          isPublic: true,
          user: { id: user.id, slug: user.slug, avatarId: user.avatarId },
        })

        setHasPlayground(true)
        setIsFromAuthUser(true)
        setIsPublic(true)
        setId(id)
      } catch (error) {
        console.error(error)
        toast.show(APP_ERRORS.playgrounds.failedTitleEdition, {
          seconds: 8,
        })
      }
    },
    [api, toast, user]
  )

  async function togglePlaygroundOpen() {
    try {
      await api.updatePublicPlaygroundById(!isPublic, playgroundId)
      setIsPublic(!isPublic)
    } catch (error) {
      console.log(error)
    }
  }

  async function handlePlaygroundSwitch() {
    saveButtonActions.setSaveHandler(togglePlaygroundOpen)
    saveButtonActions.setShouldSave(true)
  }

  async function handleSaveButton() {
    saveButtonActions.setSaveHandler(
      hasPlayground ? saveCode : createPlayground
    )
    saveButtonActions.setShouldSave(true)
  }

  async function handleRunCode() {
    codeEditorPlaygroudRef.current?.runUserCode()
  }

  function handleCodeChange(userCode: string) {
    previousUserCode.current = userCode
    saveButtonActions.setCanSave(true)
  }

  useEffect(() => {
    const isFromAuthUser = playgroundUser?.slug === user?.slug
    setIsFromAuthUser(isFromAuthUser)
    setHasPlayground(Boolean(playgroundUser))
  }, [playgroundUser, user?.slug])

  return {
    layhoutHeight: windowSize.height,
    id,
    isPublic,
    hasPlayground,
    codeEditorPlaygroudRef,
    previousUserCode,
    isFromAuthUser,
    handleSaveButton,
    handleRunCode,
    handleCodeChange,
    handlePlaygroundSwitch,
    onCreatePlayground: createPlayground,
  }
}
