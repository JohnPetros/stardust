import { useTestCaseInputs } from './useTestCaseParamsInput'
import { ErrorMessage } from '@/ui/global/widgets/components/ErrorMessage'
import { TestCaseInput } from './TestCaseInput'

type TestCaseInputsProps = {
  testCaseIndex: number
}

export function TestCaseInputs({ testCaseIndex }: TestCaseInputsProps) {
  const { testCaseInputs, errorMessage } = useTestCaseInputs(testCaseIndex)

  return (
    <div>
      {!testCaseInputs.length && !errorMessage && (
        <p className='text-gray-100 text-sm mt-6'>
          Defina os parâmetros da sua função primeiro
        </p>
      )}
      {errorMessage && (
        <ErrorMessage className='text-center mt-6'>{errorMessage}</ErrorMessage>
      )}

      <ol className='space-y-6 mt-3'>
        {testCaseInputs.map((input, index) => {
          return (
            <li key={String(index)} className='space-y-3 w-full'>
              <TestCaseInput
                defaultValue={input.value}
                testCaseIndex={testCaseIndex}
                paramIndex={index}
              />
            </li>
          )
        })}
      </ol>
    </div>
  )
}
