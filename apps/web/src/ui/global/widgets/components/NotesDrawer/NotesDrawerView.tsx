import type { ReactNode } from 'react'
import { Drawer } from 'vaul'
import type { NoteDto } from '@stardust/core/profile/entities/dtos'

import { Icon } from '@/ui/global/widgets/components/Icon'
import { Button } from '@/ui/global/widgets/components/Button'
import { TiptapEditorField } from './TiptapEditorField'
import { NotesListDialog } from './NotesListDialog'

type Props = {
  children: ReactNode
  isDrawerOpen: boolean
  isDialogOpen: boolean
  isLoadingNotes: boolean
  isSaving: boolean
  isDeleting: boolean
  hasActiveNote: boolean
  errorMessage: string | null
  fieldError: string | null
  isEmpty: boolean
  title: string
  content: string
  page: number
  totalPagesCount: number
  notes: NoteDto[]
  onDrawerOpenChange: (isOpen: boolean) => void
  onDialogOpenChange: (isOpen: boolean) => void
  onOpenNotesDialog: () => void
  onTitleChange: (value: string) => void
  onContentChange: (value: string) => void
  onSearchChange: (value: string) => void
  onSelectNote: (note: NoteDto) => void
  onPreviousPageClick: () => void
  onNextPageClick: () => void
  onSaveClick: () => void
  onDeleteClick: () => void
  onCreateNewClick: () => void
  onRetryList: () => void
}

export const NotesDrawerView = ({
  children,
  isDrawerOpen,
  isDialogOpen,
  isLoadingNotes,
  isSaving,
  isDeleting,
  hasActiveNote,
  errorMessage,
  fieldError,
  isEmpty,
  title,
  content,
  page,
  totalPagesCount,
  notes,
  onDrawerOpenChange,
  onDialogOpenChange,
  onOpenNotesDialog,
  onTitleChange,
  onContentChange,
  onSearchChange,
  onSelectNote,
  onPreviousPageClick,
  onNextPageClick,
  onSaveClick,
  onDeleteClick,
  onCreateNewClick,
  onRetryList,
}: Props) => {
  return (
    <>
      <button
        type='button'
        onClick={() => onDrawerOpenChange(true)}
        aria-label='Abrir anotacoes'
      >
        {children}
      </button>

      <Drawer.Root open={isDrawerOpen} onOpenChange={onDrawerOpenChange}>
        <Drawer.Portal>
          <Drawer.Overlay className='fixed inset-0 z-[500] bg-gray-950/70 backdrop-blur-[1px]' />
          <Drawer.Content className='fixed right-0 top-0 z-[500] h-screen w-full max-w-[560px] border-l border-[#303030] bg-[#0b0e0f] outline-none'>
            <Drawer.Title className='sr-only'>Anotações</Drawer.Title>
            <div className='flex h-full flex-col gap-5 overflow-y-auto bg-[#0b0e0f] p-7'>
              <div className='space-y-4'>
                <div className='flex items-center justify-between gap-3'>
                  <p className='text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-300'>
                    Notas pessoais
                  </p>
                  <div className='flex items-center gap-2'>
                    <button
                      type='button'
                      className='h-10 rounded-full border border-[#303030] bg-[#1e2626] px-4 text-sm font-semibold text-gray-200 transition-colors hover:bg-[#273232]'
                      onClick={onCreateNewClick}
                      aria-label='Adicionar nova anotacao'
                    >
                      Adicionar nota
                    </button>
                    <button
                      type='button'
                      className='h-10 rounded-full border border-[#303030] bg-[#1e2626] px-4 text-sm font-semibold text-gray-200 transition-colors hover:bg-[#273232]'
                      onClick={onOpenNotesDialog}
                      aria-label='Ver notas existentes'
                    >
                      Ver notas
                    </button>
                    <button
                      type='button'
                      aria-label='Fechar anotações'
                      onClick={() => onDrawerOpenChange(false)}
                      className='flex h-10 w-10 items-center justify-center rounded-full border border-[#303030] bg-[#1e2626] text-gray-300 transition-colors hover:bg-[#273232]'
                    >
                      <Icon name='close' size={16} />
                    </button>
                  </div>
                </div>

                {!hasActiveNote && (
                  <div className='space-y-2'>
                    <h2 className='text-3xl font-extrabold text-gray-100'>Nova nota</h2>
                    <p className='text-sm text-gray-400'>
                      Registre um insight sem sair da aula. O conteúdo abaixo sera
                      persistido na sua conta.
                    </p>
                  </div>
                )}
              </div>

              <div className='space-y-2'>
                <label
                  htmlFor='note-title'
                  className='text-sm font-extrabold text-gray-300'
                >
                  Título
                </label>
                <input
                  id='note-title'
                  type='text'
                  value={title}
                  onChange={({ target }) => onTitleChange(target.value)}
                  className='h-14 w-full rounded-2xl border border-[#303030] bg-[#1e2626] px-4 text-lg font-bold text-gray-100 outline-none transition-colors focus:border-emerald-400/70'
                />
              </div>

              {fieldError && <p className='mt-2 text-xs text-red-500'>{fieldError}</p>}

              <div className='flex-1'>
                <div className='mb-2 flex items-center justify-between'>
                  <p className='text-sm font-extrabold text-gray-300'>Corpo</p>
                  <button
                    type='button'
                    onClick={onCreateNewClick}
                    className='rounded-full border border-[#303030] bg-[#1e2626] px-3 py-1 text-xs font-semibold text-gray-300 transition-colors hover:bg-[#273232]'
                  >
                    Limpar
                  </button>
                </div>
                <TiptapEditorField value={content} onChange={onContentChange} />
              </div>

              <div className='grid grid-cols-2 gap-3'>
                <Button
                  onClick={onSaveClick}
                  isLoading={isSaving}
                  aria-label='Salvar anotação'
                  className='h-12 rounded-2xl bg-[#00ff88] font-extrabold text-[#0b0e0f]'
                >
                  Salvar nota
                </Button>
                <Button
                  onClick={onDeleteClick}
                  isLoading={isDeleting}
                  aria-label='Excluir anotação'
                  className='h-12 rounded-2xl border border-[#303030] bg-[#1e2626] font-bold text-gray-200'
                  disabled={!hasActiveNote}
                >
                  Excluir
                </Button>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      <NotesListDialog
        isOpen={isDialogOpen}
        isLoading={isLoadingNotes}
        errorMessage={errorMessage}
        isEmpty={isEmpty}
        notes={notes}
        page={page}
        totalPagesCount={totalPagesCount}
        onOpenChange={onDialogOpenChange}
        onSearchChange={onSearchChange}
        onPreviousPageClick={onPreviousPageClick}
        onNextPageClick={onNextPageClick}
        onSelectNote={onSelectNote}
        onCreateNewClick={onCreateNewClick}
        onRetry={onRetryList}
      />
    </>
  )
}
