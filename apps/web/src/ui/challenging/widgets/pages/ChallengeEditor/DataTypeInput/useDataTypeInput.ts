import { useEffect, useRef, useState } from 'react'

import type { DataTypeName } from '@stardust/core/challenging/types'
import type { DataType } from '@stardust/core/challenging/structures'
import { DEFAULT_VALUE_BY_DATA_TYPE_NAME } from '@stardust/core/challenging/constants'

function detectDataTypeName(value: unknown): DataTypeName {
  if (Array.isArray(value)) return 'array'
  if (value === null) return 'undefined'
  if (typeof value === 'string') return 'string'
  if (typeof value === 'number') return 'number'
  if (typeof value === 'boolean') return 'boolean'

  return 'undefined'
}

export function useDataTypeInput(
  selectedDataType: DataType,
  onChange: (value: unknown) => void,
) {
  const [dataType, setDataType] = useState<DataType>(selectedDataType)
  const lastArrayItemDataTypeNameRef = useRef<DataTypeName>('string')

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
    lastArrayItemDataTypeNameRef.current = dataTypeName
    const updatedDataType = dataType.changeArrayItem(
      DEFAULT_VALUE_BY_DATA_TYPE_NAME[dataTypeName],
      index,
    )
    setDataType(updatedDataType)
    onChange(updatedDataType.value)
  }

  function handleAddArrayItemClick() {
    const defaultValue =
      DEFAULT_VALUE_BY_DATA_TYPE_NAME[lastArrayItemDataTypeNameRef.current]
    const updatedDataType = dataType.addArrayItem(defaultValue)
    setDataType(updatedDataType)
    onChange(updatedDataType.value)
  }

  function handleRemoveArrayItemClick(itemIndex: number) {
    const updatedDataType = dataType.removeArrayItem(itemIndex)
    setDataType(updatedDataType)
    onChange(updatedDataType.value)
  }

  useEffect(() => {
    if (selectedDataType.isArray() && selectedDataType.value.length > 0) {
      const lastItem = selectedDataType.value[selectedDataType.value.length - 1]
      lastArrayItemDataTypeNameRef.current = detectDataTypeName(lastItem)
    } else if (!selectedDataType.isArray()) {
      lastArrayItemDataTypeNameRef.current = selectedDataType.name
    }

    setDataType(selectedDataType)
  }, [selectedDataType])

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
