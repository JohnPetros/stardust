import { Controller } from 'react-hook-form'
import { CodeInput } from '../../../CodeInput'
import { DataTypeInput } from '../../DataTypeInput'
import { useTestCaseInputs } from './useTestCaseParamsInput'
import { DataType } from '@stardust/core/challenging/structs'
import { ErrorMessage } from '@/ui/global/widgets/components/ErrorMessage'

type TestCaseInputsProps = {
  testCaseIndex: number
}

export function TestCaseInputs({ testCaseIndex }: TestCaseInputsProps) {
  const { formControl, functionParams, errorMessage, hasInputs } =
    useTestCaseInputs(testCaseIndex)

  return (
    <div>
      {!hasInputs && !errorMessage && (
        <p className='text-gray-100 text-lg text-center mt-6'>
          Defina os parâmetros da sua função primeiro
        </p>
      )}
      {errorMessage && (
        <ErrorMessage className='text-center mt-6'>{errorMessage}</ErrorMessage>
      )}

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
