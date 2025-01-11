import { useFieldArray, useFormContext } from 'react-hook-form'
import { useState } from 'react'

import type { ChallengeSchema } from '@stardust/validation/challenging/types'
import type { DataTypeName } from '@stardust/core/challenging/types'
import { DEFAULT_VALUE_BY_DATA_TYPE_NAME } from '@stardust/core/challenging/constants'

export function useChallengeTestCasesField() {
  const [expectedOutputDataType, setExpectedOutputDataType] =
    useState<DataTypeName>('string')
  const { control, formState, setValue } = useFormContext<ChallengeSchema>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'testCases',
  })

  function handleExpectedOutputDataTypeNameChange(
    dataTypeName: DataTypeName,
    testCaseIndex: number,
  ) {
    setExpectedOutputDataType(dataTypeName)
    console.log({ dataTypeName })
    setValue(
      `testCases.${testCaseIndex}.expectedOutput`,
      DEFAULT_VALUE_BY_DATA_TYPE_NAME[dataTypeName],
    )
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
    testCasesErrors: formState.errors.testCases,
    expectedOutputDataType,
    handleAddTestCaseButtonClick,
    handleRemoveTestCaseButtonClick,
    handleExpectedOutputDataTypeNameChange,
  }
}
