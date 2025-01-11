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
import { Checkbox } from '@/ui/global/widgets/components/Checkbox'

export function ChallengeTestCasesField() {
  const {
    testCases,
    formControl,
    expectedOutputDataType,
    testCasesErrors,
    handleAddTestCaseButtonClick,
    handleRemoveTestCaseButtonClick,
    handleExpectedOutputDataTypeNameChange,
  } = useChallengeTestCasesField()

  return (
    <ChallengeField
      title='Casos de teste'
      subtitle='São essencias para os usuários validarem suas respostas. Tenha pelo menos 3 testes de caso.'
      icon='test'
    >
      <ol className='space-y-6'>
        {testCases.map((testCase, index) => {
          const testCaseError = testCasesErrors ? testCasesErrors[index] : undefined
          return (
            <li key={testCase.id}>
              <CodeInput
                label={`Teste de caso ${index + 1}#`}
                onRemove={() => handleRemoveTestCaseButtonClick(index)}
              >
                <div>
                  <Label title='Entrada' />
                  <TestCaseInputs testCaseIndex={index} />
                </div>

                <Label title='Saída esperada' className='block mt-6'>
                  <Controller
                    control={formControl}
                    name={`testCases.${index}.expectedOutput`}
                    render={({ field: { value, onChange } }) => {
                      const dataType = DataType.create(
                        value !== undefined
                          ? value
                          : DEFAULT_VALUE_BY_DATA_TYPE_NAME[expectedOutputDataType],
                      )
                      return (
                        <div className='flex items-center gap-3 mt-3'>
                          <DataTypeNameSelect
                            value={expectedOutputDataType}
                            onChange={(dataType) =>
                              handleExpectedOutputDataTypeNameChange(dataType, index)
                            }
                          />
                          <DataTypeInput value={dataType} onChange={onChange} />
                        </div>
                      )
                    }}
                  />
                </Label>

                <Controller
                  control={formControl}
                  name={`testCases.${index}.isLocked`}
                  render={({ field: { value, onChange } }) => {
                    const id = `testCase.${index}.isLocked`
                    return (
                      <div className='flex items-center gap-3'>
                        <Checkbox id={id} isChecked={value} onChange={onChange} />
                        <Label htmlFor={id} title='É visível para os outros usuários?' />
                      </div>
                    )
                  }}
                />
              </CodeInput>
            </li>
          )
        })}
      </ol>
      <AddItemButton onClick={handleAddTestCaseButtonClick} className='mt-6'>
        Adicionar teste de caso {testCases.length === 0 && '(obrigatório)'}
      </AddItemButton>
    </ChallengeField>
  )
}
