import { DELEGUA_REGEX } from '../constants/regex'

import { countCharacters } from '@/global/helpers'

function pegueTipo(escreva: string) {
  return escreva.replace(DELEGUA_REGEX.dentroDeEscreva, 'escreva(tipo de $1)')
}

function verifiqueParenteses(escreva: string) {
  const abreParenteses = '('
  const fechaParentese = ')'

  const quantidadeDeAbreParenteses = countCharacters(abreParenteses, escreva)
  const quantidadeDefechaParentese = countCharacters(fechaParentese, escreva)

  if (quantidadeDeAbreParenteses < quantidadeDefechaParentese) {
    const difference = quantidadeDefechaParentese - quantidadeDeAbreParenteses
    return escreva + fechaParentese.repeat(difference)
  } else if (quantidadeDeAbreParenteses > quantidadeDefechaParentese) {
    const difference = quantidadeDeAbreParenteses - quantidadeDefechaParentese
    return escreva + fechaParentese.repeat(difference)
  }

  return escreva
}

export function adicioneTipo(codigo: string) {
  const regex = new RegExp(DELEGUA_REGEX.escreva, 'g')

  if (!regex.test(codigo)) return codigo

  const codigoComTipos = codigo.replace(regex, (print) => {
    const checkedPrint = verifiqueParenteses(print)
    return pegueTipo(checkedPrint) + print
  })

  return codigoComTipos
}
