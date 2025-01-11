import type { DataTypeName } from '@stardust/core/challenging/types'

import * as Select from '@/ui/global/widgets/components/Select'
import { DATA_TYPES } from '../data-types'

type DataTypeNameSelectProps = {
  defaultValue?: DataTypeName
  onChange?: (dataTypeName: DataTypeName) => void
}

export function DataTypeNameSelect({ defaultValue, onChange }: DataTypeNameSelectProps) {
  return (
    <Select.Container<DataTypeName> defaultValue={defaultValue} onValueChange={onChange}>
      <Select.Trigger value='undefined' />
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
