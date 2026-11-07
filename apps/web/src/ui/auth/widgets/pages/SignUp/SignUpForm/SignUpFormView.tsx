'use client'

import type { BaseSyntheticEvent } from 'react'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'

import { Input } from '@/ui/global/widgets/components/Input'
import { Button } from '@/ui/global/widgets/components/Button'
import { AnimatedContainer } from './AnimatedContainer'

type SignUpFormFields = {
  name: string
  email: string
  password: string
}

export type SignUpFormViewProps = {
  errors: FieldErrors<SignUpFormFields>
  isNameValid: boolean
  isEmailValid: boolean
  isPasswordValid: boolean
  isSubmitting: boolean
  register: UseFormRegister<SignUpFormFields>
  handleSubmit: (event?: BaseSyntheticEvent) => Promise<void>
}

type FieldProps = {
  errorMessage?: string
  isValid: boolean
  register: UseFormRegister<SignUpFormFields>
}

const NameField = ({ errorMessage, isValid, register }: FieldProps) => {
  return (
    <AnimatedContainer>
      <Input
        testId='name-input'
        label='Nome de usuário'
        type='text'
        icon='lock'
        placeholder='Digite seu nome de usuário'
        isActive={isValid}
        autoFocus
        errorMessage={
          errorMessage === 'Nome já utilizado por outro usuário' ? errorMessage : ''
        }
        {...register('name')}
      />
      {!isValid && (
        <p
          data-testid='name-input-error'
          className='mt-3 text-sm text-theme-text-secondary'
        >
          Pelo menos 3 caracteres
        </p>
      )}
    </AnimatedContainer>
  )
}

const EmailField = ({ errorMessage, isValid, register }: FieldProps) => {
  return (
    <AnimatedContainer>
      <Input
        testId='email-input'
        label='E-mail'
        type='email'
        icon='mail'
        placeholder='Digite seu e-mail'
        isActive={isValid}
        errorMessage={
          errorMessage === 'E-mail já utilizado por outro usuário' ? errorMessage : ''
        }
        {...register('email')}
      />
      {!isValid && (
        <p
          data-testid='email-input-error'
          className='mt-3 text-sm text-theme-text-secondary'
        >
          E-mail válido, por favor
        </p>
      )}
    </AnimatedContainer>
  )
}

const PasswordField = ({ isValid, register }: Omit<FieldProps, 'errorMessage'>) => {
  return (
    <AnimatedContainer>
      <div className='space-y-4'>
        <Input
          testId='password-input'
          label='Senha'
          type='password'
          icon='lock'
          placeholder='Digite sua senha'
          isActive={isValid}
          {...register('password')}
        />
        {!isValid && (
          <p
            data-testid='password-input-error'
            className='text-sm leading-6 tracking-wider text-theme-text-secondary'
          >
            Senha deve conter pelo menos 6 caracteres 😙.
          </p>
        )}
      </div>
    </AnimatedContainer>
  )
}

const SubmitButton = ({ isSubmitting }: { isSubmitting: boolean }) => {
  return (
    <AnimatedContainer>
      <Button
        testId='submit-button'
        type='submit'
        className='mt-6'
        isLoading={isSubmitting}
      >
        Criar conta
      </Button>
    </AnimatedContainer>
  )
}

export const SignUpFormView = ({
  errors,
  isNameValid,
  isEmailValid,
  isPasswordValid,
  isSubmitting,
  register,
  handleSubmit,
}: SignUpFormViewProps) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className='space-y-4'>
        <NameField
          errorMessage={errors.name?.message}
          isValid={isNameValid}
          register={register}
        />
        {isNameValid && (
          <EmailField
            errorMessage={errors.email?.message}
            isValid={isEmailValid}
            register={register}
          />
        )}

        {isEmailValid && <PasswordField isValid={isPasswordValid} register={register} />}
      </div>
      {isPasswordValid && <SubmitButton isSubmitting={isSubmitting} />}
    </form>
  )
}
