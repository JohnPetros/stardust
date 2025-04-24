'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { Code } from '@stardust/core/global/structures'

import { REGEX } from '@/constants'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { useCodeRunner } from '@/ui/global/hooks/useCodeRunner'
import { useAudioContext } from '@/ui/global/contexts/AudioContext'
import type { ConsoleRef } from '../Console/types'
import type { PromptRef } from '../Prompt/types'
import type { CodeEditorRef } from '../CodeEditor/types'

export function usePlaygroundCodeEditor(
  preCodeValue: string,
  onCodeChange: ((code: string) => void) | null = null,
) {
  const [outputs, setOutputs] = useState<string[]>([])
  const [shouldOpenPrompt, setShouldOpenPrompt] = useState(false)
  const { provider } = useCodeRunner()
  const { playAudio } = useAudioContext()
  const toast = useToastContext()
  const codeRef = useRef<Code>(Code.create(provider, preCodeValue))
  const codeEditorRef = useRef<CodeEditorRef>(null)
  const consoleRef = useRef<ConsoleRef>(null)
  const promptRef = useRef<PromptRef>(null)

  function resetCode() {
    if (codeEditorRef.current) handleCodeChange(codeEditorRef.current.getValue())
  }

  const showError = useCallback(
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

  async function runCodeWithInput(input: string) {
    codeRef.current = codeRef.current.addInputs([input])

    promptRef.current?.setValue('')
    runCode()
  }

  const openPrompt = useCallback(() => {
    function getPromptTitle(input: string) {
      if (!input) return ''

      const regex = REGEX.inputParam
      const inputParam = input.match(regex)

      if (!inputParam) return ''
      const promptTitle = inputParam[0].slice(1).slice(0, -1)
      return promptTitle
    }

    if (!codeRef.current) return
    const promptTitle = getPromptTitle(codeRef.current.firstInput)
    promptRef.current?.setTitle(promptTitle)
    setShouldOpenPrompt(true)
  }, [])

  const runCode = useCallback(async () => {
    if (!codeRef.current || !promptRef.current) return

    if (codeRef.current.hasInput.isTrue) {
      openPrompt()
      return
    }

    setOutputs([])
    promptRef.current.close()

    const response = await codeRef.current.run()

    if (response.isFailure) {
      playAudio('fail-code-result.wav')
      showError(response.errorMessage, response.errorLine)
    }

    if (response.isSuccess) {
      setOutputs(response.outputs)
      consoleRef.current?.open()
    }

    resetCode()
  }, [openPrompt, showError, playAudio, outputs])

  function handlePromptConfirm() {
    if (promptRef.current) runCodeWithInput(promptRef.current.value)
  }

  function handlePromptCancel() {
    promptRef.current?.close()
    resetCode()
  }

  function handleCodeChange(value: string) {
    codeRef.current = codeRef.current.changeValue(value)
    if (onCodeChange) onCodeChange(value)
  }

  useEffect(() => {
    if (shouldOpenPrompt) {
      promptRef.current?.open()
      setShouldOpenPrompt(false)
    }
  }, [shouldOpenPrompt])

  return {
    outputs,
    codeEditorRef,
    consoleRef,
    promptRef,
    runCode,
    handleCodeChange,
    handlePromptConfirm,
    handlePromptCancel,
  }
}
