'use client'

import { useRef } from 'react'
import { Controller } from 'react-hook-form'

import type { SnippetDto } from '@stardust/core/playground/dtos'

import { useRouter } from '@/ui/global/hooks/useRouter'
import { Button } from '@radix-ui/react-toolbar'
import { TitleInput } from '@/ui/global/widgets/components/TitleInput'
import { ActionButton } from '@/ui/global/widgets/components/ActionButton'
import type { PlaygroundCodeEditorRef } from '@/ui/global/widgets/components/PlaygroundCodeEditor/types'
import type { ActionButtonTitles } from '@/ui/global/widgets/components/ActionButton/types'
import { Switch } from '@/ui/global/widgets/components/Switch'
import { CodeEditorToolbar } from '@/ui/global/widgets/components/CodeEditorToolbar'
import { PlaygroundCodeEditor } from '@/ui/global/widgets/components/PlaygroundCodeEditor'
import { ErrorMessage } from '@/ui/global/widgets/components/ErrorMessage'
import { ShareSnippetDialog } from '../../components/ShareSnippetDialog'
import { useSnippetPage } from './useSnippetPage'
import { Icon } from '@/ui/global/widgets/components/Icon'

const HEADER_HEIGHT = 48
const SAVE_BUTTON_CONTAINER_HEIGHT = 64
const PADDING_BOTTOM = 24

type SnippetPageProps = {
  snippetDto: SnippetDto
}

export function SnippetPage({ snippetDto }: SnippetPageProps) {
  const playgroudCodeEditorRef = useRef<PlaygroundCodeEditorRef>(null)
  const {
    pageHeight,
    formControl,
    snippetId,
    snippetErrors,
    canExecuteAction,
    isSnippetPublic,
    isActionDisabled,
    isActionSuccess,
    isActionFailure,
    isUserSnippetAuthor,
    isActionExecuting,
    handleRunCode,
    handleActionButtonClick,
  } = useSnippetPage(playgroudCodeEditorRef, snippetDto)
  const { goBack } = useRouter()
  const ACTION_BUTTON_TITLES: ActionButtonTitles = {
    canExecute: 'salvar?',
    executing: 'salvando...',
    default: 'salvar',
    success: 'salvado',
    failure: 'erro',
  }
  const editorHeight =
    pageHeight - HEADER_HEIGHT - SAVE_BUTTON_CONTAINER_HEIGHT - PADDING_BOTTOM

  return (
    <div className='flex flex-col'>
      <header className='grid grid-cols-2 px-6 py-12' style={{ height: HEADER_HEIGHT }}>
        <Controller
          control={formControl}
          name='snippetTitle'
          render={({ field: { value, onChange } }) => {
            return (
              <TitleInput
                value={value}
                onChange={onChange}
                placeholder='Título do seu snippet'
                className='bg-gray-800 text-gray-50'
                errorMessage={snippetErrors.title}
              />
            )
          }}
        />
        <div
          style={{ height: SAVE_BUTTON_CONTAINER_HEIGHT }}
          className='flex items-center justify-end gap-3'
        >
          <Button onClick={goBack} className='bg-gray-600 text-gray-50 w-24'>
            Voltar
          </Button>
          <ActionButton
            type='button'
            titles={ACTION_BUTTON_TITLES}
            isExecuting={isActionExecuting}
            canExecute={canExecuteAction}
            isSuccess={isActionSuccess}
            isFailure={isActionFailure}
            isDisabled={isActionDisabled}
            onExecute={handleActionButtonClick}
            icon='send'
            className='w-28'
          />
          {isUserSnippetAuthor && isSnippetPublic && (
            <ShareSnippetDialog snippetId={snippetId}>
              <Button className='flex h-8 w-max items-center gap-2 px-3 text-xs'>
                <Icon name='share' className='text-gray-900' weight='bold' />
                Compatilhar snippet
              </Button>
            </ShareSnippetDialog>
          )}
          {isUserSnippetAuthor && (
            <Controller
              control={formControl}
              name='isSnippetPublic'
              render={({ field: { onChange } }) => {
                return (
                  <Switch
                    label='Público'
                    name='is-public'
                    value='public'
                    defaultCheck={isSnippetPublic}
                    onCheck={onChange}
                  />
                )
              }}
            />
          )}
        </div>
      </header>

      <div style={{ height: editorHeight }} className='overflow-hidden px-6'>
        <CodeEditorToolbar
          codeEditorRef={playgroudCodeEditorRef}
          onRunCode={handleRunCode}
        >
          <div className='-translate-y-2'>
            {snippetErrors.code && <ErrorMessage>{snippetErrors.code}</ErrorMessage>}
            <Controller
              control={formControl}
              name='snippetCode'
              render={({ field: { value, onChange } }) => {
                return (
                  <PlaygroundCodeEditor
                    ref={playgroudCodeEditorRef}
                    code={value}
                    height={editorHeight}
                    onCodeChange={onChange}
                    isRunnable={true}
                  />
                )
              }}
            />
          </div>
        </CodeEditorToolbar>
      </div>
    </div>
  )
}
