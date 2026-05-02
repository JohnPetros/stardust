import Link from 'next/link'
import type { RefObject } from 'react'
import { Controller, type Control } from 'react-hook-form'

import type { LspSnippet } from '@stardust/core/global/types'

import { ROUTES } from '@/constants'
import { ActionButton } from '@/ui/global/widgets/components/ActionButton'
import type { ActionButtonTitles } from '@/ui/global/widgets/components/ActionButton/types'
import { AlertDialog } from '@/ui/global/widgets/components/AlertDialog'
import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'
import { Button } from '@/ui/global/widgets/components/Button'
import { CodeEditorToolbar } from '@/ui/global/widgets/components/CodeEditorToolbar'
import { ErrorMessage } from '@/ui/global/widgets/components/ErrorMessage'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { PlaygroundCodeEditor } from '@/ui/global/widgets/components/PlaygroundCodeEditor'
import type { PlaygroundCodeEditorRef } from '@/ui/global/widgets/components/PlaygroundCodeEditor/types'
import { Switch } from '@/ui/global/widgets/components/Switch'
import * as Toolbar from '@/ui/global/widgets/components/Toolbar'
import { TitleInput } from '@/ui/global/widgets/components/TitleInput'
import { ShareSnippetDialog } from '../../components/ShareSnippetDialog'
import { SnippetExamplesDialog } from '../../components/SnippetExamplesDialog'
import type { SnippetForm } from './useSnippetPage'

const HEADER_HEIGHT = 68
const SAVE_BUTTON_CONTAINER_HEIGHT = 12
const CODE_EDITOR_MARGIN_TOP = 24

type Props = {
  pageHeight: number
  formControl: Control<SnippetForm>
  snippetId?: string
  snippetFieldErrors: Record<string, string[]>
  isSnippetPublic?: boolean
  isActionDisabled: boolean
  canExecuteAction: boolean
  isActionSuccess: boolean
  isActionFailure: boolean
  isActionExecuting: boolean
  isUserSnippetAuthor: boolean
  exampleSnippets: LspSnippet[]
  playgroudCodeEditorRef: RefObject<PlaygroundCodeEditorRef | null>
  authAlertDialogRef: RefObject<AlertDialogRef | null>
  replaceSnippetAlertDialogRef: RefObject<AlertDialogRef | null>
  onAuthConfirm: () => void
  onRunCode: () => void
  onActionButtonClick: () => Promise<void>
  onExampleSnippetSelect: (snippet: LspSnippet) => void
  onExampleSnippetReplaceConfirm: () => void
}

export const SnippetPageView = ({
  pageHeight,
  formControl,
  snippetId,
  snippetFieldErrors,
  isSnippetPublic,
  isActionDisabled,
  canExecuteAction,
  isActionSuccess,
  isActionFailure,
  isActionExecuting,
  isUserSnippetAuthor,
  exampleSnippets,
  playgroudCodeEditorRef,
  authAlertDialogRef,
  replaceSnippetAlertDialogRef,
  onAuthConfirm,
  onRunCode,
  onActionButtonClick,
  onExampleSnippetSelect,
  onExampleSnippetReplaceConfirm,
}: Props) => {
  const actionButtonTitles: ActionButtonTitles = {
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
                className='text-gray-50 bg-gray-800'
                errorMessage={snippetFieldErrors.snippetTitle?.join(', ')}
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
            action={<Button onClick={onAuthConfirm}>Fazer login</Button>}
            cancel={<Button className='bg-gray-400 text-gray-800'>Cancelar</Button>}
          />

          <AlertDialog
            ref={replaceSnippetAlertDialogRef}
            type='asking'
            title='Substituir conteúdo atual?'
            body={
              <p className='text-center leading-8 text-gray-100'>
                Esse exemplo vai substituir o título e o código atuais. Nada será salvo
                automaticamente.
              </p>
            }
            action={<Button onClick={onExampleSnippetReplaceConfirm}>Substituir</Button>}
            cancel={<Button className='bg-gray-400 text-gray-800'>Cancelar</Button>}
            shouldPlayAudio={false}
          />

          <div className='absolute md:sticky bottom-0 left-0 right-0 z-50 py-3 bg-gray-800 flex xs:items-end justify-center lg:justify-end gap-2 w-full mt-6 xs:mt-0'>
            <div className='flex items-end gap-2'>
              <Button asChild className='bg-gray-600 text-gray-50 w-16 h-8 text-sm'>
                <Link href={ROUTES.playground.snippets}>Voltar</Link>
              </Button>
              <ActionButton
                type='button'
                titles={actionButtonTitles}
                isExecuting={isActionExecuting}
                canExecute={canExecuteAction}
                isSuccess={isActionSuccess}
                isFailure={isActionFailure}
                isDisabled={isActionDisabled}
                onExecute={onActionButtonClick}
                icon='cloud'
                className='w-28 h-8'
              />
            </div>
            <div className='flex items-end gap-2'>
              {isUserSnippetAuthor && isSnippetPublic && snippetId && (
                <ShareSnippetDialog snippetId={snippetId}>
                  <Button className='flex w-max items-center gap-1 px-3 h-8 text-sm'>
                    <Icon
                      name='share'
                      size={14}
                      className='text-gray-900'
                      weight='bold'
                    />
                    Compartilhar
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
        {snippetFieldErrors.snippetCode && (
          <ErrorMessage>{snippetFieldErrors.snippetCode?.join(', ')}</ErrorMessage>
        )}
        <CodeEditorToolbar
          codeEditorRef={playgroudCodeEditorRef}
          onRunCode={onRunCode}
          options={{
            shouldHideAssistantButton: true,
            customActions: (
              <SnippetExamplesDialog
                snippets={exampleSnippets}
                onSelectSnippet={onExampleSnippetSelect}
              >
                <Toolbar.Button label='Exemplos' icon='snippet' />
              </SnippetExamplesDialog>
            ),
          }}
        >
          <div className='-translate-y-2'>
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
