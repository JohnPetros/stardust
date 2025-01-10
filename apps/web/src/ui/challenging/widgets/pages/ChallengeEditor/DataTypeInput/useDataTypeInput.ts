import { useState } from 'react'

import type { DataTypeName } from '@stardust/core/challenging/types'
import { DataType } from '@stardust/core/challenging/structs'

export function useDataTypeInput(
  onChange: (value: unknown) => void,
  defaultValue?: unknown,
) {
  const [dataType, setDataType] = useState<DataType>(DataType.create(defaultValue))

  function handleSelectChange(dataTypeName: DataTypeName) {
    switch (dataTypeName) {
      case 'true':
        return onChange(DataType.create(true))
      case 'false':
        return onChange(DataType.create(true))
      case 'string':
        setDataType(DataType.create(''))
        return
      case 'number':
        setDataType(DataType.create(0))
        return
    }
  }

  function handleStringValueChange(value: string) {
    setDataType(dataType.changeValue(value))
    onChange(value)
  }

  function handleNumberValueChange(value: number) {
    setDataType(dataType.changeValue(value))
    onChange(value)
  }

  function handleArrayItemChange(item: unknown, index: number) {
    const updatedDataType = dataType.changeArrayItem(item, index)
    setDataType(updatedDataType)
    onChange(updatedDataType.value)
  }

  function handleAddArrayItemClick() {
    setDataType(dataType.addArrayItem(undefined))
  }

  return {
    dataType,
    handleSelectChange,
    handleStringValueChange,
    handleNumberValueChange,
    handleArrayItemChange,
    handleAddArrayItemClick,
  }
}
