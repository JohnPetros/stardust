import { useForm } from 'react-hook-form'

import type { SignUpForm } from '../../types'
import { ValidationResolver } from '../validation'

export function useReactHookSignUpForm() {
  const { resolveSignUpForm } = ValidationResolver()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: resolveSignUpForm(),
  })

  return {
    handleSubmit,
    register,
    errors,
  }
}
