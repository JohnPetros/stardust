'use client'

import { useMemo, useRef } from 'react'
import { ArrowClockwise } from '@phosphor-icons/react'
import * as ToolBar from '@radix-ui/react-toolbar'
import { twMerge } from 'tailwind-merge'

import { PlaygroundCodeEditor, PlaygroundCodeRef } from './CodeEditor'

interface CodeSnippetProps {
  code: string
  isRunnable?: boolean
}

export function CodeSnippet({ code, isRunnable = false }: CodeSnippetProps) {
  const codeEditorRef = useRef<PlaygroundCodeRef | null>(null)

  async function handleRunCode() {
    codeEditorRef.current?.runUserCode()
  }

  function handleReloadButtonClick() {
    codeEditorRef.current?.reloadValue()
  }

  const editorHeight = useMemo(() => {
    const lines = code.split('\n').length
    return 100 + lines * (lines >= 10 ? 20 : 32)
  }, [code])

  return (
    <div
      className={twMerge(
        'relative w-full overflow-hidden rounded-md bg-gray-800',
        isRunnable ? `h-[${editorHeight}px]` : 'h-auto'
      )}
    >
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
              onClick={handleRunCode}
            >
              Executar
            </ToolBar.Button>
          </>
        )}
      </ToolBar.Root>

      <PlaygroundCodeEditor
        ref={codeEditorRef}
        code={code}
        isRunnable={isRunnable}
        height={editorHeight}
      />
    </div>
  )
}
