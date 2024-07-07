import { useForm } from 'react-hook-form'

import type { SignUpForm } from '../../types'
import { ValidationResolver } from '../validation'

export function useReactHookSignInForm() {
  const { resolveSignInForm } = ValidationResolver()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: resolveSignInForm(),
  })

  return {
    handleSubmit,
    register,
    errors,
  }
}
