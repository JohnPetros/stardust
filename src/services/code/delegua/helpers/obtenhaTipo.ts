import { checkNumeric } from '@/global/helpers'

type Tipo = 'vetor' | 'texto' | 'numero'

export function obtenhaTipo(valor: unknown): Tipo {
  if (Array.isArray(valor)) {
    return 'vetor'
  }

  const eTexto = typeof valor === 'string' && (valor.at(0) === '"' || valor.at(-1) === '"')

  if (eTexto) return 'texto'

  const eNumero = checkNumeric(String(valor))

  if (eNumero) return 'numero'

  return 'texto'
}
