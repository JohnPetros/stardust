import { useFieldArray, useFormContext } from 'react-hook-form'

import type { ChallengeSchema } from '@stardust/validation/challenging/types'

export function useChallengeFunctionField() {
  const { control, formState, register } = useFormContext<ChallengeSchema>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'function.params',
  })

  function handleAddParamButtonClick() {
    append({ name: '', dataTypeName: 'string' })
  }

  function handleRemoveParamButtonClick(position: number) {
    remove(position - 1)
  }

  const functionNameErrorMessage = formState.errors.function?.name?.message
  const functionParamsErrorMessages = formState.errors.function?.params ?? []
  console.log('functionParamsErrorMessages', functionParamsErrorMessages)

  return {
    formControl: control,
    params: fields,
    functionNameErrorMessage,
    functionParamsErrorMessages,
    hasError:
      Boolean(functionNameErrorMessage) || Boolean(functionParamsErrorMessages?.length),
    registerInput: register,
    handleAddParamButtonClick,
    handleRemoveParamButtonClick,
  }
}
