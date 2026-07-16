export const DELEGUA_IDENTIFICADOR = '[A-Za-zÀ-ÿ_*][A-Za-zÀ-ÿ0-9_*]*'

export const LABELS_DE_PALAVRAS_CHAVE = new Set(['var', 'const'])

export const LABELS_DE_LITERAIS = new Set(['verdadeiro', 'falso', 'nulo'])

export const LABELS_DE_CONTROLE_DE_FLUXO = new Set([
  'retorna',
  'sustar',
  'continua',
  'falhar',
])

export const LABELS_DE_SNIPPETS_ESTRUTURAIS = new Set([
  'funcao',
  'função',
  'se',
  'senao',
  'senão',
  'senao se',
  'senão se',
  'se ternário',
  'escolha',
  'enquanto',
  'fazer enquanto',
  'para',
  'para cada',
  'tente pegue',
  'classe',
])
