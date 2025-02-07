const NUMBER_REGEX = /^-?\d+(\.\d+)?$/

export function formateValor(valor: string) {
  if (Array.isArray(valor)) {
    return JSON.stringify(valor).replaceAll(',', ', ')
  }

  const ehTipoLogico = ['verdadeiro', 'falso', 'nulo'].includes(valor)

  if (ehTipoLogico) {
    return valor
  }

  const ehTipoTexto =
    !valor.startsWith('[') && !valor.endsWith('[') && !NUMBER_REGEX.test(valor)

  if (ehTipoTexto) {
    return `"${valor}"`
  }

  return valor
}
