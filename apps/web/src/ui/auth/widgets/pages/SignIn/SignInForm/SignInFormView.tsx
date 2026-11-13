import type { BaseSyntheticEvent } from 'react'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'

import { Input } from '@/ui/global/widgets/components/Input'
import { Button } from '@/ui/global/widgets/components/Button'
import type { SignInFormFields } from './types/SignInFormFields'
import { UnconfirmedEmailNotice } from './UnconfirmedEmailNotice'

export type SignInFormViewProps = {
  errors: FieldErrors<SignInFormFields>
  isLoading: boolean
  register: UseFormRegister<SignInFormFields>
  handleSubmit: (event?: BaseSyntheticEvent) => Promise<void>
  unconfirmedEmail: string | null
  isResendingEmail: boolean
  onResendEmail: () => Promise<void>
}

export const SignInFormView = ({
  errors,
  isLoading,
  register,
  handleSubmit,
  unconfirmedEmail,
  isResendingEmail,
  onResendEmail,
}: SignInFormViewProps) => {
  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
      <div className='flex flex-col gap-4'>
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
      {unconfirmedEmail && (
        <UnconfirmedEmailNotice
          email={unconfirmedEmail}
          isResending={isResendingEmail}
          onResend={onResendEmail}
        />
      )}
      <Button type='submit' name='submit' isLoading={isLoading} testId='submit-button'>
        Entrar
      </Button>
    </form>
  )
}
