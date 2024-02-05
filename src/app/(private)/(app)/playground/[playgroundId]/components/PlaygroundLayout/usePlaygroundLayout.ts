'use client'

import { useRef } from 'react'

import { CodeEditorPlaygroundRef } from '@/app/components/CodeEditorPlayground'
import { useWindowSize } from '@/hooks/useWindowSize'
import { useApi } from '@/services/api'
import { useSaveButtonStore } from '@/stores/saveButtonStore'

export function usePlaygroundLayout(playgroundId: string) {
  const api = useApi()

  const codeEditorPlaygroudRef = useRef<CodeEditorPlaygroundRef>(null)
  const previousUserCode = useRef('')

  const windowSize = useWindowSize()

  const setSaveHandler = useSaveButtonStore(
    (store) => store.actions.setSaveHandler
  )
  const setShouldSave = useSaveButtonStore(
    (store) => store.actions.setShouldSave
  )

  async function saveCode() {
    const code = codeEditorPlaygroudRef.current?.getValue()

    if (!code) return

    await api.updatePlaygroundCodeById(code, playgroundId)
  }

  async function handleSave() {
    setSaveHandler(saveCode)
    setShouldSave(true)
  }

  async function handleRunCode() {
    codeEditorPlaygroudRef.current?.runUserCode()
  }

  function handleCodeChange(userCode: string) {
    previousUserCode.current = userCode
  }

  return {
    layhoutHeight: windowSize.height,
    codeEditorPlaygroudRef,
    previousUserCode,
    handleSave,
    handleRunCode,
    handleCodeChange,
  }
}
