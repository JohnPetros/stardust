type Tipo = 'lista' | 'texto' | 'numero' | 'lógico'

export function obtenhaTipo(valor: unknown): Tipo {
  if (Array.isArray(valor)) {
    return 'lista'
  }

  switch (typeof valor) {
    case 'string':
      return 'texto'
    case 'number':
      return 'numero'
    case 'boolean':
      return 'lógico'
  }

  return 'texto'
}
