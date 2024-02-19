'use client'

import {
  AvaliadorSintatico,
  InterpretadorBase,
  Lexador,
} from '@designliquido/delegua'

import { ICode } from '../interfaces/ICode'
import { CodeError } from '../types/CodeError'
import { CodeReturn } from '../types/CodeReturn'

import { DELEGUA_TOKENS } from './constants/delegua-tokens'
import { DELEGUA_REGEX } from './constants/regex'
import { pegueConfiguracaoDeleguaParaEditorMonaco } from './helpers/pegueConfiguracaoDeleguaParaEditorMonaco'

import type {
  ChallengeTestCaseExpectedOutput,
  ChallengeTestCaseInput,
} from '@/@types/Challenge'
import { checkNumeric } from '@/global/helpers'
import { obtenhaTipo } from './helpers/obtenhaTipo'

const SEPARADOR = '@delegua-separador'

export function useDelegua(): ICode {
  const lexador = new Lexador()
  const avaliadorSintatico = new AvaliadorSintatico()

  return {
    async run(code: string, shouldReturnResult = false) {
      const saida: string[] = []

      function funcaoDeSaida(novaSaida: string) {
        saida.push(novaSaida)
      }

      const interpretador = new InterpretadorBase(
        '',
        false,
        funcaoDeSaida,
        funcaoDeSaida
      )

      console.log({ code })

      const resultadoLexador = lexador.mapear(code.split('\n'), -1)
      const resultadoAvaliacaoSintatica = avaliadorSintatico.analisar(
        resultadoLexador,
        0
      )

      const { resultado, erros } = await interpretador.interpretar(
        resultadoAvaliacaoSintatica.declaracoes,
        false
      )

      console.log({ resultado })

      if (erros.length) {
        const erro = erros[0]
        const linhaDoErro = erro.linha ?? 0
        if (erro instanceof Error) throw `${erro}${SEPARADOR}${linhaDoErro}`

        throw `${erro.erroInterno}${SEPARADOR}${linhaDoErro}`
      }

      console.log('saida', saida)

      let result: string | boolean = ''

      if (resultado.length && shouldReturnResult) {
        for (const valor of resultado) {
          if (valor.includes('valor')) {
            result = (JSON.parse(resultado[0]) as { valor: string | boolean })
              .valor
            if (result === true) result = 'verdadeiro'
            if (result === false) result = 'falso'
            break
          }
        }
      }

      console.log('result', result)

      const codeReturn: CodeReturn = {
        result: result,
        output: saida,
      }

      return codeReturn
    },

    formatResult(result: string) {
      return result
        .replace(/'/g, '\\"')
        .replace(/\\"/g, '')
        .replace(/"verdadeiro"/g, 'verdadeiro')
        .replace(/"falso"/g, 'falso')
    },

    desformatOutput(output: ChallengeTestCaseExpectedOutput) {
      if (Array.isArray(output)) {
        return `[${output.join(',').replace(/"/g, '')}]`
      }

      return String(output)
    },

    formatOutput(output: string) {
      const eNumerico = checkNumeric(output)

      if (eNumerico) return Number(output)

      const eVetor = output.at(0) === '[' && output.at(-1) === ']'

      if (eVetor) return output

      return `"${output}"`
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
      let codigo = code

      for (const value of input) {
        let valor = value
        const tipo = obtenhaTipo(valor)

        switch (tipo) {
          case 'vetor':
            valor = `[${value}]`
            break
          case 'numero':
            valor = value.toString()
            break
          case 'texto':
            valor = `"${input}"`
        }

        codigo = code.replace(
          DELEGUA_REGEX.leia,
          valor
        )
      }

      return codigo
    },

    addFunction(
      functionName: string,
      functionParams: ChallengeTestCaseInput,
      code: string
    ) {
      const paramsValues = functionParams.map((value) =>
        Array.isArray(value) ? `[${value.join(',')}]` : value
      )

      const params = `(${paramsValues.join(',')})`
      return code.concat(`\n${functionName}${params};`)
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
