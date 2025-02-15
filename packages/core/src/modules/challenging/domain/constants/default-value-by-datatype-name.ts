import type { DataTypeName } from '#challenging/types'

export const DEFAULT_VALUE_BY_DATA_TYPE_NAME: Record<DataTypeName, unknown> = {
  boolean: true,
  string: '',
  number: 0,
  array: [],
  undefined: undefined,
} as const
