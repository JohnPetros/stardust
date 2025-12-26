import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { nameSchema } from '@stardust/validation/global/schemas'

const formSchema = z.object({
  title: nameSchema,
})

type FormData = z.infer<typeof formSchema>

type Params = {
  defaultTitle?: string
  onSubmit: (title: string) => void
  onCancel: () => void
}

export function useGuideForm({ defaultTitle, onSubmit, onCancel }: Params) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: defaultTitle ?? '',
    },
  })

  function handleSubmit(data: FormData) {
    onSubmit(data.title)
    form.reset()
  }

  function handleCancel() {
    form.reset()
    onCancel()
  }

  return {
    form,
    isSubmitting: form.formState.isSubmitting,
    handleSubmit: form.handleSubmit(handleSubmit),
    handleCancel,
  }
}
