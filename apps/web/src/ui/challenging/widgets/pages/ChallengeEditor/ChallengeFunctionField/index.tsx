import { Controller } from 'react-hook-form'

import { Input } from '@/ui/global/widgets/components/Input'
import { useChallengeFunctionField } from './useChallengeFunctionField'
import { DataTypeInput } from '../DataTypeInput'
import { ChallengeField } from '../ChallengeField'
import { AddItemButton } from '../AddItemButton'
import { CodeInput } from '../../CodeInput'

export function ChallengeFunctionField() {
  const {
    formControl,
    params,
    registerInput,
    handleAddParamButtonClick,
    handleRemoveParamButtonClick,
  } = useChallengeFunctionField()

  return (
    <ChallengeField title='Função' icon='function'>
      <Input
        type='text'
        label='Nome da função'
        placeholder='encontre3Corpos'
        {...registerInput('function.name')}
      />
      <div className='space-y-6'>
        {params.map((_, number) => {
          const position = number + 1
          return (
            <div key={String(position)} className='space-y-3'>
              <button
                type='button'
                onClick={() => handleRemoveParamButtonClick(position)}
                className='ml-auto text-green-400'
              >
                Remover parâmetro
              </button>
              <CodeInput label={`Parâmetro ${position}`}>
                <Input
                  type='text'
                  label='Nome do parâmetro'
                  placeholder={`parametro${position}`}
                  {...registerInput(`function.params.${number}.name`)}
                />
                <Controller
                  key={String(position)}
                  control={formControl}
                  name={`function.params.${number}.value`}
                  render={({ field: { value, onChange } }) => {
                    return (
                      <DataTypeInput
                        position={position}
                        defaultValue={value}
                        onChange={onChange}
                      />
                    )
                  }}
                />
              </CodeInput>
              <AddItemButton onClick={handleAddParamButtonClick}>
                Adicionar parâmetro
              </AddItemButton>
            </div>
          )
        })}
      </div>
    </ChallengeField>
  )
}
