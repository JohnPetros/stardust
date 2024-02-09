'use client'

import { useRef, useState } from 'react'

import { CodeEditorPlaygroundRef } from '@/app/components/CodeEditorPlayground'
import { useWindowSize } from '@/hooks/useWindowSize'
import { useApi } from '@/services/api'
import { useSaveButtonStore } from '@/stores/saveButtonStore'

export function usePlaygroundLayout(
  playgroundId: string,
  isPlaygroundPublic: boolean
) {
  const [isPublic, setIsPublic] = useState(isPlaygroundPublic)

  const api = useApi()

  const codeEditorPlaygroudRef = useRef<CodeEditorPlaygroundRef>(null)
  const previousUserCode = useRef('')

  const windowSize = useWindowSize()

  const saveButtonActions = useSaveButtonStore((store) => store.actions)

  async function saveCode() {
    const code = codeEditorPlaygroudRef.current?.getValue()

    if (!code) return

    await api.updatePlaygroundCodeById(code, playgroundId)
  }

  async function togglePlaygroundOpen() {
    try {
      if (isPlaygroundPublic)
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

  async function handleSave() {
    saveButtonActions.setSaveHandler(saveCode)
    saveButtonActions.setShouldSave(true)
  }

  async function handleRunCode() {
    codeEditorPlaygroudRef.current?.runUserCode()
  }

  function handleCodeChange(userCode: string) {
    previousUserCode.current = userCode
    saveButtonActions.setCanSave(true)
  }

  return {
    layhoutHeight: windowSize.height,
    isPublic,
    codeEditorPlaygroudRef,
    previousUserCode,
    handleSave,
    handleRunCode,
    handleCodeChange,
    handlePlaygroundSwitch,
  }
}
