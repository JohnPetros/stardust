import { checkNumeric } from '@/global/helpers'

export function obtenhaTipo(valor: string) {
  if (Array.isArray(valor)) {
    return 'vetor'
  }

  const eTexto = valor.at(0) === '"' || valor.at(-1) === '"'

  if (eTexto) return 'texto'

  const eNumero = checkNumeric(valor)

  if (eNumero) return 'numero'

  return 'texto'
}
