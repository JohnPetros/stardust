import type { ErroInterpretador } from '@designliquido/delegua/interfaces/erros/erro-interpretador'

import { CodeRunnerError } from '@/@core/errors/providers'
import { CodeRunnerResponse } from '@/@core/responses'

export function trateErro(erro: ErroInterpretador, linhaDoErro: number) {
  let mensagemDeErro: string

  if (erro instanceof Error) {
    mensagemDeErro = String(erro)
  }

  mensagemDeErro = erro.erroInterno

  mensagemDeErro = mensagemDeErro.includes('null') ? 'Código inválido' : mensagemDeErro

  const error = new CodeRunnerError(mensagemDeErro, linhaDoErro)

  return new CodeRunnerResponse({ error })
}
