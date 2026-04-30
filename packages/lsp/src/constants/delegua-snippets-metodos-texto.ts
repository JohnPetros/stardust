import type { LspSnippet } from '@stardust/core/global/types'

export const DELEGUA_SNIPPETS_METODOS_TEXTO = [
  {
    label: 'aparar',
    code: 'aparar()',
  },
  {
    label: 'apararFim',
    code: 'apararFim()',
  },
  {
    label: 'apararInicio',
    code: 'apararInicio()',
  },
  {
    label: 'dividir',
    code: 'dividir(${1:})',
  },
  {
    label: 'maiusculo',
    code: 'maiusculo()',
  },
  {
    label: 'minusculo',
    code: 'minusculo()',
  },
  {
    label: 'substituir',
    code: 'substituir(${1:}, ${2:})',
  },
  {
    label: 'subtexto',
    code: 'subtexto(${1:}, ${2:})',
  },
] as const satisfies readonly LspSnippet[]
