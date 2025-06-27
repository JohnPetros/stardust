import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import {
  emailSchema,
  nameSchema,
  passwordSchema,
} from '@stardust/validation/global/schemas'

import type { ProfileService } from '@stardust/core/profile/interfaces'
import { Email, Name } from '@stardust/core/global/structures'

const signUpFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
})

type SignUpFormFields = z.infer<typeof signUpFormSchema>

export function useSignUpForm(
  profileService: ProfileService,
  onFormSubmit: (email: string, password: string, name: string) => Promise<void>,
) {
  const {
    watch,
    register,
    handleSubmit,
    getFieldState,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormFields>({
    mode: 'onChange',
    resolver: zodResolver(signUpFormSchema),
  })
  const nameFieldWatch = watch('name')
  const emailFieldWatch = watch('email')
  const passwordFieldWatch = watch('password')

  async function handleFormSubmit(fields: SignUpFormFields) {
    await onFormSubmit(fields.email, fields.password, fields.name)
  }

  const checkUserAlreadyExistsByName = useCallback(async () => {
    try {
      const response = await profileService.verifyUserNameInUse(
        Name.create(nameFieldWatch),
      )
      if (response.isFailure) {
        setError('name', { message: 'Nome já utilizado por outro usuário' })
      }
    } catch (error) {}
  }, [nameFieldWatch, profileService.verifyUserNameInUse, setError])

  const checkUserAlreadyExistsByEmail = useCallback(async () => {
    try {
      const response = await profileService.verifyUserEmailInUse(
        Email.create(emailFieldWatch),
      )

      if (response.isFailure) {
        setError('email', { message: 'E-mail já utilizado por outro usuário' })
        return false
      }
    } catch (error) {}
  }, [emailFieldWatch, profileService.verifyUserEmailInUse, setError])

  function checkFieldIsValid(fieldName: keyof SignUpFormFields) {
    const nameFieldState = getFieldState(fieldName)
    return !nameFieldState.invalid
  }

  const isNameValid = Boolean(nameFieldWatch) && checkFieldIsValid('name')
  const isEmailValid =
    isNameValid && Boolean(emailFieldWatch) && checkFieldIsValid('email')
  const isPasswordValid =
    isEmailValid && Boolean(passwordFieldWatch) && checkFieldIsValid('password')

  useEffect(() => {
    if (isNameValid) checkUserAlreadyExistsByName()
    if (isEmailValid) checkUserAlreadyExistsByEmail()
  }, [
    isNameValid,
    isEmailValid,
    checkUserAlreadyExistsByName,
    checkUserAlreadyExistsByEmail,
  ])

  return {
    isSubmitting,
    errors,
    isNameValid,
    isEmailValid,
    isPasswordValid,
    register,
    handleSubmit: handleSubmit(handleFormSubmit),
  }
}
