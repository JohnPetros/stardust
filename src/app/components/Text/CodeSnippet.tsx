'use client'

import { useMemo, useRef, useState } from 'react'
import { ArrowClockwise } from '@phosphor-icons/react'
import * as ToolBar from '@radix-ui/react-toolbar'
import { twMerge } from 'tailwind-merge'

import { Console, ConsoleRef } from '../Console/Index'
import { Toast, ToastRef } from '../Toast'

import { CodeEditor, CodeEditorRef } from '@/app/components/CodeEditor'
import { execute } from '@/libs/delegua'
import { playSound } from '@/utils/functions'

interface CodeSnippetProps {
  code: string
  isRunnable?: boolean
}

export function CodeSnippet({ code, isRunnable = false }: CodeSnippetProps) {
  const codeEditorRef = useRef<CodeEditorRef>(null)
  const [outputs, setOutputs] = useState<string[]>([])
  const userCode = useRef(code)
  const errorLine = useRef(0)
  const consoleRef = useRef<ConsoleRef>(null)
  const toastRef = useRef<ToastRef>(null)

  function getPrintType(print: string) {
    return print.replace(/escreva\((.*?)\)/, 'escreva(tipo de $1)')
  }

  function addPrintType(code: string) {
    const regex = /(escreva\(.+\))/g
    if (!regex.test(code)) return code

    const newCode = code.replace(regex, (print) => {
      return getPrintType(print) + print
    })

    return newCode
  }

  function getErrorLine() {
    return errorLine.current > 0 ? `</br>Linha: ${errorLine.current}` : ''
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
    setOutputs((currentOutputs) => [...currentOutputs, output])

    if (!output) setOutputs(['Sem resultado'])
  }

  async function handleRunButtonClick() {
    setOutputs([])
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
    } catch (error) {
      handleError(error as Error)
    }
  }

  function handleReloadButtonClick() {
    codeEditorRef.current?.reloadValue()
  }

  function handleCodeChange(value: string) {
    userCode.current = value
  }

  const codeEditorHeight = useMemo(() => {
    const lines = code.split('\n').length
    return lines * (lines >= 10 ? 16 : 32)
  }, [code])

  return (
    <div
      className={twMerge(
        'relative w-full overflow-hidden rounded-md bg-gray-800',
        isRunnable ? 'h-64' : 'h-auto'
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
              className="h-6 w-max items-center rounded bg-green-400 px-4 text-xs font-semibold transition-[scale] duration-200 active:scale-95"
              onClick={handleRunButtonClick}
            >
              Executar
            </ToolBar.Button>
          </>
        )}
      </ToolBar.Root>

      <CodeEditor
        ref={codeEditorRef}
        width="100%"
        height={codeEditorHeight}
        value={code}
        isReadOnly={!isRunnable}
        onChange={handleCodeChange}
      />

      {isRunnable && <Console ref={consoleRef} results={outputs} />}
    </div>
  )
}
