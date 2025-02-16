import { useFieldArray, useFormContext } from 'react-hook-form'
import { useEffect, useState } from 'react'

import type { ChallengeSchema } from '@stardust/validation/challenging/types'
import { DataType } from '@stardust/core/challenging/structs'
import { DEFAULT_VALUE_BY_DATA_TYPE_NAME } from '@stardust/core/challenging/constants'

type UseTestCaseInputsProps = {
  defaultValue: unknown
  testCaseIndex: number
  paramIndex: number
}

export function useTestCaseInput({
  defaultValue,
  testCaseIndex,
  paramIndex,
}: UseTestCaseInputsProps) {
  const [dataType, setDataType] = useState(
    typeof defaultValue !== 'undefined'
      ? DataType.create(defaultValue)
      : DataType.create(''),
  )
  const { control, watch } = useFormContext<ChallengeSchema>()
  const { update } = useFieldArray({
    control,
    name: `testCases.${testCaseIndex}.inputs`,
  })
  const paramDataTypeName = watch(`function.params.${paramIndex}.dataTypeName`)

  function handleChange(value: unknown) {
    update(paramIndex, { value })
    setDataType(dataType.changeValue(value))
  }

  useEffect(() => {
    const dataType = DataType.create(DEFAULT_VALUE_BY_DATA_TYPE_NAME[paramDataTypeName])
    setDataType(dataType)
    update(paramIndex, { value: dataType.value })
  }, [paramDataTypeName, paramIndex, update])

  useEffect(() => {
    if (!defaultValue) return

    setDataType(DataType.create(defaultValue))
  }, [])

  return {
    dataType,
    handleChange,
  }
}
