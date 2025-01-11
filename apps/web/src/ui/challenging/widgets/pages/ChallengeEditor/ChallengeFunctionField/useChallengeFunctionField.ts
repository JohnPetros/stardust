import { useFieldArray, useFormContext } from 'react-hook-form'

import type { ChallengeSchema } from '@stardust/validation/challenging/types'

export function useChallengeFunctionField() {
  const { control, formState, register } = useFormContext<ChallengeSchema>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'function.params',
  })

  function handleAddParamButtonClick() {
    append({ name: '', dataTypeName: 'undefined' })
  }

  function handleRemoveParamButtonClick(position: number) {
    remove(position - 1)
  }

  const functionNameErrorMessage = formState.errors.function?.name?.message
  const functionParamsErrorMessage = formState.errors.function?.params?.message

  return {
    formControl: control,
    params: fields,
    functionNameErrorMessage,
    functionParamsErrorMessage,
    hasError: Boolean(functionNameErrorMessage) || Boolean(functionParamsErrorMessage),
    registerInput: register,
    handleAddParamButtonClick,
    handleRemoveParamButtonClick,
  }
}
