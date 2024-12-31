'use client'

import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs'

export function useQueryArrayParam(key: string, defaultValues = []) {
  const parser = parseAsArrayOf(parseAsString, ',')
  return useQueryState(key, parser.withDefault(defaultValues))
}
