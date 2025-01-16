'use client'

import { useRef } from 'react'
import { Controller } from 'react-hook-form'

import type { SnippetDto } from '@stardust/core/playground/dtos'

import { useRouter } from '@/ui/global/hooks/useRouter'
import { TitleInput } from '@/ui/global/widgets/components/TitleInput'
import { ActionButton } from '@/ui/global/widgets/components/ActionButton'
import type { PlaygroundCodeEditorRef } from '@/ui/global/widgets/components/PlaygroundCodeEditor/types'
import type { ActionButtonTitles } from '@/ui/global/widgets/components/ActionButton/types'
import { Switch } from '@/ui/global/widgets/components/Switch'
import { CodeEditorToolbar } from '@/ui/global/widgets/components/CodeEditorToolbar'
import { PlaygroundCodeEditor } from '@/ui/global/widgets/components/PlaygroundCodeEditor'
import { ErrorMessage } from '@/ui/global/widgets/components/ErrorMessage'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { Button } from '@/ui/global/widgets/components/Button'
import { AlertDialog } from '@/ui/global/widgets/components/AlertDialog'
import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'
import { useSnippetPage } from './useSnippetPage'
import { ShareSnippetDialog } from '../../components/ShareSnippetDialog'

const HEADER_HEIGHT = 68
const SAVE_BUTTON_CONTAINER_HEIGHT = 12
const CODE_EDITOR_MARGIN_TOP = 24

type SnippetPageProps = {
  snippetDto?: SnippetDto
}

export function SnippetPage({ snippetDto }: SnippetPageProps) {
  const playgroudCodeEditorRef = useRef<PlaygroundCodeEditorRef>(null)
  const authAlertDialogRef = useRef<AlertDialogRef>(null)
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
    handleAuthAlertDialogConfirm,
  } = useSnippetPage({
    playgroudCodeEditorRef,
    authAlertDialogRef,
    snippetDto,
  })
  const { goBack } = useRouter()
  const ACTION_BUTTON_TITLES: ActionButtonTitles = {
    canExecute: 'salvar?',
    executing: 'salvando...',
    default: 'salvar',
    success: 'salvado',
    failure: 'erro',
  }
  const editorHeight =
    pageHeight - HEADER_HEIGHT - SAVE_BUTTON_CONTAINER_HEIGHT - CODE_EDITOR_MARGIN_TOP

  return (
    <div className='flex flex-col'>
      <header
        className='grid grid-cols-2 px-6 pt-6 bg-gray-800'
        style={{ height: HEADER_HEIGHT }}
      >
        <Controller
          control={formControl}
          name='snippetTitle'
          render={({ field: { value, onChange } }) => {
            return (
              <TitleInput
                value={value}
                onChange={onChange}
                placeholder='Título do seu snippet'
                className=' text-gray-50 bg-gray-800'
                errorMessage={snippetErrors.title}
              />
            )
          }}
        />
        <div
          className='flex items-center justify-end gap-3'
          style={{ height: SAVE_BUTTON_CONTAINER_HEIGHT }}
        >
          <AlertDialog
            ref={authAlertDialogRef}
            type='denying'
            title='Negado!'
            body={
              <p className='text-center leading-8 text-gray-100'>
                Primeiro, faça login na sua conta antes de salvar seu snippet
              </p>
            }
            action={<Button onClick={handleAuthAlertDialogConfirm}>Fazer login</Button>}
            cancel={<Button className='bg-gray-400 text-gray-800'>Cancelar</Button>}
          />

          <div className='absolute md:sticky bottom-0 left-0 right-0 z-50 py-3 bg-gray-800 flex xs:items-end justify-center lg:justify-end gap-2 w-full mt-6 xs:mt-0'>
            <div className='flex items-end gap-2'>
              <Button onClick={goBack} className='bg-gray-600 text-gray-50 w-16'>
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
                icon='cloud'
                className='w-28'
              />
            </div>
            <div className='flex items-end gap-2'>
              {isUserSnippetAuthor && isSnippetPublic && (
                <ShareSnippetDialog snippetId={snippetId}>
                  <Button className='flex w-max items-center gap-1 px-3'>
                    <Icon
                      name='share'
                      size={16}
                      className='text-gray-900'
                      weight='bold'
                    />
                    Compatilhar
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
          </div>
        </div>
      </header>

      <div
        style={{ height: editorHeight, marginTop: CODE_EDITOR_MARGIN_TOP }}
        className='overflow-hidden px-6'
      >
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
