import { useState } from 'react'
import { DATA_TYPES } from '../data-types'
import type { DataTypeName } from '@stardust/core/challenging/types'

export function useDataTypeNameSelect(
  defaultValue: DataTypeName,
  onChange: (dataTypeName: DataTypeName) => void,
) {
  const [label, setLabel] = useState(() => {
    return getDataType(defaultValue)?.label ?? 'texto'
  })

  function getDataType(dataTypeName: DataTypeName) {
    return DATA_TYPES.find(({ value }) => value === dataTypeName)
  }

  function handleChange(selectedDataTypeName: DataTypeName) {
    const selectedDataType = getDataType(selectedDataTypeName)
    if (!selectedDataType) return
    console.log('oi', selectedDataType)
    setLabel(selectedDataType.label)
    onChange(selectedDataType.value)
  }

  return {
    label,
    handleChange,
  }
}
