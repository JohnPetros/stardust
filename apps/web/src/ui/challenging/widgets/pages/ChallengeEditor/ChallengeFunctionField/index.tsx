import { Controller } from 'react-hook-form'

import { Input } from '@/ui/global/widgets/components/Input'
import { useChallengeFunctionField } from './useChallengeFunctionField'
import { ChallengeField } from '../ChallengeField'
import { AddItemButton } from '../AddItemButton'
import { CodeInput } from '../../CodeInput'
import { DataTypeNameSelect } from '../DataTypeNameSelect'

export function ChallengeFunctionField() {
  const {
    formControl,
    params,
    hasError,
    functionNameErrorMessage,
    functionParamsErrorMessages,
    registerInput,
    handleAddParamButtonClick,
    handleRemoveParamButtonClick,
  } = useChallengeFunctionField()

  

  return (
    <ChallengeField
      title='Função'
      icon='function'
      subtitle='É onde o usuário escreverá o código da solução'
      hasError={hasError}
    >
      <Input
        type='text'
        label='Nome da função'
        placeholder='Ex.: encontre3Corpos'
        errorMessage={functionNameErrorMessage}
        {...registerInput('function.name')}
      />
      <ol className='space-y-6 mt-6'>
        {params.map((_, index) => {
          const position = index + 1
          return (
            <li key={String(position)}>
              <CodeInput
                label={`Parâmetro ${position}`}
                onRemove={() => handleRemoveParamButtonClick(position)}
              >
                <div className='flex gap-3 items-center'>
                  <Input
                    type='text'
                    label='Nome do parâmetro'
                    placeholder={`parametro${position}`}
                    errorMessage={functionParamsErrorMessages[index]?.name?.message}
                    {...registerInput(`function.params.${index}.name`)}
                  />
                  <Controller
                    key={String(position)}
                    control={formControl}
                    name={`function.params.${index}.dataTypeName`}
                    render={({ field: { value, onChange } }) => {
                      return (
                        <DataTypeNameSelect
                          value={value}
                          onChange={onChange}
                          className='translate-y-[16px]'
                        />
                      )
                    }}
                  />
                </div>
              </CodeInput>
            </li>
          )
        })}
      </ol>
      <AddItemButton onClick={handleAddParamButtonClick} className='mt-6'>
        Adicionar parâmetro à função {params.length === 0 && '(obrigatório)'}
      </AddItemButton>
    </ChallengeField>
  )
}
