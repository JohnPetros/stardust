import type { NoteDto } from '@stardust/core/profile/entities/dtos'

import { NoteEditorView } from './NoteEditorView'

type Props = {
  selectedNote: NoteDto | null
  isSaving: boolean
  isDeleting: boolean
  hasNotes: boolean
  onDeleteClick: () => void
  onSubmit: (formData: { title: string; content: string }) => Promise<boolean>
  onDirtyChange: (isDirty: boolean) => void
}

export const NoteEditor = ({ ...props }: Props) => {
  return <NoteEditorView {...props} />
}
