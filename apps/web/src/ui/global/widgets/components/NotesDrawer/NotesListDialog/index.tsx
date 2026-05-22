import type { NoteDto } from '@stardust/core/profile/entities/dtos'
import { NotesListDialogView } from './NotesListDialogView'

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

export const NotesListDialog = ({
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
    <NotesListDialogView
      isOpen={isOpen}
      isLoading={isLoading}
      errorMessage={errorMessage}
      isEmpty={isEmpty}
      notes={notes}
      page={page}
      totalPagesCount={totalPagesCount}
      onOpenChange={onOpenChange}
      onSearchChange={onSearchChange}
      onPreviousPageClick={onPreviousPageClick}
      onNextPageClick={onNextPageClick}
      onSelectNote={onSelectNote}
      onCreateNewClick={onCreateNewClick}
      onRetry={onRetry}
    />
  )
}
