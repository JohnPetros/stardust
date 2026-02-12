import { useRef } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'

import type { ChallengeSchema } from '@stardust/validation/challenging/types'
import type { DataTypeName } from '@stardust/core/challenging/types'
import { DEFAULT_VALUE_BY_DATA_TYPE_NAME } from '@stardust/core/challenging/constants'
import { DataType } from '@stardust/core/challenging/structures'

export function useChallengeTestCasesField() {
  const { control, formState, setValue } = useFormContext<ChallengeSchema>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'testCases',
  })
  const lastDataTypeNameRef = useRef<DataTypeName>('string')

  function handleExpectedOutputDataTypeNameChange(
    dataTypeName: DataTypeName,
    testCaseIndex: number,
  ) {
    lastDataTypeNameRef.current = dataTypeName
    const currentExpectedOutput = fields[testCaseIndex]?.expectedOutput
    if (currentExpectedOutput?.dataTypeName !== dataTypeName)
      setValue(
        `testCases.${testCaseIndex}.expectedOutput.value`,
        DEFAULT_VALUE_BY_DATA_TYPE_NAME[dataTypeName],
      )
    setValue(`testCases.${testCaseIndex}.expectedOutput.dataTypeName`, dataTypeName)
  }

  function handleAddTestCaseButtonClick() {
    const defaultValue = DEFAULT_VALUE_BY_DATA_TYPE_NAME[lastDataTypeNameRef.current]
    const dataType = DataType.create(defaultValue)
    append({
      inputs: [],
      expectedOutput: {
        value: dataType.value,
        dataTypeName: lastDataTypeNameRef.current,
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
