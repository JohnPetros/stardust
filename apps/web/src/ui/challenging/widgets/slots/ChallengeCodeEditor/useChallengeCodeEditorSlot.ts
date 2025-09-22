import { useCallback, useEffect, useRef, useState } from 'react'

import { Code } from '@stardust/core/global/structures'
import { InsufficientInputsError } from '@stardust/core/challenging/errors'
import { CodeRunnerError } from '@stardust/core/global/errors'

import { ROUTES, STORAGE } from '@/constants'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { useCodeRunner } from '@/ui/global/hooks/useCodeRunner'
import type { ConsoleRef } from '@/ui/global/widgets/components/Console/types'
import type { CodeEditorRef } from '@/ui/global/widgets/components/CodeEditor/types'
import { useLocalStorage } from '@/ui/global/hooks/useLocalStorage'
import { useRouter } from '@/ui/global/hooks/useRouter'
import { useAudioContext } from '@/ui/global/hooks/useAudioContext'

export function useChallengeCodeEditorSlot() {
  const { getChallengeSlice, getPanelsLayoutSlice, getResultsSlice } = useChallengeStore()
  const { setResults } = getResultsSlice()
  const { challenge } = getChallengeSlice()
  const { panelsLayout } = getPanelsLayoutSlice()
  const { playAudio } = useAudioContext()
  const { codeRunnerProvider } = useCodeRunner()
  const toast = useToastContext()
  const router = useRouter()
  const userCode = useRef<Code>(Code.create(codeRunnerProvider))
  const editorContainerRef = useRef<HTMLDivElement>(null)
  const codeEditorRef = useRef<CodeEditorRef>(null)
  const runCodeButtonRef = useRef<HTMLButtonElement>(null)
  const consoleRef = useRef<ConsoleRef>(null)
  const [codeEditorHeight, setCodeEditorHeight] = useState(0)
  const localStorage = useLocalStorage(
    STORAGE.keys.challengeCode(challenge?.id.value ?? ''),
  )
  const initialCode =
    typeof window !== 'undefined' ? (localStorage.get() ?? challenge?.code ?? '') : ''

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
      router.goTo(ROUTES.challenging.challenges.challengeResult(challenge.slug.value))
    } catch (error) {
      playAudio('fail-code-result.wav')

      if (error instanceof CodeRunnerError) {
        handleCodeRunnerError(error.message, error.line)
        return
      }

      if (error instanceof InsufficientInputsError) {
        toast.show('Não mexa em nenhum comando Leia()!')
        return
      }
    }
  }

  function handleCodeChange(value: string) {
    localStorage.set(value)
    userCode.current = userCode.current.changeValue(value)
  }

  const handleCodeEditorHeight = useCallback(() => {
    setCodeEditorHeight(editorContainerRef.current?.offsetHeight ?? 0)
  }, [])

  useEffect(() => {
    if (!userCode?.current.value && challenge) {
      userCode.current = Code.create(codeRunnerProvider, initialCode)
    }
  }, [challenge, codeRunnerProvider, initialCode])

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
    editorContainerRef,
    runCodeButtonRef,
    consoleRef,
    codeEditorRef,
    codeEditorHeight,
    originalCode: String(challenge?.code),
    initialCode,
    handleRunCode,
    handleCodeChange,
  }
}
