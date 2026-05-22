import { twMerge } from 'tailwind-merge'
import type { NoteDto } from '@stardust/core/profile/entities/dtos'

import { Search } from '@/ui/global/widgets/components/Search'
import { Button } from '@/ui/global/widgets/components/Button'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { EmptyNotesState } from '../states/EmptyNotesState'

type Props = {
  notes: NoteDto[]
  selectedNoteId: string | null
  page: number
  totalPagesCount: number
  totalItemsCount: number
  isLoading: boolean
  isPaginationDisabled: boolean
  errorMessage: string | null
  isCollapsed: boolean
  onSearchChange: (value: string) => void
  onSelectNote: (note: NoteDto) => void
  onCreateNoteClick: () => void
  onToggleCollapse: () => void
  onPreviousPageClick: () => void
  onNextPageClick: () => void
  onRetry: () => void
}

export const NotesSidebarView = ({
  notes,
  selectedNoteId,
  page,
  totalPagesCount,
  totalItemsCount,
  isLoading,
  isPaginationDisabled,
  errorMessage,
  isCollapsed,
  onSearchChange,
  onSelectNote,
  onCreateNoteClick,
  onToggleCollapse,
  onPreviousPageClick,
  onNextPageClick,
  onRetry,
}: Props) => {
  if (isCollapsed) {
    return (
      <aside className='rounded-[28px] border border-[#303030] bg-[#0b0e0f] p-3'>
        <button
          type='button'
          onClick={onToggleCollapse}
          className='flex h-10 w-10 items-center justify-center rounded-xl border border-[#303030] bg-[#1e2626] text-gray-200 transition-colors hover:bg-[#263131]'
          aria-label='Expandir sidebar de notas'
        >
          <Icon name='arrow-right' size={16} />
        </button>
      </aside>
    )
  }

  return (
    <aside className='rounded-[28px] border border-[#303030] bg-[#0b0e0f] p-5'>
      <div className='mb-5 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <button
            type='button'
            onClick={onToggleCollapse}
            className='flex h-9 w-9 items-center justify-center rounded-xl border border-[#303030] bg-[#1e2626] text-gray-200 transition-colors hover:bg-[#263131]'
            aria-label='Contrair sidebar de notas'
          >
            <Icon name='arrow-left' size={14} />
          </button>

          <div>
            <p className='text-xs font-extrabold uppercase tracking-[0.08em] text-gray-400'>
              Notes Sidebar
            </p>
            <p className='mt-1 text-sm text-gray-300'>
              {totalItemsCount} {totalItemsCount === 1 ? 'nota' : 'notas'}
            </p>
          </div>
        </div>
        <button
          type='button'
          onClick={onCreateNoteClick}
          className='rounded-xl border border-[#303030] bg-[#1e2626] px-3 py-2 text-xs font-extrabold text-green-300 transition-colors hover:bg-[#263131]'
          aria-label='Criar nova nota'
        >
          Nova nota
        </button>
      </div>

      <div className='mb-4'>
        <Search onSearchChange={onSearchChange} placeholder='Buscar por titulo' />
      </div>

      {isLoading && <p className='text-sm text-gray-300'>Carregando notas...</p>}

      {errorMessage && (
        <div className='space-y-2'>
          <p className='text-sm text-red-400'>{errorMessage}</p>
          <Button className='h-9 w-max px-4' onClick={onRetry}>
            Tentar novamente
          </Button>
        </div>
      )}

      {!isLoading && !errorMessage && notes.length === 0 && (
        <EmptyNotesState
          title='Nenhuma nota encontrada'
          description='Comece criando uma nota para salvar ideias e rascunhos.'
        />
      )}

      {!errorMessage && notes.length > 0 && (
        <div className='space-y-2'>
          <ul className='max-h-[520px] space-y-3 overflow-y-auto pr-1'>
            {notes.map((note) => {
              const isActive = note.id === selectedNoteId

              return (
                <li key={note.id}>
                  <button
                    type='button'
                    onClick={() => onSelectNote(note)}
                    className={twMerge(
                      'w-full rounded-[18px] border bg-[#1e2626] p-4 text-left transition-colors',
                      isActive
                        ? 'border-green-400/80'
                        : 'border-[#303030] hover:bg-[#263131]',
                    )}
                  >
                    <p className='line-clamp-1 text-sm font-bold text-gray-100'>
                      {note.title}
                    </p>
                    <p className='mt-1 line-clamp-2 text-xs text-gray-400'>
                      {note.content || 'Sem conteúdo'}
                    </p>
                  </button>
                </li>
              )
            })}
          </ul>

          {totalPagesCount > 1 && (
            <div className='mt-4 flex items-center justify-between rounded-xl border border-[#303030] bg-[#1e2626] px-3 py-2'>
              <button
                type='button'
                onClick={onPreviousPageClick}
                className='rounded-md border border-[#303030] px-3 py-1 text-sm text-gray-200 disabled:opacity-40'
                disabled={isPaginationDisabled || page <= 1}
                aria-label='Pagina anterior'
              >
                Anterior
              </button>
              <p className='text-xs font-semibold text-gray-300'>
                Pagina {page} de {totalPagesCount}
              </p>
              <button
                type='button'
                onClick={onNextPageClick}
                className='rounded-md border border-[#303030] px-3 py-1 text-sm text-gray-200 disabled:opacity-40'
                disabled={isPaginationDisabled || page >= totalPagesCount}
                aria-label='Proxima pagina'
              >
                Proxima
              </button>
            </div>
          )}
        </div>
      )}
    </aside>
  )
}
