import { DELEGUA_DOCUMENTACOES_METODOS_DICIONARIOS } from './delegua-documentacoes-metodos-dicionarios'
import { DELEGUA_DOCUMENTACOES_METODOS_GLOBAIS } from './delegua-documentacoes-metodos-globais'
import { DELEGUA_DOCUMENTACOES_METODOS_TEXTO } from './delegua-documentacoes-metodos-texto'
import { DELEGUA_DOCUMENTACOES_METODOS_VETOR } from './delegua-documentacoes-metodos-vetor'

export const DELEGUA_DOCUMENTACOES = [
  ...DELEGUA_DOCUMENTACOES_METODOS_GLOBAIS,
  ...DELEGUA_DOCUMENTACOES_METODOS_TEXTO,
  ...DELEGUA_DOCUMENTACOES_METODOS_VETOR,
  ...DELEGUA_DOCUMENTACOES_METODOS_DICIONARIOS,
]
