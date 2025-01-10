import type { DataTypeName } from '@stardust/core/challenging/types'

import { Input } from '@/ui/global/widgets/components/Input'
import { Select } from '@/ui/global/widgets/components/Select'
import { CodeInput } from '../../CodeInput'
import { DATA_TYPES } from '../data-types'
import { useDataTypeInput } from './useDataTypeInput'
import { AddItemButton } from '../AddItemButton'

type FunctionInputProps = {
  position: number
  defaultValue?: unknown
  onChange: (value: unknown) => void
}

export function DataTypeInput({ position, defaultValue, onChange }: FunctionInputProps) {
  const {
    dataType,
    handleSelectChange,
    handleStringValueChange,
    handleNumberValueChange,
    handleArrayItemChange,
    handleAddArrayItemClick,
  } = useDataTypeInput(onChange, defaultValue)

  return (
    <CodeInput label={`Parâmetro ${position}`}>
      <Input type='text' label='Nome do parâmetro' placeholder={`parametro${position}`} />
      <div className='flex gap-6'>
        <Select.Container<DataTypeName>
          defaultValue={dataType.name}
          onValueChange={handleSelectChange}
        >
          <Select.Trigger value='undefined' />
          <Select.Content>
            {DATA_TYPES.map((dataType) => (
              <Select.Item key={dataType.label} value={dataType.value}>
                <Select.Text>{dataType.label}</Select.Text>
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Container>

        {dataType.isString() && (
          <Input
            type='string'
            value={dataType.value}
            onChange={({ currentTarget }) => handleStringValueChange(currentTarget.value)}
          />
        )}
        {dataType.isNumber() && (
          <Input
            type='number'
            value={String(dataType.value)}
            onChange={({ currentTarget }) =>
              handleNumberValueChange(Number(currentTarget.value))
            }
          />
        )}
      </div>

      {dataType.isArray() && (
        <div>
          <span className='text-gray-500'>[</span>
          <ul className='space-y-3 pl-6'>
            {dataType.value.map((value, index) => {
              const position = index + 1
              return (
                <li key={String(position)}>
                  <DataTypeInput
                    position={position}
                    defaultValue={value}
                    onChange={(value) => handleArrayItemChange(value, index)}
                  />
                </li>
              )
            })}
            <li>
              <AddItemButton onClick={handleAddArrayItemClick}>
                Adicionar item
              </AddItemButton>
            </li>
          </ul>
          <span className='text-gray-500'>]</span>
        </div>
      )}
    </CodeInput>
  )
}
