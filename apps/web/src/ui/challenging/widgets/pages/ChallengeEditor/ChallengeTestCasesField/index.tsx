import { Controller } from 'react-hook-form'

import { DataType } from '@stardust/core/challenging/structures'

import { Label } from '@/ui/global/widgets/components/Label'
import { Checkbox } from '@/ui/global/widgets/components/Checkbox'
import { ErrorMessage } from '@/ui/global/widgets/components/ErrorMessage'
import { ChallengeField } from '../ChallengeField'
import { DataTypeInput } from '../DataTypeInput'
import { CodeInput } from '../../CodeInput'
import { AddItemButton } from '../AddItemButton'
import { DataTypeNameSelect } from '../DataTypeNameSelect'
import { TestCaseInputs } from './TestCaseInputs'
import { useChallengeTestCasesField } from './useChallengeTestCasesField'

export function ChallengeTestCasesField() {
  const {
    testCases,
    formControl,
    testCasesErrors,
    handleAddTestCaseButtonClick,
    handleRemoveTestCaseButtonClick,
    handleExpectedOutputDataTypeNameChange,
  } = useChallengeTestCasesField()

  return (
    <ChallengeField
      title='Casos de teste'
      subtitle='São essencias para os usuários validarem suas respostas. Tenha pelo menos 3 casos de teste.'
      icon='test'
      hasError={Boolean(testCasesErrors?.message)}
    >
      <ol className='space-y-6'>
        {testCases.map((testCase, index) => {
          return (
            <li key={testCase.id}>
              <CodeInput
                label={`Teste de caso #${index + 1}`}
                onRemove={() => handleRemoveTestCaseButtonClick(index)}
              >
                <div>
                  <Label title='Entrada' />
                  <TestCaseInputs testCaseIndex={index} />
                </div>

                <Label title='Saída esperada' className='block mt-6'>
                  <div className='flex items-center gap-3 mt-3'>
                    <Controller
                      control={formControl}
                      name={`testCases.${index}.expectedOutput.dataTypeName`}
                      render={({ field: { value } }) => {
                        return (
                          <DataTypeNameSelect
                            value={value}
                            onChange={(dataType) =>
                              handleExpectedOutputDataTypeNameChange(dataType, index)
                            }
                          />
                        )
                      }}
                    />
                    <Controller
                      control={formControl}
                      name={`testCases.${index}.expectedOutput.value`}
                      render={({ field: { value, onChange } }) => {
                        const dataType = DataType.create(value)
                        return <DataTypeInput value={dataType} onChange={onChange} />
                      }}
                    />
                  </div>
                </Label>

                <Controller
                  control={formControl}
                  name={`testCases.${index}.isLocked`}
                  render={({ field: { value, onChange } }) => {
                    const id = `testCase.${index}.isLocked`
                    return (
                      <div className='flex items-center gap-3'>
                        <Checkbox
                          id={id}
                          isChecked={!value}
                          onChange={(value) => onChange(!value)}
                        />
                        <Label htmlFor={id} title='É visível para os usuários?' />
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
      {testCasesErrors?.root?.message && (
        <ErrorMessage className='mt-3'>{testCasesErrors?.root?.message}</ErrorMessage>
      )}
    </ChallengeField>
  )
}
