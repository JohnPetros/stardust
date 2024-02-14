'use client'

import { AvaliadorSintatico } from '@designliquido/delegua/fontes/avaliador-sintatico/'
import { InterpretadorBase } from '@designliquido/delegua/fontes/interpretador'
import { Lexador } from '@designliquido/delegua/fontes/lexador'

import { ICode } from '../interfaces/ICode'
import { CodeError } from '../types/CodeError'
import { CodeReturn } from '../types/CodeReturn'

import { DELEGUA_TOKENS } from './constants/delegua-tokens'
import { DELEGUA_REGEX } from './constants/regex'
import { getDeleguaMonacoEditorConfig } from './helpers/getDeleguaMonacoEditorConfig'

const SEPARADOR = '@delegua-separador'

export function useDelegua(): ICode {
  const lexador = new Lexador(false)
  const avaliadorSintatico = new AvaliadorSintatico()

  return {
    async execute(code: string) {
      let saida: string = ''

      function funcaoDeSaida(novaSaida: string) {
        saida = novaSaida
      }

      const interpretador = new InterpretadorBase(
        '',
        false,
        funcaoDeSaida,
        funcaoDeSaida
      )
      const resultadoLexador = lexador.mapear(code.split('\n'), -1)
      const resultadoAvaliacaoSintatica = avaliadorSintatico.analisar(
        resultadoLexador,
        0
      )

      const { resultado, erros } = await interpretador.interpretar(
        resultadoAvaliacaoSintatica.declaracoes,
        false
      )

      if (erros.length) {
        const erro = erros[0]
        const linhaDoErro = erro.linha ?? 0
        if (erro instanceof Error)
          throw `mensagem:${erro}${SEPARADOR}linha${linhaDoErro}`

        throw `mensagem:${erro.erroInterno}${SEPARADOR}linha${linhaDoErro}`
      }

      const codeReturn: CodeReturn = {
        result: resultado[0],
        output: saida,
      }

      return codeReturn
    },

    formatOutput(output: string) {
      let saidasFormatadas: string[] = []
      let tipos: string[] = []

      function formateSaida(saida: string, indice: number) {
        const tipo = tipos[indice].trim()

        switch (tipo) {
          case 'texto':
            return '"' + saida + '"'
          case 'vetor':
            return '[ ' + saida.split(',').join(', ') + ' ]'
          default:
            return saida
        }
      }

      const tiposESaidas = output.split(SEPARADOR)

      tipos = tiposESaidas.filter((_, index) => index % 2 === 0)
      const saidas = tiposESaidas.filter((_, index) => index % 2 === 0)

      saidasFormatadas = saidas.map(formateSaida)

      return saidasFormatadas
    },

    getInput(code: string) {
      const regex = DELEGUA_REGEX.dentroDeLeia
      const entrada = code.match(regex)

      return entrada ? entrada[0] : ''
    },

    getTokens() {
      return DELEGUA_TOKENS
    },

    getMonacoEditorConfig() {
      return getDeleguaMonacoEditorConfig()
    },

    handleError(error: Error) {
      const [mensagemDoError, linhaDoErro] = error.message.split(';')

      const mensagem = mensagemDoError.includes('null')
        ? 'Código inválido'
        : mensagemDoError

      const codeError: CodeError = {
        message: mensagem,
        line: Number(linhaDoErro),
      }

      return codeError
    },
  }
}
