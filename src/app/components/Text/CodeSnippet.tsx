'use client'

import { useMemo, useRef, useState } from 'react'
import { CodeEditor, CodeEditorRef } from '@/app/components/CodeEditor'
import { ArrowClockwise } from '@phosphor-icons/react'
import { Console, ConsoleRef } from '../Console/Index'
import * as ToolBar from '@radix-ui/react-toolbar'

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
    } catch (error) {}
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
    <div className="overflow-hidden relative h-64 rounded-md bg-gray-800 w-full">
      <ToolBar.Root className="flex items-center justify-end gap-2 border-b border-gray-700 p-2">
        {isRunnable && (
          <>
            <ToolBar.Button
              className="h-6 w-max px-4 items-center rounded bg-green-400"
              onClick={handleReloadButtonClick}
            >
              <ArrowClockwise className="text-green-900" weight="bold" />
            </ToolBar.Button>
            <ToolBar.Button
              className="h-6 w-max px-4 text-xs items-center rounded bg-green-400 font-semibold"
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

      <Console ref={consoleRef} results={outputs} />
    </div>
  )
}
