'use client'

import { Lexador } from '@designliquido/delegua/fontes/lexador'
import { AvaliadorSintatico } from '@designliquido/delegua/fontes/avaliador-sintatico/'
import { InterpretadorBase } from '@designliquido/delegua/fontes/interpretador'

type Callback = (output: string) => void

export async function execute(code: string, callback: Callback) {
  const lexador = new Lexador(false)
  const avaliadorSintatico = new AvaliadorSintatico()
  const interpretador = new InterpretadorBase('', false, callback, callback)
  const resultadoLexador = lexador.mapear(code.split('\n'), -1)
  const resultadoAvaliacaoSintatica = avaliadorSintatico.analisar(
    resultadoLexador,
    0
  )
  return await interpretador.interpretar(
    resultadoAvaliacaoSintatica.declaracoes,
    false
  )
}
