import type { NoteDto } from '@stardust/core/profile/entities/dtos'
import { NotesSidebarView } from './NotesSidebarView'

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

export const NotesSidebar = ({ ...props }: Props) => {
  return <NotesSidebarView {...props} />
}
