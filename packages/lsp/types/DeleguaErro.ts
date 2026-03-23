import type {
  ErroAvaliadorSintatico,
  ErroInterpretadorInterface,
} from '@designliquido/delegua'
import type { ErroLexador } from '@designliquido/delegua/lexador/erro-lexador'

export type DeleguaErro =
  | ErroLexador
  | ErroAvaliadorSintatico
  | ErroInterpretadorInterface
