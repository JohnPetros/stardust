import type { ErroAvaliadorSintatico } from '@designliquido/delegua'
import type { ErroInterpretador } from '@designliquido/delegua/interfaces/erros/erro-interpretador'
import type { ErroLexador } from '@designliquido/delegua/lexador/erro-lexador'

export type DeleguaErro = ErroLexador | ErroAvaliadorSintatico | ErroInterpretador
