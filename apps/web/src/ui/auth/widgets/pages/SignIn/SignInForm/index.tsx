import { Input } from '@/ui/global/widgets/components/Input'
import { Button } from '@/ui/global/widgets/components/Button'
import { useSignInForm } from './useSignInForm'
import type { SignInFormFields } from './types/SignInFormFields'

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
          errorMessage={errors.email?.message}
        />
        <Input
          label='Senha'
          type='password'
          icon='lock'
          placeholder='Digite sua senha'
          {...register('password')}
          errorMessage={errors.password?.message}
        />
      </div>
      <Button type='submit' name='submit' isLoading={isLoading} className='mt-6'>
        Entrar
      </Button>
    </form>
  )
}
