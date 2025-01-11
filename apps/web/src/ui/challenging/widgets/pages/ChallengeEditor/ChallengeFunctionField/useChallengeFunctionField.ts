import { useFieldArray, useFormContext } from 'react-hook-form'

import type { ChallengeSchema } from '@stardust/validation/challenging/types'

export function useChallengeFunctionField() {
  const { control, register } = useFormContext<ChallengeSchema>()
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

  return {
    formControl: control,
    params: fields,
    registerInput: register,
    handleAddParamButtonClick,
    handleRemoveParamButtonClick,
  }
}
