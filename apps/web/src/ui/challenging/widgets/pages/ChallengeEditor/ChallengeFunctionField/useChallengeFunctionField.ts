import { useFieldArray, useFormContext } from 'react-hook-form'

import type { ChallengeEditorFields } from '../useChallengeEditorPage'

export function useChallengeFunctionField() {
  const { control, register } = useFormContext<ChallengeEditorFields>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'function.params',
  })

  function handleAddParamButtonClick() {
    append({ name: '', value: undefined })
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
