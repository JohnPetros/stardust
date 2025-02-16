'use client'

import { parseAsString, useQueryState } from 'nuqs'

export function useQueryStringParam<Value extends string = string>(
  key: string,
  defaultValue = '',
) {
  const [value, setValue] = useQueryState(key, parseAsString.withDefault(defaultValue))
  return [value as Value, setValue] as const
}
