import { parseAsInteger, useQueryState } from 'nuqs'

export function useQueryNumberParam<Value extends number = number>(
  key: string,
  defaultValue = 0,
) {
  const [value, setValue] = useQueryState(key, parseAsInteger.withDefault(defaultValue))
  return [value as Value, setValue] as const
}
