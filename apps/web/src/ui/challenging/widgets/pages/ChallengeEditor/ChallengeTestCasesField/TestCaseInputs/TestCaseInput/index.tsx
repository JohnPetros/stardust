import { Controller, useFormContext } from 'react-hook-form'

import type { ChallengeSchema } from '@stardust/validation/challenging/types'
import { DataType } from '@stardust/core/challenging/structs'

import { CodeInput } from '../../../../CodeInput'
import { DataTypeNameSelect } from '../../../DataTypeNameSelect'
import { DataTypeInput } from '../../../DataTypeInput'
import { DEFAULT_VALUE_BY_DATA_TYPE_NAME } from '@stardust/core/challenging/constants'

type TestCaseInputsProps = {
  testCaseIndex: number
  paramIndex: number
}

export function TestCaseInput({ testCaseIndex, paramIndex }: TestCaseInputsProps) {
  const { control, watch } = useFormContext<ChallengeSchema>()
  const functionParam = watch(`function.params.${paramIndex}`)

  return (
    <CodeInput label={`${paramIndex + 1}º Parâmetro`}>
      <Controller
        control={control}
        name={`testCases.${testCaseIndex}.inputs.${paramIndex}.value`}
        render={({ field: { value, onChange } }) => {
          const dataType = DataType.create(
            value !== undefined
              ? value
              : DEFAULT_VALUE_BY_DATA_TYPE_NAME[functionParam.dataTypeName],
          )
          return (
            <div className='flex items-center gap-3'>
              <DataTypeNameSelect value={dataType.name} isDiabled={true} />
              <DataTypeInput value={dataType} onChange={onChange} />
            </div>
          )
        }}
      />
    </CodeInput>
  )
}
