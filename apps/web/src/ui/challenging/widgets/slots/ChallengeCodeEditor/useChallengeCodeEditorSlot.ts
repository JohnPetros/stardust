'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { Code } from '@stardust/core/global/structs'
import { InsufficientInputsError } from '@stardust/core/challenging/errors'
import { CodeRunnerError } from '@stardust/core/global/errors'

import { ROUTES, STORAGE } from '@/constants'
import { playAudio } from '@/utils'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { useRouter } from '@/ui/global/hooks/useRouter'
import { useCodeRunner } from '@/ui/global/hooks/useCodeRunner'
import type { ConsoleRef } from '@/ui/global/widgets/components/Console/types'
import type { EditorRef } from '@/ui/global/widgets/components/Editor/types'

export function useChallengeCodeEditorSlot() {
  const { getChallengeSlice, getPanelsLayoutSlice, getResults } = useChallengeStore()
  const { setResults } = getResults()
  const { challenge } = getChallengeSlice()
  const { panelsLayout, setPanelsLayout } = getPanelsLayoutSlice()
  const { provider } = useCodeRunner()
  const toast = useToastContext()
  const router = useRouter()
  const userCode = useRef<Code>(Code.create(provider))
  const previousUserCode = useRef('')
  const editorContainerRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<EditorRef>(null)
  const runCodeButtonRef = useRef<HTMLButtonElement>(null)
  const consoleRef = useRef<ConsoleRef>(null)
  const [codeEditorHeight, setCodeEditorHeight] = useState(0)
  const initialCode =
    typeof window !== 'undefined'
      ? localStorage?.getItem(`${STORAGE.keys.challengeCode}:${challenge?.id}`) ??
        challenge?.code ??
        ''
      : ''

  const handleCodeRunnerError = useCallback(
    (message: string, line: number) => {
      function formatErrorLine(errorLine: number) {
        return errorLine > 0 ? `</br>Linha: ${errorLine}` : ''
      }

      toast.show(`${message} ${formatErrorLine(line)}`, {
        type: 'error',
        seconds: 5,
      })
    },
    [toast],
  )

  async function handleRunCode() {
    if (!challenge) return

    try {
      await challenge.runCode(userCode.current)
      setResults(challenge.results.items)
      router.goTo(`${ROUTES.challenging.challenge}/${challenge?.slug.value}/result`)
    } catch (error) {
      if (error instanceof CodeRunnerError) {
        handleCodeRunnerError(error.message, error.line)
        return
      }

      if (error instanceof InsufficientInputsError) {
        toast.show('Não mexa em nenhum comando Leia()!')
        return
      }
    } finally {
      playAudio('running-code.wav')
    }
  }

  function handleCodeChange(value: string) {
    localStorage.setItem(`${STORAGE.keys.challengeCode}:${challenge?.id}`, value)
    // previousUserCode.current = userCode.current
    userCode.current = userCode.current.changeValue(value)
  }

  const handleCodeEditorHeight = useCallback(() => {
    setCodeEditorHeight(editorContainerRef.current?.offsetHeight ?? 0)
  }, [])

  useEffect(() => {
    if (!userCode?.current.value && challenge) {
      userCode.current = Code.create(provider, initialCode)
    }
  }, [challenge, provider, initialCode])

  useEffect(() => {
    if (panelsLayout) {
      handleCodeEditorHeight()
    }
  }, [panelsLayout, handleCodeEditorHeight])

  useEffect(() => {
    window.addEventListener('resize', handleCodeEditorHeight)

    return () => {
      window.removeEventListener('resize', handleCodeEditorHeight)
    }
  }, [handleCodeEditorHeight])

  return {
    userCode,
    previousUserCode,
    editorContainerRef,
    runCodeButtonRef,
    consoleRef,
    editorRef,
    codeEditorHeight,
    initialCode,
    handleRunCode,
    handleCodeChange,
  }
}
