import { CodeInput } from '../../../../CodeInput'
import { DataTypeNameSelect } from '../../../DataTypeNameSelect'
import { DataTypeInput } from '../../../DataTypeInput'
import { useTestCaseInput } from './useTestCaseInput'

type TestCaseInputsProps = {
  defaultValue: unknown
  testCaseIndex: number
  paramIndex: number
}

export function TestCaseInput({
  defaultValue,
  testCaseIndex,
  paramIndex,
}: TestCaseInputsProps) {
  const { dataType, handleChange } = useTestCaseInput({
    defaultValue,
    testCaseIndex,
    paramIndex,
  })

  return (
    <CodeInput label={`${paramIndex + 1}º Parâmetro`}>
      <div className='flex items-center gap-3'>
        <DataTypeNameSelect value={dataType.name} isDiabled />
        <DataTypeInput value={dataType} onChange={handleChange} />
      </div>
    </CodeInput>
  )
}
