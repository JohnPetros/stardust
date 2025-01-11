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
        {params.map((_, index) => {
          const position = index + 1
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
                  {...registerInput(`function.params.${index}.name`)}
                />
                <Controller
                  key={String(position)}
                  control={formControl}
                  name={`function.params.${index}.dataTypeName`}
                  render={({ field: { value, onChange } }) => {
                    return <DataTypeNameSelect defaultValue={value} onChange={onChange} />
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
