import { Input } from '@/ui/global/widgets/components/Input'
import { Button } from '@/ui/global/widgets/components/Button'
import { useSignInForm } from './useSignInForm'
import type { SignInFormFields } from './types/SignInFormFields'

type SignInFormProps = {
  onSubmit: (fields: SignInFormFields) => Promise<void>
}

export function SignInForm({ onSubmit }: SignInFormProps) {
  const { errors, isLoading, register, handleSubmit } = useSignInForm(onSubmit)

  return (
    <form onSubmit={handleSubmit} className='mt-4'>
      <div className='space-y-4'>
        <Input
          testId='email-input'
          label='E-mail'
          type='email'
          icon='mail'
          placeholder='Digite seu e-mail'
          autoFocus
          {...register('email')}
          errorMessage={errors.email?.message}
        />
        <Input
          testId='password-input'
          label='Senha'
          type='password'
          icon='lock'
          placeholder='Digite sua senha'
          {...register('password')}
          errorMessage={errors.password?.message}
        />
      </div>
      <Button
        type='submit'
        name='submit'
        isLoading={isLoading}
        className='mt-6'
        testId='submit-button'
      >
        Entrar
      </Button>
    </form>
  )
}
