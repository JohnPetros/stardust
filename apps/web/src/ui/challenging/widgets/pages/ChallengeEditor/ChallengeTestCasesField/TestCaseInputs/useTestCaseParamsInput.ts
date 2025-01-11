import { useEffect } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'

import type { ChallengeSchema } from '@stardust/validation/challenging/types'
import { DEFAULT_VALUE_BY_DATA_TYPE_NAME } from '@stardust/core/challenging/constants'

export function useTestCaseInputs(testCaseIndex: number) {
  const { control, formState, watch } = useFormContext<ChallengeSchema>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: `testCases.${testCaseIndex}.inputs`,
  })
  const functionParams = watch('function.params')

  useEffect(() => {
    // if (functionParams.length) {
    //   remove()
    //   functionParams.forEach((param, index) => {
    //     const value =
    //       fields[index]?.value !== undefined
    //         ? fields[index].value
    //         : DEFAULT_VALUE_BY_DATA_TYPE_NAME[param.dataTypeName]

    //     console.log({ value })
    //     append({ value })
    //   })
    // }
    console.log({ functionParams })
  }, [functionParams, append, remove])

  const testCaseError = formState.errors.testCases
    ? formState.errors.testCases[testCaseIndex]
    : {}

  return {
    formControl: control,
    functionParams,
    errorMessage: testCaseError?.message,
    hasInputs: fields.length > 0,
  }
}
