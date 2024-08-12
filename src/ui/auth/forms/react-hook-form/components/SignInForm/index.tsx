import { SignInFormFields } from '@/ui/auth/forms/types'
import { Input } from '@/ui/global/components/shared/Input'
import { Button } from '@/ui/global/components/shared/Button'

import { useSignInForm } from './useSignInForm'

type SignInFormProps = {
  id: string
  onSubmit: (fields: SignInFormFields) => Promise<void>
}

export function SignInForm({ id, onSubmit }: SignInFormProps) {
  const { errors, isLoading, register, handleSubmit } = useSignInForm(onSubmit)

  return (
    <form id={id} aria-label={id} onSubmit={handleSubmit} className='mt-4'>
      <div className='space-y-4'>
        <Input
          label='E-mail'
          type='email'
          icon='mail'
          placeholder='Digite seu e-mail'
          autoFocus
          {...register('email')}
          error={errors.email?.message}
        />
        <Input
          label='Senha'
          type='password'
          icon='lock'
          placeholder='Digite sua senha'
          {...register('password')}
          error={errors.password?.message}
        />
      </div>
      <Button type='submit' name='submit' isLoading={isLoading} className='mt-6'>
        Entrar
      </Button>
    </form>
  )
}
