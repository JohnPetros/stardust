import type { DataTypeName } from '@stardust/core/challenging/types'

type DataTypes = Array<{
  value: DataTypeName
  label: string
}>

export const DATA_TYPES: DataTypes = [
  {
    value: 'undefined',
    label: 'Tipo de dado',
  },
  {
    value: 'string',
    label: 'texto',
  },
  {
    value: 'number',
    label: 'número',
  },
  {
    value: 'true',
    label: 'verdadeiro',
  },
  {
    value: 'false',
    label: 'falso',
  },
  {
    value: 'array',
    label: 'lista',
  },
] as const
