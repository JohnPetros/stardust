'use client'

import { useMemo, useRef, useState } from 'react'
import { ArrowClockwise } from '@phosphor-icons/react'
import * as ToolBar from '@radix-ui/react-toolbar'
import { twMerge } from 'tailwind-merge'

import { Console, ConsoleRef } from './Code/Console'
import { Prompt, PromptRef } from './Prompt'
import { Toast, ToastRef } from './Toast'

import { Editor, EditorRef } from '@/app/components/Editor'
import { execute } from '@/libs/delegua'
import { REGEX } from '@/utils/constants/regex'
import { checkIsNumeric, playSound } from '@/utils/helpers'

interface CodeSnippetProps {
  code: string
  isRunnable?: boolean
}

export function CodeSnippet({ code, isRunnable = false }: CodeSnippetProps) {
  const [output, setOutput] = useState<string[]>([])
  const editorRef = useRef<EditorRef>(null)
  const userCode = useRef(code)
  const errorLine = useRef(0)
  const consoleRef = useRef<ConsoleRef>(null)
  const toastRef = useRef<ToastRef>(null)
  const promptRef = useRef<PromptRef>(null)
  const runCodeButtonRef = useRef<HTMLButtonElement | null>(null)

  function getPrintType(print: string) {
    return print.replace(REGEX.print, 'escreva(tipo de $1)')
  }

  function addPrintType(code: string) {
    const regex = new RegExp(REGEX.print, 'g')
    if (!regex.test(code)) return code

    const newCode = code.replace(regex, (print) => {
      return getPrintType(print) + print
    })

    return newCode
  }

  function resetToOriginalUserCode() {
    if (editorRef.current) userCode.current = editorRef.current?.getValue()
  }

  function getErrorLine() {
    return errorLine.current > 0 ? `</br>Linha: ${errorLine.current}` : ''
  }

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
    handleUserCode()
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

  function hasInput(code: string) {
    const regex = REGEX.input
    const input = code.match(regex)
    if (!input) return false

    const promptTitle = getPromptTitle(input[0])
    promptRef.current?.setTitle(promptTitle)
    return input.length > 0
  }

  function handleError(error: Error) {
    const { message } = error

    const toastMessage = message.includes('null')
      ? 'Código inválido'
      : `${message}` + getErrorLine()

    toastRef.current?.open({
      type: 'error',
      message: toastMessage,
    })
  }

  function handleOutput(output: string) {
    setOutput((currentOutput) => [...currentOutput, output])

    if (!output) setOutput(['texto', 'Sem resultado'])
  }

  async function handleUserCode() {
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
  }

  function handleReloadButtonClick() {
    editorRef.current?.reloadValue()
  }

  function handleCodeChange(value: string) {
    userCode.current = value
  }

  const editorHeight = useMemo(() => {
    const lines = code.split('\n').length
    return lines * (lines >= 10 ? 24 : 32)
  }, [code])

  return (
    <div
      className={twMerge(
        'relative w-full overflow-hidden rounded-md bg-gray-800',
        isRunnable ? `h-[${editorHeight}px]` : 'h-auto'
      )}
    >
      <Toast ref={toastRef} />
      <ToolBar.Root className="flex items-center justify-end gap-2 border-b border-gray-700 p-2">
        {isRunnable && (
          <>
            <ToolBar.Button
              className="h-6 w-max items-center rounded bg-green-400 px-4 transition-[scale] duration-200 active:scale-95"
              onClick={handleReloadButtonClick}
            >
              <ArrowClockwise className="text-green-900" weight="bold" />
            </ToolBar.Button>
            <ToolBar.Button
              ref={runCodeButtonRef}
              className="h-6 w-max items-center rounded bg-green-400 px-4 text-xs font-semibold transition-[scale] duration-200 active:scale-95"
              onClick={handleUserCode}
            >
              Executar
            </ToolBar.Button>
          </>
        )}
      </ToolBar.Root>

      <Editor
        ref={editorRef}
        width="100%"
        height={editorHeight}
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
        <Console ref={consoleRef} results={output} height={editorHeight} />
      )}
    </div>
  )
}
