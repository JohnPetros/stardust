import type { NoteDto } from '@stardust/core/profile/entities/dtos'
import { Datetime } from '@stardust/core/global/libs'

import * as Dialog from '@/ui/global/widgets/components/Dialog'
import { Search } from '@/ui/global/widgets/components/Search'
import { Loading } from '@/ui/global/widgets/components/Loading'
import { Button } from '@/ui/global/widgets/components/Button'

type Props = {
  isOpen: boolean
  isLoading: boolean
  errorMessage: string | null
  isEmpty: boolean
  notes: NoteDto[]
  page: number
  totalPagesCount: number
  onOpenChange: (isOpen: boolean) => void
  onSearchChange: (value: string) => void
  onPreviousPageClick: () => void
  onNextPageClick: () => void
  onSelectNote: (note: NoteDto) => void
  onCreateNewClick: () => void
  onRetry: () => void
}

export const NotesListDialogView = ({
  isOpen,
  isLoading,
  errorMessage,
  isEmpty,
  notes,
  page,
  totalPagesCount,
  onOpenChange,
  onSearchChange,
  onPreviousPageClick,
  onNextPageClick,
  onSelectNote,
  onCreateNewClick,
  onRetry,
}: Props) => {
  return (
    <Dialog.Container open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Content className='max-w-2xl bg-[#050b11]'>
        <Dialog.Header>Suas anotações</Dialog.Header>

        <div className='mt-4 space-y-4'>
          <Search
            id='notes-list-search'
            placeholder='Buscar por titulo...'
            onSearchChange={onSearchChange}
            className='h-10 border-emerald-500/20 bg-[#07121a]'
          />

          <div className='max-h-[26rem] space-y-2 overflow-y-auto'>
            {isLoading && (
              <div className='flex justify-center py-8'>
                <Loading />
              </div>
            )}

            {!isLoading && errorMessage && (
              <div className='space-y-3 py-8 text-center'>
                <p className='text-sm text-red-500'>{errorMessage}</p>
                <Button className='mx-auto w-40' onClick={onRetry}>
                  Tentar novamente
                </Button>
              </div>
            )}

            {!isLoading && !errorMessage && isEmpty && (
              <div className='space-y-3 py-8 text-center'>
                <p className='text-sm text-gray-400'>Nenhuma anotação encontrada.</p>
                <Button className='mx-auto w-40' onClick={onCreateNewClick}>
                  Nova nota
                </Button>
              </div>
            )}

            {!isLoading &&
              !errorMessage &&
              notes.map((note) => (
                <button
                  key={note.id}
                  type='button'
                  className='w-full rounded-xl border border-emerald-500/15 bg-[#08131c] p-3 text-left transition-colors hover:bg-[#0b1822]'
                  onClick={() => onSelectNote(note)}
                >
                  <p className='truncate text-sm font-semibold text-gray-100'>
                    {note.title}
                  </p>
                  <p className='mt-1 line-clamp-2 text-xs text-gray-400'>
                    {note.content}
                  </p>
                  <p className='mt-2 text-[11px] text-gray-500'>
                    Atualizada{' '}
                    {new Datetime(note.updatedAt ?? note.createdAt).formatTimeAgo()}
                  </p>
                </button>
              ))}
          </div>

          {!isLoading && !errorMessage && !isEmpty && (
            <div className='flex items-center justify-between gap-2 border-t border-emerald-500/10 pt-3'>
              <Button
                className='h-9 w-28 border border-emerald-500/20 bg-transparent text-xs text-gray-200'
                disabled={page <= 1}
                onClick={onPreviousPageClick}
              >
                Anterior
              </Button>
              <span className='text-xs text-gray-400'>
                Pagina {page} de {Math.max(totalPagesCount, 1)}
              </span>
              <Button
                className='h-9 w-28 border border-emerald-500/20 bg-transparent text-xs text-gray-200'
                disabled={page >= totalPagesCount}
                onClick={onNextPageClick}
              >
                Proxima
              </Button>
            </div>
          )}
        </div>
      </Dialog.Content>
    </Dialog.Container>
  )
}
