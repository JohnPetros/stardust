'use client'

import { ArrowClockwise } from '@phosphor-icons/react'
import * as ToolBar from '@radix-ui/react-toolbar'
import { twMerge } from 'tailwind-merge'

import { Tooltip } from '../Tooltip'
import { CodeEditorPlayground } from '../CodeEditorPlayground'

import { useCodeSnippet } from './useCodeSnippet'

export type CodeSnippetProps = {
  code: string
  isRunnable?: boolean
}

export function CodeSnippet({ code, isRunnable = false }: CodeSnippetProps) {
  const {
    codeEditorRef,
    editorHeight,
    handleReloadButtonClick,
    handleRunCode,
  } = useCodeSnippet({ code, isRunnable })

  return (
    <div
      className={twMerge(
        'not-prose relative w-full overflow-hidden rounded-md bg-gray-800',
        isRunnable ? `h-[${editorHeight}px]` : 'h-auto'
      )}
    >
      <ToolBar.Root className="not-prose flex items-center justify-end gap-2 border-b border-gray-700 p-2">
        {isRunnable && (
          <>
            <Tooltip content="Voltar para o código inicial" direction="bottom">
              <ToolBar.Button
                type="button"
                className="h-6 w-max items-center rounded bg-green-400 px-4 transition-[scale] duration-200 active:scale-95"
                onClick={handleReloadButtonClick}
              >
                <ArrowClockwise className="text-green-900" weight="bold" />
              </ToolBar.Button>
            </Tooltip>
            <ToolBar.Button
              type="button"
              className="h-6 w-max items-center rounded bg-green-400 px-4 text-xs font-semibold text-gray-900 transition-[scale] duration-200 active:scale-95"
              onClick={handleRunCode}
            >
              Executar
            </ToolBar.Button>
          </>
        )}
      </ToolBar.Root>

      <CodeEditorPlayground
        ref={codeEditorRef}
        code={code}
        isRunnable={isRunnable}
        height={editorHeight}
      />
    </div>
  )
}
