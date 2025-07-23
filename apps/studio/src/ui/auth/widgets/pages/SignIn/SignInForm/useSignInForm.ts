import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Password } from '@stardust/core/auth/structures'
import { Email } from '@stardust/core/global/structures'
import { emailSchema, passwordSchema } from '@stardust/validation/global/schemas'

import { useAuthContext } from '@/ui/global/hooks/useAuthContext'

const formSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export type SignInFormData = z.infer<typeof formSchema>

export function useSignInForm() {
  const form = useForm<SignInFormData>({
    resolver: zodResolver(formSchema),
    mode: 'onSubmit',
  })
  const { isLoading, signIn } = useAuthContext()

  async function handleSubmit(data: SignInFormData) {
    await signIn(Email.create(data.email), Password.create(data.password))
  }

  return {
    form,
    isLoading,
    handleSubmit: form.handleSubmit(handleSubmit),
  }
}
