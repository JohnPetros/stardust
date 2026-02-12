import { useEffect, useMemo } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'

import type { ChallengeSchema } from '@stardust/validation/challenging/types'
import { DEFAULT_VALUE_BY_DATA_TYPE_NAME } from '@stardust/core/challenging/constants'

export function useTestCaseInputs(testCaseIndex: number) {
  const { control, formState, getValues } = useFormContext<ChallengeSchema>()
  const { fields, replace } = useFieldArray({
    control,
    name: `testCases.${testCaseIndex}.inputs`,
  })
  const functionParams = useWatch({
    control,
    name: 'function.params',
  })
  const functionParamsSignature = useMemo(() => {
    if (!functionParams) return ''

    return JSON.stringify(functionParams)
  }, [functionParams])

  useEffect(() => {
    if (!functionParams) return

    const currentInputs = getValues(`testCases.${testCaseIndex}.inputs`) ?? []

    replace(
      functionParams.map((param, index) => ({
        value:
          typeof currentInputs[index]?.value !== 'undefined'
            ? currentInputs[index].value
            : DEFAULT_VALUE_BY_DATA_TYPE_NAME[param.dataTypeName],
      })),
    )
  }, [functionParamsSignature, getValues, replace, testCaseIndex])

  const testCaseError = formState.errors.testCases
    ? formState.errors.testCases[testCaseIndex]
    : {}

  return {
    formControl: control,
    errorMessage: testCaseError?.message,
    testCaseInputs: fields,
  }
}
