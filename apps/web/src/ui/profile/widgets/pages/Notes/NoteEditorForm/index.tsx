import type { NoteDto } from '@stardust/core/profile/entities/dtos'

import { useNoteEditorForm } from './useNoteEditorForm'
import { NoteEditorFormView } from './NoteEditorFormView'

type Props = {
  formId: string
  note: NoteDto | null
  onSubmit: (formData: { title: string; content: string }) => Promise<boolean>
  onDirtyChange: (isDirty: boolean) => void
}

export const NoteEditorForm = ({ formId, note, onSubmit, onDirtyChange }: Props) => {
  const form = useNoteEditorForm({ note, onSubmit, onDirtyChange })

  return <NoteEditorFormView {...form} formId={formId} />
}
