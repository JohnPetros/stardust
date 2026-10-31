import { useMemo } from 'react'

import {
  DELEGUA_DOCUMENTACOES,
  DELEGUA_SNIPPETS,
  DeleguaProvedorLsp,
} from '@stardust/lsp'

export function useLsp() {
  return useMemo(() => {
    return {
      lspProvider: new DeleguaProvedorLsp(),
      documentations: [...DELEGUA_DOCUMENTACOES],
      snippets: [...DELEGUA_SNIPPETS],
    }
  }, [])
}
