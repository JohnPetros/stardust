import type { ClassNameValue } from 'tailwind-merge'

import type { DataTypeName } from '@stardust/core/challenging/types'

import * as Select from '@/ui/global/widgets/components/Select'
import { DATA_TYPES } from '../data-types'
import { useDataTypeNameSelect } from './useDataTypeNameSelect'

type DataTypeNameSelectProps = {
  value: DataTypeName
  className?: ClassNameValue
  isDiabled?: boolean
  errorMessage?: string
  onChange?: (dataTypeName: DataTypeName) => void
}

export function DataTypeNameSelect({
  value,
  className,
  isDiabled = false,
  onChange,
}: DataTypeNameSelectProps) {
  const { label, handleChange } = useDataTypeNameSelect(value, onChange)

  return (
    <Select.Container<DataTypeName> onValueChange={handleChange}>
      <Select.Trigger className={className} value={label} isDiabled={isDiabled} />
      <Select.Content>
        {DATA_TYPES.map((dataType) => (
          <Select.Item key={dataType.label} value={dataType.value}>
            <Select.Text>{dataType.label}</Select.Text>
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Container>
  )
}
