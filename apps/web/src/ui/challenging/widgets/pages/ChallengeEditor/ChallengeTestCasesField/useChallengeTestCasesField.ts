import { useFieldArray, useFormContext } from 'react-hook-form'

import type { ChallengeSchema } from '@stardust/validation/challenging/types'
import type { DataTypeName } from '@stardust/core/challenging/types'
import { useState } from 'react'

export function useChallengeTestCasesField() {
  const [expectedOutputDataType, setExpectedOutputDataType] =
    useState<DataTypeName>('string')
  const { control, register } = useFormContext<ChallengeSchema>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'testCases',
  })

  function handleExpectedOutputDataTypeNameChange(dataTypeName: DataTypeName) {
    setExpectedOutputDataType(dataTypeName)
  }

  function handleAddTestCaseButtonClick() {
    append({
      inputs: [],
      expectedOutput: undefined,
      isLocked: false,
    })
  }

  function handleRemoveTestCaseButtonClick(index: number) {
    remove(index)
  }

  return {
    formControl: control,
    testCases: fields,
    expectedOutputDataType,
    registerInput: register,
    handleAddTestCaseButtonClick,
    handleRemoveTestCaseButtonClick,
    handleExpectedOutputDataTypeNameChange,
  }
}
