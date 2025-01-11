import { useFormContext } from 'react-hook-form'
import { useEffect } from 'react'

import type { ChallengeSchema } from '@stardust/validation/challenging/types'

export function useChallengeCodeField() {
  const { control, formState, watch, register, setValue } =
    useFormContext<ChallengeSchema>()
  const challengeFunction = watch('function')

  useEffect(() => {
    if (challengeFunction.name && challengeFunction.params.length) {
      const functionParamsNames = challengeFunction.params.map((param) => param.name)
      setValue(
        'code',
        `funcao ${challengeFunction.name}(${functionParamsNames.join(', ')}) {
      
      }`,
      )
    }
  }, [challengeFunction, setValue])

  return {
    formControl: control,
    errorMessage: formState.errors.code?.message,
    registerInput: register,
  }
}
