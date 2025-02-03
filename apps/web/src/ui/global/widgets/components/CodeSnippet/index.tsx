'use client'

import * as ToolBar from '@radix-ui/react-toolbar'
import { twMerge } from 'tailwind-merge'
import { useRef } from 'react'

import { Icon } from '../Icon'
import { Tooltip } from '../Tooltip'
import { useCodeSnippet } from './useCodeSnippet'
import { PlaygroundCodeEditor } from '../PlaygroundCodeEditor'
import type { PlaygroundCodeEditorRef } from '../PlaygroundCodeEditor/types'

const TOOLBAR_BUTTON_CLASS_NAME =
  'h-6 w-max items-center rounded bg-green-400 px-4 text-xs font-medium text-gray-900 transition-[scale] duration-200 active:scale-95'

export type CodeSnippetProps = {
  code: string
  isRunnable?: boolean
  onChange?: (code: string) => void
}

export function CodeSnippet({ code, isRunnable = false, onChange }: CodeSnippetProps) {
  const codeEditorRef = useRef<PlaygroundCodeEditorRef>(null)
  const {
    editorHeight,
    handleReloadCodeButtonClick,
    handleCopyCodeButtonClick,
    handleRunCode,
  } = useCodeSnippet({
    codeEditorRef,
    code,
    isRunnable,
  })

  if (editorHeight)
    return (
      <div
        className={twMerge(
          'not-prose relative w-full overflow-hidden rounded-md bg-gray-800',
          isRunnable ? `h-[${editorHeight}px]` : 'h-auto',
        )}
      >
        <ToolBar.Root className='not-prose flex items-center justify-end gap-2 border-b border-gray-700 p-2'>
          {isRunnable && (
            <>
              <Tooltip content='Voltar para o código inicial' direction='bottom'>
                <ToolBar.Button
                  type='button'
                  className={TOOLBAR_BUTTON_CLASS_NAME}
                  onClick={handleReloadCodeButtonClick}
                >
                  <Icon
                    name='reload'
                    size={16}
                    className='text-green-900'
                    weight='bold'
                  />
                </ToolBar.Button>
              </Tooltip>
              <Tooltip content='Voltar para o código inicial' direction='bottom'>
                <ToolBar.Button
                  type='button'
                  className={TOOLBAR_BUTTON_CLASS_NAME}
                  onClick={handleCopyCodeButtonClick}
                >
                  <Icon name='copy' size={16} className='text-green-900' weight='bold' />
                </ToolBar.Button>
              </Tooltip>
              <ToolBar.Button
                type='button'
                className={TOOLBAR_BUTTON_CLASS_NAME}
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
          onCodeChange={onChange}
        />
      </div>
    )
}
