import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  image: z.string().min(1, 'Imagem é obrigatória'),
  price: z.coerce.number().int().min(0, 'Preço deve ser maior ou igual a 0'),
  isAcquiredByDefault: z.boolean().optional(),
  isSelectedByDefault: z.boolean().optional(),
})

type FormValues = z.infer<typeof schema>

type Params = {
  onSubmit: (data: FormValues) => void
  initialValues?: FormValues
}

export function useAvatarForm({ onSubmit, initialValues }: Params) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialValues || {
      name: '',
      image: '',
      price: 0,
      isAcquiredByDefault: false,
      isSelectedByDefault: false,
    },
  })

  const formImage = form.watch('image')
  const { isSubmitting } = form.formState

  async function handleSubmit(data: FormValues) {
    await onSubmit(data)
    setIsDialogOpen(false)
    form.reset(
      initialValues || {
        name: '',
        image: '',
        price: 0,
        isAcquiredByDefault: false,
        isSelectedByDefault: false,
      },
    )
  }

  function handleDialogChange(open: boolean) {
    setIsDialogOpen(open)
    if (!open) {
      form.reset(
        initialValues || {
          name: '',
          image: '',
          price: 0,
          isAcquiredByDefault: false,
          isSelectedByDefault: false,
        },
      )
    }
  }

  return {
    form,
    formImage,
    isSubmitting,
    isDialogOpen,
    setIsDialogOpen,
    handleSubmit: form.handleSubmit(handleSubmit),
    handleDialogChange,
  }
}
