import type { NoteDto } from '@stardust/core/profile/entities/dtos'

import { Button } from '@/ui/global/widgets/components/Button'
import { NoteEditorForm } from '../NoteEditorForm'
import { EmptyNotesState } from '../states/EmptyNotesState'

type Props = {
  selectedNote: NoteDto | null
  isSaving: boolean
  isDeleting: boolean
  hasNotes: boolean
  onDeleteClick: () => void
  onSubmit: (formData: { title: string; content: string }) => Promise<boolean>
  onDirtyChange: (isDirty: boolean) => void
}

export const NoteEditorView = ({
  selectedNote,
  isSaving,
  isDeleting,
  hasNotes,
  onDeleteClick,
  onSubmit,
  onDirtyChange,
}: Props) => {
  const FORM_ID = 'note-editor-form'

  return (
    <section className='rounded-[28px] border border-[#303030] bg-[#0b0e0f] p-4 sm:p-6'>
      <div className='mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <p className='text-xs font-extrabold uppercase tracking-[0.08em] text-gray-400'>
            Notes Editor
          </p>
          <h2 className='mt-1 text-2xl font-extrabold tracking-tight text-gray-100'>
            {selectedNote?.id ? 'Editar nota' : 'Nova nota'}
          </h2>
          <p className='text-sm text-gray-400'>
            {selectedNote?.id
              ? 'Atualize o conteúdo e salve as alterações.'
              : 'Preencha os campos abaixo para criar uma nova anotação.'}
          </p>
        </div>

        <div className='flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center'>
          <Button
            type='submit'
            form={FORM_ID}
            isLoading={isSaving}
            aria-label='Salvar anotação'
            className='h-10 w-full rounded-xl px-4 text-gray-900 sm:w-max'
          >
            Salvar nota
          </Button>

          <button
            type='button'
            onClick={onDeleteClick}
            className='h-10 w-full rounded-xl border border-red-500/60 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-300 disabled:opacity-40 sm:w-max'
            disabled={!selectedNote?.id || isDeleting}
            aria-label='Excluir nota'
          >
            Excluir
          </button>
        </div>
      </div>

      <NoteEditorForm
        formId={FORM_ID}
        note={selectedNote}
        onSubmit={onSubmit}
        onDirtyChange={onDirtyChange}
      />

      {!selectedNote && !hasNotes && (
        <div className='mt-6'>
          <EmptyNotesState
            title='Sua lista está vazia'
            description='Crie sua primeira nota para organizar aprendizados e ideias.'
          />
        </div>
      )}
    </section>
  )
}
