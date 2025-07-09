import type { DeleguaErro } from '../types'

import { CodeRunnerError } from '@stardust/core/global/errors'
import { CodeRunnerResponse } from '@stardust/core/global/responses'

export function trateErro(erro: DeleguaErro) {
  const linhaDoErro = erro.linha ?? 0 // TODO: erro.linha pode ser undefined

  if ('erroInterno' in erro && erro.erroInterno instanceof Error) {
    return new CodeRunnerResponse({
      error: new CodeRunnerError(erro.erroInterno.message, linhaDoErro),
    })
  }

  if (erro instanceof Error) {
    return new CodeRunnerResponse({
      error: new CodeRunnerError(erro.message, linhaDoErro),
    })
  }

  let mensagemDeErro = String(erro.mensagem)

  mensagemDeErro = mensagemDeErro.includes('null') ? 'Código inválido' : mensagemDeErro

  const error = new CodeRunnerError(mensagemDeErro, linhaDoErro)

  return new CodeRunnerResponse({ error })
}
