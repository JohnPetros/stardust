import { useMemo } from 'react'

import { DeleguaLsp } from '@stardust/lsp'

export function useLsp() {
  return useMemo(() => new DeleguaLsp(), [])
}
