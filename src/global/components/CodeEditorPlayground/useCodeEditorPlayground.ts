'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { ConsoleRef } from '../Console'
import { PromptRef } from '../Prompt'

import { useToastContext } from '@/contexts/ToastContext/hooks/useToastContext'
import { EditorRef } from '@/global/components/Editor'
import { REGEX } from '@/global/constants/regex'
import { checkNumeric, playAudio } from '@/global/helpers'
import { useCode } from '@/services/code'

export function useCodeEditorPlayground(
  code: string,
  onCodeChange: ((code: string) => void) | null = null
) {
  const [output, setOutput] = useState<string[]>([])
  const [shouldOpenPrompt, setShouldOpenPrompt] = useState(false)

  const { run, handleError, getInput, addInput, } = useCode()

  const toast = useToastContext()

  const userCode = useRef(code)
  const editorRef = useRef<EditorRef>(null)
  const consoleRef = useRef<ConsoleRef>(null)
  const promptRef = useRef<PromptRef>(null)

  function resetToOriginalUserCode() {
    if (editorRef.current) userCode.current = editorRef.current?.getValue()
  }

  function formatErrorLine(errorLine: number) {
    return errorLine > 0 ? `</br>Linha: ${errorLine}` : ''
  }

  const showError = useCallback(
    (message: string, line: number) => {
      toast.show(`${message} ${formatErrorLine(line)}`, {
        type: 'error',
        seconds: 5,
      })
    },
    [toast]
  )

  async function formatCodeWithInput(code: string, input: string) {
    // const regex = REGEX.insideInput
    // const match = code.match(regex)

    // userCode.current = match
    //   ? code.replace(match[0], checkNumeric(input) ? input : `"${input}"`)
    //   : userCode.current

    userCode.current = addInput([input], code)

    promptRef.current?.setValue('')
    runUserCode()
  }

  function handlePromptConfirm() {
    if (promptRef.current)
      formatCodeWithInput(userCode.current, promptRef.current?.value)
  }

  function handlePromptCancel() {
    promptRef.current?.close()
    resetToOriginalUserCode()
  }

  function getPromptTitle(input: string) {
    if (!input) return ''

    const regex = REGEX.inputParam
    const inputParam = input.match(regex)

    if (!inputParam) return ''
    const promptTitle = inputParam[0].slice(1).slice(0, -1)
    return promptTitle
  }

  function handleCodeChange(value: string) {
    userCode.current = value
    if (onCodeChange) onCodeChange(value)
  }

  const runUserCode = useCallback(async () => {
    function hasInput(code: string) {
      const input = getInput(code)
      if (!input) return false

      const promptTitle = getPromptTitle(input)
      promptRef.current?.setTitle(promptTitle)
      return input.length > 0
    }

    if (hasInput(userCode.current)) {
      setShouldOpenPrompt(true)
      return
    }

    setOutput([])
    promptRef.current?.close()

    try {
      const { output } = await run(userCode.current, false)

      console.warn('setOutput', { output })
      setOutput(output)

      consoleRef.current?.open()
      playAudio('running-code.wav')

      resetToOriginalUserCode()
    } catch (error) {
      console.error({ error })
      const codeError = handleError(String(error))

      showError(codeError.message, codeError.line)
    }
  }, [handleError])

  useEffect(() => {
    if (shouldOpenPrompt) {
      promptRef.current?.open()
      setShouldOpenPrompt(false)
    }
  }, [shouldOpenPrompt])

  return {
    output,
    editorRef,
    consoleRef,
    promptRef,
    runUserCode,
    handleCodeChange,
    handlePromptConfirm,
    handlePromptCancel,
  }
}
