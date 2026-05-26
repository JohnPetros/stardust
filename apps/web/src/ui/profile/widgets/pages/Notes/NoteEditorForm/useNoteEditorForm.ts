import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

import type { NoteDto } from '@stardust/core/profile/entities/dtos'
import { noteSchema } from '@stardust/validation/profile/schemas'

const formSchema = noteSchema

type NoteFormData = z.infer<typeof formSchema>

type Params = {
  note: NoteDto | null
  onSubmit: (formData: NoteFormData) => Promise<boolean>
  onDirtyChange: (isDirty: boolean) => void
}

export function useNoteEditorForm({ note, onSubmit, onDirtyChange }: Params) {
  const form = useForm<NoteFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: note?.title ?? '',
      content: note?.content ?? '',
    },
    mode: 'onSubmit',
  })

  useEffect(() => {
    form.reset({
      title: note?.title ?? '',
      content: note?.content ?? '',
    })
  }, [note, form])

  useEffect(() => {
    onDirtyChange(form.formState.isDirty)
  }, [form.formState.isDirty, onDirtyChange])

  async function handleFormSubmit(formData: NoteFormData) {
    const isSaved = await onSubmit(formData)

    if (isSaved) {
      form.reset(formData)
    }
  }

  return {
    title: form.watch('title'),
    content: form.watch('content'),
    errors: form.formState.errors,
    handleFormSubmit: form.handleSubmit(handleFormSubmit),
    handleTitleChange: (value: string) =>
      form.setValue('title', value, { shouldDirty: true }),
    handleContentChange: (value: string) =>
      form.setValue('content', value, { shouldDirty: true }),
  }
}
