import { useMemo } from 'react'

import { DELEGUA_DOCUMENTACOES, DELEGUA_SNIPPETS, DeleguaLsp } from '@stardust/lsp'

export function useLsp() {
  return useMemo(() => {
    return {
      lspProvider: new DeleguaLsp(),
      documentations: DELEGUA_DOCUMENTACOES,
      snippets: DELEGUA_SNIPPETS,
    }
  }, [])
}
