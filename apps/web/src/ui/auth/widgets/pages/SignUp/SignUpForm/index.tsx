'use client'

import type { ProfileService } from '@stardust/core/profile/interfaces'

import { useSignUpForm } from './useSignUpForm'
import { SignUpFormView } from './SignUpFormView'

type Props = {
  isSubmitting: boolean
  profileService: ProfileService
  onSubmit: (email: string, password: string, name: string) => Promise<void>
}

export const SignUpForm = ({ profileService, isSubmitting, onSubmit }: Props) => {
  const { errors, isNameValid, isEmailValid, isPasswordValid, register, handleSubmit } =
    useSignUpForm(profileService, onSubmit)

  return (
    <SignUpFormView
      errors={errors}
      isNameValid={isNameValid}
      isEmailValid={isEmailValid}
      isPasswordValid={isPasswordValid}
      isSubmitting={isSubmitting}
      register={register}
      handleSubmit={handleSubmit}
    />
  )
}
