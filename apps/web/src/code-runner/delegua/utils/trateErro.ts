import type { ErroInterpretador } from '@designliquido/delegua/interfaces/erros/erro-interpretador'

import { CodeRunnerError } from '@stardust/core/global/errors'
import { CodeRunnerResponse } from '@stardust/core/responses'

export function trateErro(erro: ErroInterpretador, linhaDoErro: number) {
  let mensagemDeErro = String(erro.mensagem)

  if (erro.erroInterno instanceof Error) {
    mensagemDeErro = erro.erroInterno.message
  }

  mensagemDeErro = mensagemDeErro.includes('null') ? 'Código inválido' : mensagemDeErro

  const error = new CodeRunnerError(mensagemDeErro, linhaDoErro)

  return new CodeRunnerResponse({ error })
}
