'use client'

import type { BaseSyntheticEvent } from 'react'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'

import { EmailField } from './EmailField'
import { NameField } from './NameField'
import { PasswordField } from './PasswordField'
import { SubmitButton } from './SubmitButton'

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
          registration={register('name')}
        />
        {isNameValid && (
          <EmailField
            errorMessage={errors.email?.message}
            isValid={isEmailValid}
            registration={register('email')}
          />
        )}

        {isEmailValid && (
          <PasswordField isValid={isPasswordValid} registration={register('password')} />
        )}
      </div>
      {isPasswordValid && <SubmitButton isSubmitting={isSubmitting} />}
    </form>
  )
}
