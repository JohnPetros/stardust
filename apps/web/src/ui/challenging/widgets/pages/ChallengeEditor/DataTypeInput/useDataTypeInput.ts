import { useEffect, useState } from 'react'

import type { DataTypeName } from '@stardust/core/challenging/types'
import type { DataType } from '@stardust/core/challenging/structs'
import { DEFAULT_VALUE_BY_DATA_TYPE_NAME } from '@stardust/core/challenging/constants'

export function useDataTypeInput(
  selectedDataType: DataType,
  onChange: (value: unknown) => void,
) {
  const [dataType, setDataType] = useState<DataType>(selectedDataType)

  function handleStringValueChange(value: string) {
    setDataType(dataType.changeValue(value))
    onChange(value)
  }

  function handleNumberValueChange(value: number) {
    setDataType(dataType.changeValue(value))
    onChange(value)
  }

  function handleBooleanValueChange(value: boolean) {
    setDataType(dataType.changeValue(value))
    onChange(value)
  }

  function handleArrayItemChange(item: unknown, index: number) {
    const updatedDataType = dataType.changeArrayItem(item, index)
    setDataType(updatedDataType)
    onChange(updatedDataType.value)
  }

  function handleArrayItemDataTypeNameChange(dataTypeName: DataTypeName, index: number) {
    const updatedDataType = dataType.changeArrayItem(
      DEFAULT_VALUE_BY_DATA_TYPE_NAME[dataTypeName],
      index,
    )
    setDataType(updatedDataType)
    onChange(updatedDataType.value)
  }

  function handleAddArrayItemClick() {
    setDataType(dataType.addArrayItem(undefined))
  }

  function handleRemoveArrayItemClick(itemIndex: number) {
    setDataType(dataType.removeArrayItem(itemIndex))
  }

  return {
    dataType,
    handleStringValueChange,
    handleNumberValueChange,
    handleBooleanValueChange,
    handleArrayItemChange,
    handleAddArrayItemClick,
    handleRemoveArrayItemClick,
    handleArrayItemDataTypeNameChange,
  }
}
