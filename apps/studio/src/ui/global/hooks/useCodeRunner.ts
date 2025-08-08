import { useMemo } from 'react'

import { ExecutorDeCodigoDelegua } from '@stardust/code-runner'

export function useCodeRunner() {
  return useMemo(() => new ExecutorDeCodigoDelegua(), [])
}
