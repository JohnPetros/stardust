import { useEffect, useState } from 'react'
import { DATA_TYPES } from '../data-types'
import type { DataTypeName } from '@stardust/core/challenging/types'

export function useDataTypeNameSelect(
  selectedDataTypeName: DataTypeName,
  onChange?: (dataTypeName: DataTypeName) => void,
) {
  const [label, setLabel] = useState('')

  function handleChange(selectedDataTypeName: DataTypeName) {
    const selectedDataType = DATA_TYPES.find(
      ({ value }) => value === selectedDataTypeName,
    )
    if (!selectedDataType) return
    setLabel(selectedDataType.label)
    if (onChange) onChange(selectedDataType.value)
  }

  useEffect(() => {
    const selectedDataType = DATA_TYPES.find(
      ({ value }) => value === selectedDataTypeName,
    )
    if (!selectedDataType) return
    setLabel(selectedDataType.label)
    if (onChange) onChange(selectedDataType.value)
  }, [selectedDataTypeName])

  return {
    label,
    handleChange,
  }
}
