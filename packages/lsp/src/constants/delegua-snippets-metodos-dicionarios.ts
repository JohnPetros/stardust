import type { LspSnippet } from '@stardust/core/global/types'

export const DELEGUA_SNIPPETS_METODOS_DICIONARIOS = [
  {
    label: 'chaves',
    code: 'chaves()',
  },
  {
    label: 'contem',
    code: 'contem(${1:})',
  },
  {
    label: 'contém',
    code: 'contém(${1:})',
  },
  {
    label: 'valores',
    code: 'valores()',
  },
] as const satisfies readonly LspSnippet[]
