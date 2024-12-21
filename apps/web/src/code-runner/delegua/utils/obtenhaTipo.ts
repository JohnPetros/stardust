import { Numeric } from '@/@core/domain/structs'

type Tipo = 'vetor' | 'texto' | 'numero'

export function obtenhaTipo(valor: unknown): Tipo {
  if (Array.isArray(valor)) {
    return 'vetor'
  }

  const eUmTexto =
    typeof valor === 'string' && (valor.at(0) === '"' || valor.at(-1) === '"')

  if (eUmTexto) return 'texto'

  const eUmNumero = Numeric.isNumeric(valor)

  if (eUmNumero) return 'numero'

  return 'texto'
}
