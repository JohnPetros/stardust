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

  console.log({ fields })

  useEffect(() => {
    if (functionParams.length) {
      remove()
      alert('oiiii')
      functionParams.forEach((param, index) => {
        append({ value: '' })
      })
    }
  }, [functionParams, append, remove])

  const testCaseError = formState.errors.testCases
    ? formState.errors.testCases[testCaseIndex]
    : {}

  return {
    formControl: control,
    functionParams,
    errorMessage: testCaseError?.message,
    testCaseInputs: fields,
  }
}
