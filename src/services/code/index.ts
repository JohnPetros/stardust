import { useMemo } from 'react'

import { useDelegua } from './delegua'

export function useCode() {
  const delegua = useDelegua()

  return useMemo(() => delegua, [delegua])
}
