import { useCallback, useEffect, useRef, useState } from 'react'

import { Code } from '@stardust/core/global/structures'

import { REGEX } from '@/constants'
import { useToastProvider } from '@/ui/global/hooks/useToastProvider'
import type { CodeEditorRef } from '../CodeEditor/types'
import type { ConsoleRef } from '../Console/types'
import type { PromptRef } from '../Prompt/types'
import { useLsp } from '@/ui/global/hooks/useLsp'

export function usePlaygroundCodeEditor(
  preCodeValue: string,
  onCodeChange: ((code: string) => void) | null = null,
) {
  const [outputs, setOutputs] = useState<string[]>([])
  const [shouldOpenPrompt, setShouldOpenPrompt] = useState(false)
  const { lspProvider } = useLsp()
  const toast = useToastProvider()
  const codeRef = useRef<Code>(Code.create(lspProvider, preCodeValue))
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

      toast.showError(`${message} ${formatErrorLine(line)}`)
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
      showError(response.errorMessage, response.errorLine)
    }

    if (response.isSuccessful) {
      setOutputs(response.outputs)
      consoleRef.current?.open()
    }

    resetCode()
  }, [openPrompt, showError, outputs])

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
