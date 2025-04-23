'use client'

import * as Select from '@/ui/global/widgets/components/Select'
import { Input } from '@/ui/global/widgets/components/Input'
import { DataType } from '@stardust/core/challenging/structures'
import { useDataTypeInput } from './useDataTypeInput'
import { AddItemButton } from '../AddItemButton'
import { DataTypeNameSelect } from '../DataTypeNameSelect'
import { ErrorMessage } from '@/ui/global/widgets/components/ErrorMessage'
import { Icon } from '@/ui/global/widgets/components/Icon'

type FunctionInputProps = {
  value: DataType
  errorMessage?: string
  onChange: (value: unknown) => void
}

export function DataTypeInput({ value, errorMessage, onChange }: FunctionInputProps) {
  const {
    dataType,
    handleStringValueChange,
    handleNumberValueChange,
    handleBooleanValueChange,
    handleArrayItemChange,
    handleAddArrayItemClick,
    handleRemoveArrayItemClick,
    handleArrayItemDataTypeNameChange,
  } = useDataTypeInput(value, onChange)

  return (
    <div>
      <div className='flex gap-6'>
        {dataType.isString() && (
          <Input
            type='string'
            value={dataType.value}
            errorMessage={errorMessage}
            onChange={({ currentTarget }) => handleStringValueChange(currentTarget.value)}
          />
        )}
        {dataType.isNumber() && (
          <Input
            type='number'
            value={String(dataType.value)}
            errorMessage={errorMessage}
            onChange={({ currentTarget }) =>
              handleNumberValueChange(Number(currentTarget.value))
            }
          />
        )}
        {dataType.isBoolean() && (
          <Select.Container
            defaultValue={dataType.value === true ? 'true' : 'false'}
            errorMessage={errorMessage}
            onValueChange={(value) => handleBooleanValueChange(value === 'true')}
          >
            <Select.Trigger value={dataType.value === true ? 'verdadeiro' : 'falso'} />
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
              // console.log('itemDataType', itemDataType)
              return (
                <li key={String(index)}>
                  <button
                    type='button'
                    onClick={() => handleRemoveArrayItemClick(index)}
                    className='flex items-center gap-1 ml-auto text-xs text-gray-400'
                  >
                    <Icon name='close' size={12} />
                  </button>
                  <div className='flex items-center gap-3 mt-2'>
                    <p className='text-gray-100 text-sm'>item {index}:</p>
                    <DataTypeNameSelect
                      value={itemDataType.name}
                      onChange={(dataTypeName) =>
                        handleArrayItemDataTypeNameChange(dataTypeName, index)
                      }
                    />
                    <DataTypeInput
                      value={itemDataType}
                      onChange={(value) => handleArrayItemChange(value, index)}
                    />
                  </div>
                  {errorMessage && (
                    <ErrorMessage className='mt-1'>{errorMessage}</ErrorMessage>
                  )}
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
