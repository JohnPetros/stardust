import { Controller } from 'react-hook-form'
import { Input } from '@/ui/global/widgets/components/Input'
import { CodeInput } from '../../../CodeInput'
import { DataTypeInput } from '../../DataTypeInput'
import { AddItemButton } from '../../AddItemButton'
import { useTestCaseInputs } from './useTestCaseParamsInput'
import { DataType } from '@stardust/core/challenging/structs'

type TestCaseInputsProps = {
  testCaseIndex: number
}

export function TestCaseInputs({ testCaseIndex }: TestCaseInputsProps) {
  const { formControl, functionParams } = useTestCaseInputs(testCaseIndex)

  return (
    <div>
      {functionParams.map((param, index) => {
        return (
          <div key={param.name} className='space-y-3 w-full'>
            <CodeInput key={String(`param.${index}`)} label={`${index + 1}º Parâmetro`}>
              <Controller
                control={formControl}
                name={`testCases.${testCaseIndex}.inputs.${index}`}
                render={({ field: { value, onChange } }) => {
                  const dataType = DataType.create(value)
                  return <DataTypeInput value={dataType} onChange={onChange} />
                }}
              />
            </CodeInput>
          </div>
        )
      })}
    </div>
  )
}
