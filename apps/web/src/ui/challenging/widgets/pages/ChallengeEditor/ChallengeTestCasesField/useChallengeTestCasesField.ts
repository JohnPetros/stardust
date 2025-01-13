import { useFieldArray, useFormContext } from 'react-hook-form'
import { useState } from 'react'

import type { ChallengeSchema } from '@stardust/validation/challenging/types'
import type { DataTypeName } from '@stardust/core/challenging/types'
import { DEFAULT_VALUE_BY_DATA_TYPE_NAME } from '@stardust/core/challenging/constants'
import { DataType } from '@stardust/core/challenging/structs'

export function useChallengeTestCasesField() {
  const { control, formState, setValue } = useFormContext<ChallengeSchema>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'testCases',
  })

  function handleExpectedOutputDataTypeNameChange(
    dataTypeName: DataTypeName,
    testCaseIndex: number,
  ) {
    setValue(`testCases.${testCaseIndex}.expectedOutput.dataTypeName`, dataTypeName)
    setValue(
      `testCases.${testCaseIndex}.expectedOutput.value`,
      DEFAULT_VALUE_BY_DATA_TYPE_NAME[dataTypeName],
    )
  }

  function handleAddTestCaseButtonClick() {
    const dataType = DataType.create('')
    append({
      inputs: [],
      expectedOutput: {
        value: dataType.value,
        dataTypeName: dataType.name,
      },
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
    handleAddTestCaseButtonClick,
    handleRemoveTestCaseButtonClick,
    handleExpectedOutputDataTypeNameChange,
  }
}
