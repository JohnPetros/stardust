import { useFormContext } from 'react-hook-form'
import { useEffect } from 'react'

import type { ChallengeSchema } from '@stardust/validation/challenging/types'

export function useChallengeCodeField() {
  const { control, formState, watch, register, setValue } =
    useFormContext<ChallengeSchema>()

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (!name?.includes('function') || !value.function?.params?.length) return
      const functionName = value.function.name
      const functionParamsNames = value.function.params.map((param) => param?.name)
      setValue(
        'code',
        `funcao ${functionName}(${functionParamsNames.join(', ')}) {

}`,
      )
    })
    return () => subscription.unsubscribe()
  }, [watch, setValue])

  return {
    formControl: control,
    errorMessage: formState.errors.code?.message,
    registerInput: register,
  }
}
