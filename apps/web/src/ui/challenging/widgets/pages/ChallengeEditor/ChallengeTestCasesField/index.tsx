import { Controller } from 'react-hook-form'
import { ChallengeField } from '../ChallengeField'
import { DataTypeInput } from '../DataTypeInput'
import { useChallengeTestCasesField } from './useChallengeTestCasesField'
import { CodeInput } from '../../CodeInput'
import { Label } from '@/ui/global/widgets/components/Label'
import { AddItemButton } from '../AddItemButton'
import { DataTypeNameSelect } from '../DataTypeNameSelect'
import { DataType } from '@stardust/core/challenging/structs'
import { TestCaseInputs } from './TestCaseInputs'
import { DEFAULT_VALUE_BY_DATA_TYPE_NAME } from '@stardust/core/challenging/constants'

export function ChallengeTestCasesField() {
  const {
    testCases,
    formControl,
    expectedOutputDataType,
    handleAddTestCaseButtonClick,
    handleRemoveTestCaseButtonClick,
    handleExpectedOutputDataTypeNameChange,
  } = useChallengeTestCasesField()

  return (
    <ChallengeField
      title='Função'
      subtitle='Testes de caso são essencias para os usuários validarem suas respostas. Tenha pelo menos 3 testes de caso.'
      icon='function'
    >
      {testCases.map((testCase, index) => {
        return (
          <div key={testCase.id} className=''>
            <button
              type='button'
              onClick={() => handleRemoveTestCaseButtonClick(index)}
              className='ml-auto text-green-400'
            >
              Remover teste de caso
            </button>
            <CodeInput label={`Teste de caso ${index + 1}#`}>
              <Label title='Entrada' />
              <TestCaseInputs testCaseIndex={index} />

              <Label title='Saída esperada'>
                <div className='space-x-3'>
                  <DataTypeNameSelect
                    defaultValue={expectedOutputDataType}
                    onChange={handleExpectedOutputDataTypeNameChange}
                  />
                  <Controller
                    control={formControl}
                    name={`testCases.${index}.expectedOutput`}
                    render={({ field: { value, onChange } }) => {
                      const dataType = DataType.create(
                        value !== undefined
                          ? value
                          : DEFAULT_VALUE_BY_DATA_TYPE_NAME[expectedOutputDataType],
                      )
                      return <DataTypeInput value={dataType} onChange={onChange} />
                    }}
                  />
                </div>
              </Label>
            </CodeInput>
          </div>
        )
      })}
      <AddItemButton onClick={handleAddTestCaseButtonClick}>
        Adicionar teste de caso
      </AddItemButton>
    </ChallengeField>
  )
}
