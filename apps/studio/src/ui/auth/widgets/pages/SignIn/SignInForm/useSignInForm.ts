import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Password } from '@stardust/core/auth/structures'
import { Email } from '@stardust/core/global/structures'
import { emailSchema, passwordSchema } from '@stardust/validation/global/schemas'

import type { AuthService } from '@stardust/core/auth/interfaces'
import type { NavigationProvider, ToastProvider } from '@stardust/core/global/interfaces'
import { ROUTES, SESSION_STORAGE_KEYS } from '@/constants'
import { useSessionStorage } from 'usehooks-ts'

const formSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export type SignInFormData = z.infer<typeof formSchema>

type Params = {
  authService: AuthService
  toastProvider: ToastProvider
  navigationProvider: NavigationProvider
}

export function useSignInForm({ authService, toastProvider, navigationProvider }: Params) {
  const form = useForm<SignInFormData>({
    resolver: zodResolver(formSchema),
    mode: 'onSubmit',
  })
  const [_, setAccessToken] = useSessionStorage(SESSION_STORAGE_KEYS.accessToken, '')

  async function handleSubmit(data: SignInFormData) {
    const response = await authService.signIn(Email.create(data.email), Password.create(data.password))

    if (response.isSuccessful) {
      toastProvider.showSuccess('Login realizado com sucesso')
      setAccessToken(response.body.accessToken)
      navigationProvider.goTo(ROUTES.space.planets)
    }

    if (response.isFailure) toastProvider.showError(response.errorMessage)
  }
  return {
    form,
    handleSubmit: form.handleSubmit(handleSubmit),
  }
}
