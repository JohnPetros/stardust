import { useMemo } from 'react'

import { DELEGUA_DOCUMENTACOES, ExecutorDeCodigoDelegua } from '@stardust/code-runner'

export function useCodeRunner() {
  return useMemo(() => {
    return {
      codeRunnerProvider: new ExecutorDeCodigoDelegua(),
      documentations: DELEGUA_DOCUMENTACOES,
    }
  }, [])
}
