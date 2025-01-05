'use client'

import { parseAsString, useQueryState } from 'nuqs'

export function useQueryStringParam(key: string, defaultValue = '') {
  return useQueryState(key, parseAsString.withDefault(defaultValue))
}
