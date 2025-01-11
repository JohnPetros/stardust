import { useEffect } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'

import type { ChallengeSchema } from '@stardust/validation/challenging/types'
import { DEFAULT_VALUE_BY_DATA_TYPE_NAME } from '@stardust/core/challenging/constants'

export function useTestCaseInputs(testCaseIndex: number) {
  const { control, watch } = useFormContext<ChallengeSchema>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: `testCases.${testCaseIndex}.inputs`,
  })
  const functionParams = watch('function.params')

  useEffect(() => {
    if (functionParams) {
      remove()
      functionParams.forEach((param, index) => {
        const value =
          fields[index] !== undefined
            ? fields[index]
            : DEFAULT_VALUE_BY_DATA_TYPE_NAME[param.dataTypeName]

        append(value)
      })
    }
  }, [fields, functionParams, append, remove])

  return {
    formControl: control,
    functionParams,
    testCaseInputs: fields,
  }
}
