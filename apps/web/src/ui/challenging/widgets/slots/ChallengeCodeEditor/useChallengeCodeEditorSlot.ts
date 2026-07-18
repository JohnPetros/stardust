import { useCallback, useEffect, useRef, useState } from 'react'

import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import { ChallengeCodeExecution } from '@stardust/core/challenging/structures'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { Code, Text } from '@stardust/core/global/structures'
import { InsufficientInputsError } from '@stardust/core/challenging/errors'
import { LspError } from '@stardust/core/global/errors'

import { ROUTES, STORAGE } from '@/constants'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { useBreakpoint } from '@/ui/global/hooks/useBreakpoint'
import { useLsp } from '@/ui/global/hooks/useLsp'
import type { ConsoleRef } from '@/ui/global/widgets/components/Console/types'
import type { CodeEditorRef } from '@/ui/global/widgets/components/CodeEditor/types'
import { useLocalStorage } from '@/ui/global/hooks/useLocalStorage'
import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'
import { useAudioContext } from '@/ui/global/hooks/useAudioContext'

type Params = {
  challengingService?: ChallengingService
  isAccountAuthenticated?: boolean
  onUnauthorized?: () => void
}

export function useChallengeCodeEditorSlot({
  challengingService,
  isAccountAuthenticated = false,
  onUnauthorized,
}: Params = {}) {
  const challengeStore = useChallengeStore()
  const {
    getChallengeSlice,
    getPanelOrderSlice,
    getPanelsOffsetSlice,
    getResultsSlice,
    getTabHandlerSlice,
    getActiveContentSlice,
  } = challengeStore
  const { setResults } = getResultsSlice()
  const { challenge } = getChallengeSlice()
  const { panelOrder } = getPanelOrderSlice()
  const { panelsOffset } = getPanelsOffsetSlice()
  const { tabHandler } = getTabHandlerSlice()
  const { setActiveContent } = getActiveContentSlice()
  const codeExecutionSlice = challengeStore.getCodeExecutionSlice?.() ?? {
    isCodeRunning: false,
    currentCode: '',
    setCurrentCode: () => {},
    startCodeExecution: () => {},
    finishCodeExecution: () => {},
    failCodeExecution: () => {},
  }
  const {
    isCodeRunning,
    currentCode,
    setCurrentCode,
    startCodeExecution,
    finishCodeExecution,
    failCodeExecution,
  } = codeExecutionSlice
  const { md: isMobile } = useBreakpoint()
  const { playAudio } = useAudioContext()
  const { lspProvider } = useLsp()
  const { show: showToast, showError } = useToastContext()
  const { currentRoute } = useNavigationProvider()
  const userCode = useRef<Code>(Code.create(lspProvider))
  const editorContainerRef = useRef<HTMLDivElement>(null)
  const codeEditorRef = useRef<CodeEditorRef>(null)
  const runCodeButtonRef = useRef<HTMLButtonElement>(null)
  const consoleRef = useRef<ConsoleRef>(null)
  const [codeEditorHeight, setCodeEditorHeight] = useState(0)
  const [outputs, setOutputs] = useState<string[]>([])
  const localStorage = useLocalStorage(
    STORAGE.keys.challengeCode(challenge?.id.value ?? ''),
  )
  const initialCode =
    typeof window !== 'undefined'
      ? (localStorage.get() ?? challenge?.initialCode.value ?? '')
      : ''
  const panelsLayoutVersion = `${panelOrder}:${panelsOffset}`

  const handleLspError = useCallback(
    (message: string, line: number) => {
      function formatErrorLine(errorLine: number) {
        return errorLine > 0 ? `</br>Linha: ${errorLine}` : ''
      }

      showToast(`${message} ${formatErrorLine(line)}`, {
        type: 'error',
        seconds: 5,
      })
    },
    [showToast],
  )

  async function handleRunCode() {
    if (!challenge || isCodeRunning) return

    setOutputs([])
    consoleRef.current?.close()
    const currentCode = userCode.current.value
    startCodeExecution(currentCode)

    try {
      const runCodeLocally = async () => {
        const initialCode = Code.create(lspProvider, challenge.initialCode.value)
        const executionOutputs = await challenge.runCode(userCode.current, initialCode)

        setOutputs(executionOutputs.items)
        setResults(challenge.results.items)
        failCodeExecution()

        if (executionOutputs.length > 0) {
          consoleRef.current?.open()
        }

        setActiveContent('result')

        if (isMobile) {
          tabHandler?.showResultTab()
        }

        const resultRoute = ROUTES.challenging.challenges.challengeResult(
          challenge.slug.value,
        )

        if (currentRoute !== resultRoute) {
          window.history.pushState(null, '', resultRoute)
        }
      }

      if (isAccountAuthenticated && challengingService) {
        const response = await challengingService.runChallengeCode(
          challenge.id,
          Text.create(currentCode, 'Código do desafio'),
        )

        if (userCode.current.value !== currentCode) {
          failCodeExecution()
          return
        }

        if (response.statusCode === HTTP_STATUS_CODE.unauthorized) {
          onUnauthorized?.()
          await runCodeLocally()
          return
        }

        if (response.isFailure) response.throwError()

        const execution = ChallengeCodeExecution.create(response.body)
        setOutputs(execution.outputs.items.map((output) => output.value))

        if (execution.error) {
          showError(execution.error.message.value, 5)
        }

        finishCodeExecution(execution)

        if (execution.outputs.length > 0 && challenge.isEvaluatedByFunction.isFalse) {
          consoleRef.current?.open()
        }

        setActiveContent('result')

        if (isMobile) {
          tabHandler?.showResultTab()
        }

        const resultRoute = ROUTES.challenging.challenges.challengeResult(
          challenge.slug.value,
        )

        if (currentRoute !== resultRoute) {
          window.history.pushState(null, '', resultRoute)
        }

        return
      }

      await runCodeLocally()
    } catch (error) {
      failCodeExecution()

      if (userCode.current.value !== currentCode) return

      playAudio('fail-code-result.wav')

      if (error instanceof LspError) {
        handleLspError(error.message, error.line)
        return
      }

      if (error instanceof InsufficientInputsError) {
        showError(
          'Para a aceitação do exercício, nenhum comando leia() deve ser alterado.',
        )
        return
      }

      console.error('useChallengeCodeEditorSlot', error)

      showError('Erro interno do interpretador.')
    }
  }

  function handleOpenConsole() {
    consoleRef.current?.open()
  }

  function handleCodeChange(value: string) {
    localStorage.set(value)
    userCode.current = userCode.current.changeValue(value)
    setCurrentCode(value)
  }

  const handleCodeEditorHeight = useCallback(() => {
    setCodeEditorHeight(editorContainerRef.current?.offsetHeight ?? 0)
  }, [])

  useEffect(() => {
    if (!userCode?.current.value && challenge) {
      userCode.current = Code.create(lspProvider, initialCode)
      setCurrentCode(initialCode)
    }
  }, [challenge, lspProvider, initialCode, setCurrentCode])

  useEffect(() => {
    if (!currentCode || userCode.current.value === currentCode) return

    localStorage.set(currentCode)
    userCode.current = userCode.current.changeValue(currentCode)
    codeEditorRef.current?.setValue(currentCode)
  }, [currentCode, localStorage])

  useEffect(() => {
    if (!panelsLayoutVersion) return

    handleCodeEditorHeight()
  }, [panelsLayoutVersion, handleCodeEditorHeight])

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
    outputs,
    isCodeRunning,
    isMobile,
    originalCode: Code.create(lspProvider, challenge?.initialCode.value),
    initialCode,
    handleRunCode,
    handleOpenConsole,
    handleCodeChange,
  }
}
