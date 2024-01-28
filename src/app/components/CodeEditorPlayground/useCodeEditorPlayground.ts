'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { ConsoleRef } from '../Console'
import { PromptRef } from '../Prompt'

import { CodeEditorRef } from '@/app/components/CodeEditor'
import { useToast } from '@/contexts/ToastContext'
import { execute } from '@/libs/delegua'
import { REGEX } from '@/utils/constants/regex'
import { checkNumeric, countCharacters, playAudio } from '@/utils/helpers'

export function useCodeEditorPlayground(code: string) {
  const [output, setOutput] = useState<string[]>([])
  const [shouldOpenPrompt, setShouldOpenPrompt] = useState(false)

  const toast = useToast()

  const userCode = useRef(code)
  const errorLine = useRef(0)
  const codeEditorRef = useRef<CodeEditorRef>(null)
  const consoleRef = useRef<ConsoleRef>(null)
  const promptRef = useRef<PromptRef>(null)

  function getPrintType(print: string) {
    return print.replace(REGEX.insidePrint, 'escreva(tipo de $1)')
  }

  function resetToOriginalUserCode() {
    if (codeEditorRef.current)
      userCode.current = codeEditorRef.current?.getValue()
  }

  function getErrorLine() {
    return errorLine.current > 0 ? `</br>Linha: ${errorLine.current}` : ''
  }

  const handleError = useCallback(
    (error: Error) => {
      const { message } = error

      const toastMessage = message.includes('null')
        ? 'Código inválido'
        : `${message}` + getErrorLine()

      toast.show(toastMessage, {
        type: 'error',
        seconds: 5,
      })
    },
    [toast]
  )

  async function formatCodeWithInput(code: string, input: string) {
    const regex = REGEX.insideInput
    const match = code.match(regex)

    userCode.current = match
      ? code.replace(match[0], checkNumeric(input) ? input : "'" + input + "'")
      : userCode.current

    promptRef.current?.setValue('')
    runUserCode()
  }

  function onPromptConfirm() {
    if (promptRef.current)
      formatCodeWithInput(userCode.current, promptRef.current?.value)
  }

  function onPromptCancel() {
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

  function handleOutput(output: string) {
    setOutput((currentOutput) => {
      if (output === 'vetor' && currentOutput.at(-1) === 'texto') {
        return [...currentOutput, 'lista']
      }

      return [...currentOutput, output]
    })

    if (!output) setOutput(['texto', 'Sem resultado'])
  }

  function handleCodeChange(value: string) {
    userCode.current = value
  }

  function checkParenthesesMatch(print: string) {
    const openParentheses = '('
    const closeParentheses = ')'

    const openParenthesesCount = countCharacters(openParentheses, print)
    const closeParenthesesCount = countCharacters(closeParentheses, print)

    if (openParenthesesCount < closeParenthesesCount) {
      const difference = closeParenthesesCount - openParenthesesCount
      return print + closeParentheses.repeat(difference)
    } else if (openParenthesesCount > closeParenthesesCount) {
      const difference = openParenthesesCount - closeParenthesesCount
      return print + closeParentheses.repeat(difference)
    }

    return print
  }

  const runUserCode = useCallback(async () => {
    function addPrintType(code: string) {
      const regex = new RegExp(REGEX.print, 'g')

      if (!regex.test(code)) return code

      const newCode = code.replace(regex, (print) => {
        const checkedPrint = checkParenthesesMatch(print)
        console.log(checkedPrint)
        return getPrintType(checkedPrint) + print
      })

      return newCode
    }

    function hasInput(code: string) {
      const regex = REGEX.insideInput
      const input = code.match(regex)
      if (!input) return false

      const promptTitle = getPromptTitle(input[0])
      promptRef.current?.setTitle(promptTitle)
      return input.length > 0
    }

    if (hasInput(userCode.current)) {
      setShouldOpenPrompt(true)
      return
    }

    setOutput([])
    promptRef.current?.close()
    const code = addPrintType(userCode.current)

    console.log({ code })

    try {
      const { erros } = await execute(code, handleOutput)

      console.error(erros)

      if (erros.length) {
        const error = erros[0]
        if (error.linha) errorLine.current = error.linha
        if (error instanceof Error) throw error
        consoleRef.current?.close()
        throw error.erroInterno
      }

      consoleRef.current?.open()
      playAudio('running-code.wav')

      resetToOriginalUserCode()
    } catch (error) {
      handleError(error as Error)
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
    codeEditorRef,
    consoleRef,
    promptRef,
    runUserCode,
    handleCodeChange,
    onPromptConfirm,
    onPromptCancel,
  }
}
