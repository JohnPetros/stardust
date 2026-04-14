import { useCallback, useEffect, useRef, useState } from 'react'

import { Code } from '@stardust/core/global/structures'
import { InsufficientInputsError } from '@stardust/core/challenging/errors'
import { LspError } from '@stardust/core/global/errors'

import { ROUTES, STORAGE } from '@/constants'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { useBreakpoint } from '@/ui/global/hooks/useBreakpoint'
import { useEditorContext } from '@/ui/global/hooks/useEditorContext'
import { useLsp } from '@/ui/global/hooks/useLsp'
import type { ConsoleRef } from '@/ui/global/widgets/components/Console/types'
import type { CodeEditorRef } from '@/ui/global/widgets/components/CodeEditor/types'
import { useLocalStorage } from '@/ui/global/hooks/useLocalStorage'
import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'
import { useAudioContext } from '@/ui/global/hooks/useAudioContext'

export function useChallengeCodeEditorSlot() {
  const {
    getChallengeSlice,
    getPanelsLayoutSlice,
    getResultsSlice,
    getTabHandlerSlice,
    getActiveContentSlice,
  } = useChallengeStore()
  const { setResults } = getResultsSlice()
  const { challenge } = getChallengeSlice()
  const { panelsLayout } = getPanelsLayoutSlice()
  const { tabHandler } = getTabHandlerSlice()
  const { setActiveContent } = getActiveContentSlice()
  const { md: isMobile } = useBreakpoint()
  const { playAudio } = useAudioContext()
  const { lspProvider } = useLsp()
  const { getEditorConfig } = useEditorContext()
  const toast = useToastContext()
  const router = useNavigationProvider()
  const userCode = useRef<Code>(Code.create(lspProvider))
  const lastAutoFormattedCodeRef = useRef<string | null>(null)
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
    typeof window !== 'undefined' ? (localStorage.get() ?? challenge?.code ?? '') : ''

  async function formatInitialCode(code: string) {
    const { formatter, linter, tabSize } = getEditorConfig()
    const formatterConfiguration = {
      ...formatter,
      indentationSize: tabSize,
    }

    const lintedCode =
      linter.isEnabled &&
      (linter.namingConvention.isEnabled || linter.consistentParadigm.isEnabled)
        ? await lspProvider.lintCode(code, linter)
        : code

    return lspProvider.formatCode(lintedCode, formatterConfiguration)
  }

  const handleLspError = useCallback(
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

    setOutputs([])
    consoleRef.current?.close()

    try {
      const executionOutputs = await challenge.runCode(userCode.current)

      setOutputs(executionOutputs.items)
      setResults(challenge.results.items)

      if (executionOutputs.length > 0) {
        consoleRef.current?.open()
      }

      if (isMobile) {
        setActiveContent('result')
        tabHandler?.showResultTab()
      }

      router.goTo(ROUTES.challenging.challenges.challengeResult(challenge.slug.value))
    } catch (error) {
      playAudio('fail-code-result.wav')

      if (error instanceof LspError) {
        handleLspError(error.message, error.line)
        return
      }

      if (error instanceof InsufficientInputsError) {
        toast.showError(
          'Para a aceitação do exercício, nenhum comando leia() deve ser alterado.',
        )
        return
      }

      toast.showError('Erro interno do interpretador.')
    }
  }

  function handleOpenConsole() {
    consoleRef.current?.open()
  }

  function handleCodeChange(value: string) {
    localStorage.set(value)
    userCode.current = userCode.current.changeValue(value)
  }

  const handleCodeEditorHeight = useCallback(() => {
    setCodeEditorHeight(editorContainerRef.current?.offsetHeight ?? 0)
  }, [])

  useEffect(() => {
    if (!challenge || !initialCode) return

    userCode.current = Code.create(lspProvider, initialCode)
  }, [challenge, lspProvider, initialCode])

  useEffect(() => {
    if (!challenge || !initialCode) return

    const challengeLoadId = `${challenge.id.value}:${initialCode}`

    if (lastAutoFormattedCodeRef.current === challengeLoadId) return

    lastAutoFormattedCodeRef.current = challengeLoadId

    void (async () => {
      try {
        const formattedCode = await formatInitialCode(initialCode)

        if (formattedCode === initialCode) return

        localStorage.set(formattedCode)
        userCode.current = Code.create(lspProvider, formattedCode)
        setTimeout(() => {
          codeEditorRef.current?.setValue(formattedCode)
          console.log('Formatado')
        }, 2000)
      } catch {
        userCode.current = Code.create(lspProvider, initialCode)
      }
    })()
  }, [])

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
    outputs,
    isMobile,
    originalCode: Code.create(lspProvider, challenge?.code),
    initialCode,
    handleRunCode,
    handleOpenConsole,
    handleCodeChange,
  }
}
