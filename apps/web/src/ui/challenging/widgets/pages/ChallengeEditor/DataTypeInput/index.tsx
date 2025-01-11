'use client'

import * as Select from '@/ui/global/widgets/components/Select'
import { Input } from '@/ui/global/widgets/components/Input'
import { DataType } from '@stardust/core/challenging/structs'
import { useDataTypeInput } from './useDataTypeInput'
import { AddItemButton } from '../AddItemButton'
import { DataTypeNameSelect } from '../DataTypeNameSelect'

type FunctionInputProps = {
  value: DataType
  onChange: (value: unknown) => void
}

export function DataTypeInput({ value, onChange }: FunctionInputProps) {
  const {
    dataType,
    handleStringValueChange,
    handleNumberValueChange,
    handleBooleanValueChange,
    handleArrayItemChange,
    handleAddArrayItemClick,
    handleArrayItemDataTypeNameChange,
  } = useDataTypeInput(onChange, value)

  return (
    <div>
      <div className='flex gap-6'>
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
        {dataType.isBoolean() && (
          <Select.Container
            defaultValue={dataType.value === true ? 'true' : 'false'}
            onValueChange={(value) => handleBooleanValueChange(value === 'true')}
          >
            <Select.Trigger value='true' />
            <Select.Content>
              <Select.Item value='true'>
                <Select.Text>Verdadeiro</Select.Text>
              </Select.Item>
              <Select.Item value='false'>
                <Select.Text>Falso</Select.Text>
              </Select.Item>
            </Select.Content>
          </Select.Container>
        )}
      </div>
      {dataType.isArray() && (
        <div>
          <span className='text-gray-500'>[</span>
          <ul className='space-y-3 pl-6'>
            {dataType.value.map((value, index) => {
              const itemDataType = DataType.create(value)
              return (
                <li key={String(index)}>
                  <DataTypeNameSelect
                    defaultValue={itemDataType.name}
                    onChange={(dataTypeName) =>
                      handleArrayItemDataTypeNameChange(dataTypeName, index)
                    }
                  />
                  <DataTypeInput
                    value={itemDataType}
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
    </div>
  )
}
