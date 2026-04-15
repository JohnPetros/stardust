import * as ToolBar from '@radix-ui/react-toolbar'
import { twMerge } from 'tailwind-merge'

import { Icon } from '../Icon'
import { Tooltip } from '../Tooltip'
import { PlaygroundCodeEditor } from '../PlaygroundCodeEditor'
import type { PlaygroundCodeEditorRef } from '../PlaygroundCodeEditor/types'
import { CodeExplanationDialog } from './CodeExplanationDialog'
import { CodeExplanationAlertDialog } from './CodeExplanationAlertDialog'

const TOOLBAR_BUTTON_CLASS_NAME =
  'h-6 w-max items-center rounded bg-green-400 px-4 text-xs font-medium text-gray-900 transition-[scale] duration-200 active:scale-95'

export type CodeSnippetProps = {
  code: string
  isRunnable?: boolean
  editorHeight: number
  codeEditorRef: React.RefObject<PlaygroundCodeEditorRef | null>
  canExplainCode: boolean
  explanation: string
  isCodeExplanationDialogOpen: boolean
  isCodeExplanationAlertDialogOpen: boolean
  codeExplanationAlertDialogMode: 'confirm' | 'blocked'
  isGeneratingCodeExplanation: boolean
  isConfirmingCodeExplanation: boolean
  remainingUses: number | null
  onReloadCodeButtonClick: () => void
  onCopyCodeButtonClick: () => void
  onRunCode: () => void
  onCodeExplanationButtonClick: () => void
  onCodeExplanationRetry: () => void
  onCloseCodeExplanationDialog: () => void
  onCloseCodeExplanationAlertDialog: () => void
  onConfirmCodeExplanationAlertDialog: () => void
  onChange?: (code: string) => void
}

export const CodeSnippetView = ({
  code,
  isRunnable = false,
  editorHeight,
  codeEditorRef,
  canExplainCode,
  explanation,
  isCodeExplanationDialogOpen,
  isCodeExplanationAlertDialogOpen,
  codeExplanationAlertDialogMode,
  isGeneratingCodeExplanation,
  isConfirmingCodeExplanation,
  remainingUses,
  onReloadCodeButtonClick,
  onCopyCodeButtonClick,
  onRunCode,
  onCodeExplanationButtonClick,
  onCodeExplanationRetry,
  onCloseCodeExplanationDialog,
  onCloseCodeExplanationAlertDialog,
  onConfirmCodeExplanationAlertDialog,
  onChange,
}: CodeSnippetProps) => {
  return (
    <div
      className={twMerge(
        'not-prose relative w-full overflow-hidden rounded-md bg-gray-800',
        isRunnable ? `h-[${editorHeight}px]` : 'h-auto',
      )}
    >
      {(isRunnable || canExplainCode) && (
        <ToolBar.Root className='not-prose flex items-center justify-end gap-2 border-b border-gray-700 p-2'>
          <>
            {canExplainCode && (
              <Tooltip content='Explicar codigo com IA' direction='bottom'>
                <ToolBar.Button
                  type='button'
                  className={TOOLBAR_BUTTON_CLASS_NAME}
                  onClick={onCodeExplanationButtonClick}
                >
                  <Icon name='ai' size={16} className='text-green-900' weight='bold' />
                </ToolBar.Button>
              </Tooltip>
            )}
            <Tooltip content='Voltar para o código inicial' direction='bottom'>
              <ToolBar.Button
                type='button'
                className={TOOLBAR_BUTTON_CLASS_NAME}
                onClick={onReloadCodeButtonClick}
                disabled={!isRunnable}
              >
                <Icon name='reload' size={16} className='text-green-900' weight='bold' />
              </ToolBar.Button>
            </Tooltip>
            <Tooltip content='Copiar código' direction='bottom'>
              <ToolBar.Button
                type='button'
                className={TOOLBAR_BUTTON_CLASS_NAME}
                onClick={onCopyCodeButtonClick}
                disabled={!isRunnable}
              >
                <Icon name='copy' size={16} className='text-green-900' weight='bold' />
              </ToolBar.Button>
            </Tooltip>
            {isRunnable && (
              <ToolBar.Button
                type='button'
                className={TOOLBAR_BUTTON_CLASS_NAME}
                onClick={onRunCode}
              >
                Executar
              </ToolBar.Button>
            )}
          </>
        </ToolBar.Root>
      )}

      <PlaygroundCodeEditor
        ref={codeEditorRef}
        code={code}
        isRunnable={isRunnable}
        height={editorHeight}
        onCodeChange={onChange}
      />

      {canExplainCode && (
        <>
          <CodeExplanationDialog
            isOpen={isCodeExplanationDialogOpen}
            code={code}
            explanation={explanation}
            isLoading={isGeneratingCodeExplanation}
            onRetry={onCodeExplanationRetry}
            onClose={onCloseCodeExplanationDialog}
          />

          <CodeExplanationAlertDialog
            isOpen={isCodeExplanationAlertDialogOpen}
            mode={codeExplanationAlertDialogMode}
            remainingUses={remainingUses}
            isLoading={isConfirmingCodeExplanation}
            onConfirm={onConfirmCodeExplanationAlertDialog}
            onClose={onCloseCodeExplanationAlertDialog}
          />
        </>
      )}
    </div>
  )
}
