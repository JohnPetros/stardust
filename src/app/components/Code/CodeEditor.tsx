'use client'

import {
  ForwardedRef,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

import { Prompt, PromptRef } from '../Prompt'
import { Toast, ToastRef } from '../Toast'

import { Console, ConsoleRef } from './Console'

import { Editor, EditorRef } from '@/app/components/Editor'
import { execute } from '@/libs/delegua'
import { REGEX } from '@/utils/constants/regex'
import { checkIsNumeric, playSound } from '@/utils/helpers'

export interface PlaygroundCodeRef extends EditorRef {
  runUserCode: () => void
}

interface PlaygroundCodeProps {
  height: number
  code: string
  isRunnable?: boolean
}

export const PlaygroundCodeEditorComponent = (
  { code, height, isRunnable = false }: PlaygroundCodeProps,
  ref: ForwardedRef<PlaygroundCodeRef>
) => {
  const [output, setOutput] = useState<string[]>([])
  const editorRef = useRef<EditorRef>(null)
  const userCode = useRef(code)
  const errorLine = useRef(0)
  const consoleRef = useRef<ConsoleRef>(null)
  const toastRef = useRef<ToastRef>(null)
  const promptRef = useRef<PromptRef>(null)

  function getPrintType(print: string) {
    return print.replace(REGEX.print, 'escreva(tipo de $1)')
  }

  function resetToOriginalUserCode() {
    if (editorRef.current) userCode.current = editorRef.current?.getValue()
  }

  function getErrorLine() {
    return errorLine.current > 0 ? `</br>Linha: ${errorLine.current}` : ''
  }

  const handleError = useCallback((error: Error) => {
    const { message } = error

    const toastMessage = message.includes('null')
      ? 'Código inválido'
      : `${message}` + getErrorLine()

    toastRef.current?.open({
      type: 'error',
      message: toastMessage,
    })
  }, [])

  async function formatCodeWithInput(code: string, input: string) {
    const regex = REGEX.input
    const match = code.match(regex)
    userCode.current = match
      ? code.replace(
          match[0],
          checkIsNumeric(input) ? input : "'" + input + "'"
        )
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
    setOutput((currentOutput) => [...currentOutput, output])

    if (!output) setOutput(['texto', 'Sem resultado'])
  }

  function handleCodeChange(value: string) {
    userCode.current = value
  }

  const runUserCode = useCallback(async () => {
    function addPrintType(code: string) {
      const regex = new RegExp(REGEX.print, 'g')
      if (!regex.test(code)) return code

      const newCode = code.replace(regex, (print) => {
        return getPrintType(print) + print
      })

      return newCode
    }

    function hasInput(code: string) {
      const regex = REGEX.input
      const input = code.match(regex)
      if (!input) return false

      const promptTitle = getPromptTitle(input[0])
      promptRef.current?.setTitle(promptTitle)
      return input.length > 0
    }

    if (hasInput(userCode.current)) {
      promptRef.current?.open()
      promptRef.current?.focus()
      return
    }

    setOutput([])
    promptRef.current?.close()
    const code = addPrintType(userCode.current)

    try {
      const { erros } = await execute(code, handleOutput)

      if (erros.length) {
        const error = erros[0]
        if (error.linha) errorLine.current = error.linha
        if (error instanceof Error) throw error
        consoleRef.current?.close()
        throw error.erroInterno
      }

      consoleRef.current?.open()
      playSound('running-code.wav')

      resetToOriginalUserCode()
    } catch (error) {
      handleError(error as Error)
    }
  }, [handleError])

  useImperativeHandle(
    ref,
    () => {
      return {
        runUserCode,
        ...editorRef.current,
      } as PlaygroundCodeRef
    },
    [runUserCode]
  )

  return (
    <div className="h-full w-full">
      <Toast ref={toastRef} />

      <Editor
        ref={editorRef}
        width="100%"
        height={height}
        value={code}
        isReadOnly={!isRunnable}
        onChange={handleCodeChange}
      />

      {isRunnable && (
        <Prompt
          ref={promptRef}
          onConfirm={onPromptConfirm}
          onCancel={onPromptCancel}
        />
      )}

      {isRunnable && (
        <Console ref={consoleRef} results={output} height={height} />
      )}
    </div>
  )
}

export const PlaygroundCodeEditor = forwardRef(PlaygroundCodeEditorComponent)
