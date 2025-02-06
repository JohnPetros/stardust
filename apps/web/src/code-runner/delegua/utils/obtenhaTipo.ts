import { Numeric } from '@stardust/core/global/structs'

type Tipo = 'lista' | 'texto' | 'numero' | 'lógico'

export function obtenhaTipo(valor: unknown): Tipo {
  if (Array.isArray(valor)) {
    return 'lista'
  }

  const eUmLogico = valor === true || valor === false

  if (eUmLogico) return 'lógico'

  const eUmTexto =
    typeof valor === 'string' && (valor.at(0) === '"' || valor.at(-1) === '"')

  if (eUmTexto) return 'texto'

  const eUmNumero = Numeric.isNumeric(valor)

  if (eUmNumero) return 'numero'

  return 'texto'
}
