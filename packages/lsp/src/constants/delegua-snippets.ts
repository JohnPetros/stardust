import type { LspSnippet } from '@stardust/core/global/types'

import { DELEGUA_SNIPPETS_METODOS_DICIONARIOS } from './delegua-snippets-metodos-dicionarios'
import { DELEGUA_SNIPPETS_METODOS_LISTA } from './delegua-snippets-metodos-lista'
import { DELEGUA_SNIPPETS_METODOS_GLOBAIS } from './delegua-snippets-metodos-globais'
import { DELEGUA_SNIPPETS_METODOS_TEXTO } from './delegua-snippets-metodos-texto'

export const DELEGUA_SNIPPETS: LspSnippet[] = [
  ...DELEGUA_SNIPPETS_METODOS_LISTA,
  ...DELEGUA_SNIPPETS_METODOS_DICIONARIOS,
  ...DELEGUA_SNIPPETS_METODOS_GLOBAIS,
  ...DELEGUA_SNIPPETS_METODOS_TEXTO,
]