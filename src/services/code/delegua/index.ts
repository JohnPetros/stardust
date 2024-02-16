'use client'

import { AvaliadorSintatico } from '@designliquido/delegua/fontes/avaliador-sintatico/'
import { InterpretadorBase } from '@designliquido/delegua/fontes/interpretador'
import { Lexador } from '@designliquido/delegua/fontes/lexador'

import { ICode } from '../interfaces/ICode'
import { CodeError } from '../types/CodeError'
import { CodeReturn } from '../types/CodeReturn'

import { DELEGUA_TOKENS } from './constants/delegua-tokens'
import { DELEGUA_REGEX } from './constants/regex'
import { adicioneTipo } from './helpers/adicioneTipo'
import { pegueConfiguracaoDeleguaParaEditorMonaco } from './helpers/pegueConfiguracaoDeleguaParaEditorMonaco'

import type {
  ChallengeTestCaseExpectedOutput,
  ChallengeTestCaseInput,
} from '@/@types/Challenge'
import { checkNumeric } from '@/global/helpers'

const SEPARADOR = '@delegua-separador'

export function useDelegua(): ICode {
  const lexador = new Lexador(false)
  const avaliadorSintatico = new AvaliadorSintatico()

  return {
    async run(code: string) {
      const saida: string[] = []

      const codigo = adicioneTipo(code)

      function funcaoDeSaida(novaSaida: string) {
        /**
         * ???
         *  if (output === 'vetor' && currentOutput.at(-1) === 'texto') {
        return [...currentOutput, 'lista']
      }

      return [...currentOutput, output]
         */
        saida.push(novaSaida)
      }

      const interpretador = new InterpretadorBase(
        '',
        false,
        funcaoDeSaida,
        funcaoDeSaida
      )

      const resultadoLexador = lexador.mapear(codigo.split('\n'), -1)
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
        if (erro instanceof Error) throw `${erro}${SEPARADOR}${linhaDoErro}`

        throw `${erro.erroInterno}${SEPARADOR}${linhaDoErro}`
      }

      const codeReturn: CodeReturn = {
        result: resultado[0],
        output: saida,
      }

      return codeReturn
    },

    formatOutput(output: string[], shouldPrettify: boolean) {
      let saidasFormatadas: string[] = []
      let tipos: string[] = []

      function formateItemDeVetor(item: string) {
        const eDoTipoLogico = ['verdadeiro', 'falso'].includes(item)
        if (eDoTipoLogico) return item

        const eNumerico = checkNumeric(item)
        if (eNumerico) return item

        return `"${item}"`
      }

      function formateSaida(saida: string, indice: number) {
        const tipo = tipos[indice].trim()

        switch (tipo) {
          case 'texto':
            return '"' + saida + '"'
          case 'vetor':
            return (
              '[ ' + saida.split(',').map(formateItemDeVetor).join(', ') + ' ]'
            )
          default:
            return saida
        }
      }

      tipos = output.filter((_, index) => index % 2 === 0)
      const saidas = output.filter((_, index) => index % 2 !== 0)

      saidasFormatadas = shouldPrettify ? saidas.map(formateSaida) : saidas

      return saidasFormatadas
    },

    desformatOutput(formmattedOutput: ChallengeTestCaseExpectedOutput[]) {
      function desformatarVetor(vetor: ChallengeTestCaseExpectedOutput[]) {
        return vetor.reduce((itens, itemAtual) => {
          if (Array.isArray(itemAtual)) {
            itens.push(...desformatarVetor(itemAtual))
          } else {
            itens.push(String(itemAtual).replace(/"/g, ''))
          }
          return itens
        }, [] as ChallengeTestCaseExpectedOutput[])
      }

      const saidaDesformatada = desformatarVetor(formmattedOutput)

      return saidaDesformatada.join(',')
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
      return pegueConfiguracaoDeleguaParaEditorMonaco()
    },

    getInputCommands(code: string) {
      const regex = new RegExp(DELEGUA_REGEX.leia, 'g')
      const comandosLeia = code.match(regex)

      return comandosLeia ? comandosLeia.map(String) : null
    },

    addInput(input: ChallengeTestCaseInput, code: string) {
      const regex = new RegExp(DELEGUA_REGEX.leia, 'g')

      input.forEach(
        (value) =>
          (code = code.replace(
            regex,
            Array.isArray(value) ? `[${value}]` : value.toString()
          ))
      )

      return code
    },

    handleError(error: string) {
      const [mensagemDoError, linhaDoErro] = error.split(SEPARADOR)

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
