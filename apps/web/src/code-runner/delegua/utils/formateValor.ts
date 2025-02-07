const NUMBER_REGEX = /^-?\d+(\.\d+)?$/

export function formateValor(valor: unknown) {
  if (Array.isArray(valor)) {
    return JSON.stringify(valor).replaceAll(',', ', ')
  }

  const valorFormatado = String(valor)

  switch (typeof valor) {
    case 'number':
      return valorFormatado
    case 'boolean':
      if (valor === true) {
        return 'verdadeiro'
      }
      if (valor === false) {
        return 'falso'
      }
      return 'nulo'
  }

  const ehTipoLogicoDelegua = ['verdadeiro', 'falso', 'nulo'].includes(valorFormatado)

  if (ehTipoLogicoDelegua) {
    return valorFormatado
  }

  return `"${valorFormatado}"`
}
