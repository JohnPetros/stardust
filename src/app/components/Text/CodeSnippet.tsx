'use client'

import { useMemo, useRef, useState } from 'react'
import { CodeEditor, CodeEditorRef } from '@/app/components/CodeEditor'
import { ArrowClockwise } from '@phosphor-icons/react'
import { Console } from '../Console/Index'

import * as ToolBar from '@radix-ui/react-toolbar'
import { execute } from '@/libs/delegua'

interface CodeSnippetProps {
  code: string
  isRunnable?: boolean
}

export function CodeSnippet({ code, isRunnable = false }: CodeSnippetProps) {
  const codeEditorRef = useRef<CodeEditorRef>(null)
  const [output, setOutput] = useState<string[]>([])

  function handleOutput(output: string) {
    setOutput(currentOutput => [...currentOutput, output]);
    if (!output) setOutput(['Sem resultado']);
  }

 async function handleRunButtonClick() {
    try {
      const { erros } = await execute(code, handleOutput)
      
    } catch (error) {
      
    }
  }

  function handleReloadButtonClick() {
    codeEditorRef.current?.reloadValue()
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
      />

      <Console result="Teste de resultado" />
    </div>
  )
}
