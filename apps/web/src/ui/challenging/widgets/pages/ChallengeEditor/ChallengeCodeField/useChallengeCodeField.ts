import { useFormContext } from 'react-hook-form'
import { useEffect } from 'react'

import type { ChallengeSchema } from '@stardust/validation/challenging/types'

export function useChallengeCodeField() {
  const { control, formState, watch, register, setValue } =
    useFormContext<ChallengeSchema>()
  const challengeFunctionName = watch('function.name')
  const challengeFunctionParams = watch('function.params')

  useEffect(() => {
    if (challengeFunctionName && challengeFunctionParams) {
      const functionParamsNames = challengeFunctionParams.map((param) => param.name)
      setValue(
        'code',
        `funcao ${challengeFunctionName}(${functionParamsNames.join(', ')}) {
      
}`,
      )
    }
  }, [challengeFunctionName, challengeFunctionParams, setValue])

  return {
    formControl: control,
    errorMessage: formState.errors.code?.message,
    registerInput: register,
  }
}
