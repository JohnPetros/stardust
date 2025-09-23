import { useMemo } from 'react'

import { DELEGUA_DOCUMENTACOES, DeleguaLsp } from '@stardust/lsp'

export function useLsp() {
  return useMemo(() => {
    return {
      lspProvider: new DeleguaLsp(),
      documentations: DELEGUA_DOCUMENTACOES,
    }
  }, [])
}
