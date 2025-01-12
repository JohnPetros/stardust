import { Controller, useFieldArray, useFormContext } from 'react-hook-form'

import type { ChallengeSchema } from '@stardust/validation/challenging/types'
import { DataType } from '@stardust/core/challenging/structs'

import { CodeInput } from '../../../../CodeInput'
import { DataTypeNameSelect } from '../../../DataTypeNameSelect'
import { DataTypeInput } from '../../../DataTypeInput'
import { DEFAULT_VALUE_BY_DATA_TYPE_NAME } from '@stardust/core/challenging/constants'
import { useEffect, useState } from 'react'

type TestCaseInputsProps = {
  testCaseIndex: number
  paramIndex: number
}

export function TestCaseInput({ testCaseIndex, paramIndex }: TestCaseInputsProps) {
  const [dataType, setDataType] = useState(DataType.create(''))
  const { control, watch, setValue } = useFormContext<ChallengeSchema>()
  const { fields } = useFieldArray({
    control,
    name: `testCases.${testCaseIndex}.inputs`,
  })
  const functionParam = watch(`function.params.${paramIndex}.dataTypeName`)

  function handleChange(value: unknown) {
    if (!fields[paramIndex]) return
    fields[paramIndex].value = value
    setValue(`testCases.${testCaseIndex}.inputs`, fields)
    setDataType(dataType.changeValue(value))
  }

  useEffect(() => {
    setDataType(DataType.create(DEFAULT_VALUE_BY_DATA_TYPE_NAME[functionParam]))
  }, [functionParam])

  return (
    <CodeInput label={`${paramIndex + 1}º Parâmetro`}>
      <Controller
        control={control}
        name={`testCases.${testCaseIndex}.inputs.${paramIndex}.value`}
        render={({ field: { value, onChange } }) => {
          return (
            <div className='flex items-center gap-3'>
              <DataTypeNameSelect value={dataType.name} isDiabled={true} />
              <DataTypeInput value={dataType} onChange={handleChange} />
            </div>
          )
        }}
      />
    </CodeInput>
  )
}
