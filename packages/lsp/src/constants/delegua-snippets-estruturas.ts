import type { LspSnippet } from '@stardust/core/global/types'

export const DELEGUA_SNIPPETS_ESTRUTURAS = [
  {
    label: 'var',
    code: 'var ${1:nome} = ${2:valor}',
  },
  {
    label: 'const',
    code: 'const ${1:nome} = ${2:valor}',
  },
  {
    label: 'funcao',
    code: 'funcao ${1:nome}(${2:parametros}) {\n\t${3:}\n}',
  },
  {
    label: 'função',
    code: 'função ${1:nome}(${2:parametros}) {\n\t${3:}\n}',
  },
  {
    label: 'retorna',
    code: 'retorna ${1:valor}',
  },
  {
    label: 'se',
    code: 'se (${1:condicao}) {\n\t${2:}\n}',
  },
  {
    label: 'senao',
    code: 'senao {\n\t${1:}\n}',
  },
  {
    label: 'senão',
    code: 'senão {\n\t${1:}\n}',
  },
  {
    label: 'senao se',
    code: 'senao se (${1:condicao}) {\n\t${2:}\n}',
  },
  {
    label: 'senão se',
    code: 'senão se (${1:condicao}) {\n\t${2:}\n}',
  },
  {
    label: 'se ternário',
    code: '${1:condicao} ? ${2:valorSeVerdadeiro} : ${3:valorSeFalso}',
  },
  {
    label: 'escolha',
    code: 'escolha (${1:valor}) {\n\tcaso ${2:opcao}:\n\t\t${3:}\n\tpadrao:\n\t\t${4:}\n}',
  },
  {
    label: 'enquanto',
    code: 'enquanto (${1:condicao}) {\n\t${2:}\n}',
  },
  {
    label: 'fazer enquanto',
    code: 'fazer {\n\t${1:}\n} enquanto (${2:condicao})',
  },
  {
    label: 'para',
    code: 'para (var ${1:i} = ${2:0}; ${1:i} < ${3:limite}; ${1:i} = ${1:i} + 1) {\n\t${4:}\n}',
  },
  {
    label: 'para cada',
    code: 'para cada ${1:item} de ${2:lista} {\n\t${3:}\n}',
  },
  {
    label: 'sustar',
    code: 'sustar',
  },
  {
    label: 'continua',
    code: 'continua',
  },
  {
    label: 'verdadeiro',
    code: 'verdadeiro',
  },
  {
    label: 'falso',
    code: 'falso',
  },
  {
    label: 'nulo',
    code: 'nulo',
  },
  {
    label: 'tente pegue',
    code: 'tente {\n\t${1:}\n} pegue (${2:erro}) {\n\t${3:}\n}',
  },
  {
    label: 'falhar',
    code: 'falhar "${1:mensagem}"',
  },
  {
    label: 'classe',
    code: 'classe ${1:Nome} {\n\tconstrutor(${2:parametros}) {\n\t\t${3:}\n\t}\n}',
  },
] as const satisfies readonly LspSnippet[]
