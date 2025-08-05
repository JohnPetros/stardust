import * as ToolBar from '@radix-ui/react-toolbar'
import { twMerge } from 'tailwind-merge'

import { Icon } from '../Icon'
import { Tooltip } from '../Tooltip'
import type { PlaygroundCodeEditorRef } from '../PlaygroundCodeEditor/types'
import { PlaygroundCodeEditor } from '../PlaygroundCodeEditor'

const TOOLBAR_BUTTON_CLASS_NAME =
  'h-6 w-max items-center rounded bg-green-400 px-4 text-xs font-medium text-gray-900 transition-[scale] duration-200 active:scale-95'

export type CodeSnippetProps = {
  code: string
  isRunnable?: boolean
  editorHeight: number
  codeEditorRef: React.RefObject<PlaygroundCodeEditorRef | null>
  onReloadCodeButtonClick: () => void
  onCopyCodeButtonClick: () => void
  onRunCode: () => void
  onChange?: (code: string) => void
}

export const CodeSnippetView = ({
  code,
  isRunnable = false,
  editorHeight,
  codeEditorRef,
  onReloadCodeButtonClick,
  onCopyCodeButtonClick,
  onRunCode,
  onChange,
}: CodeSnippetProps) => {
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
            <Tooltip content='Voltar para o código inicial'>
              <ToolBar.Button
                type='button'
                className={TOOLBAR_BUTTON_CLASS_NAME}
                onClick={onReloadCodeButtonClick}
              >
                <Icon name='reload' size={16} className='text-green-900' />
              </ToolBar.Button>
            </Tooltip>
            <Tooltip content='Copiar código'>
              <ToolBar.Button
                type='button'
                className={TOOLBAR_BUTTON_CLASS_NAME}
                onClick={onCopyCodeButtonClick}
              >
                <Icon name='copy' size={16} className='text-green-900' />
              </ToolBar.Button>
            </Tooltip>
            <ToolBar.Button
              type='button'
              className={TOOLBAR_BUTTON_CLASS_NAME}
              onClick={onRunCode}
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
