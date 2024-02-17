'use client'

import { AvaliadorSintatico } from '@designliquido/delegua/fontes/avaliador-sintatico/'
import { InterpretadorBase } from '@designliquido/delegua/fontes/interpretador'
import { Lexador } from '@designliquido/delegua/fontes/lexador'

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

const SEPARADOR = '@delegua-separador'

export function useDelegua(): ICode {
  const lexador = new Lexador(false)
  const avaliadorSintatico = new AvaliadorSintatico()

  return {
    async run(code: string, shouldReturnResult: boolean = false) {
      let saida = ''

      function funcaoDeSaida(novaSaida: string) {
        saida = novaSaida
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

      console.log('delegua', { saida })

      let result = ''

      if (resultado.length && shouldReturnResult)
        result = (JSON.parse(resultado[0]) as { valor: string }).valor

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
        return output.join(',')
      }

      return String(output)
    },

    formatOutput(output: string, shouldPrettify: boolean = false) {
      const eNumerico = checkNumeric(output)

      if (eNumerico) return Number(output)

      return shouldPrettify ? `"${output}"` : output
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
      input.forEach(
        (value) =>
          (code = code.replace(
            DELEGUA_REGEX.leia,
            Array.isArray(value) ? `[${value}]` : value.toString()
          ))
      )

      return code
    },

    addFunction(
      functionName: string,
      functionParams: ChallengeTestCaseInput,
      code: string
    ) {
      const paramsValues = functionParams.map((value) =>
        Array.isArray(value) ? `[${value.join(',')}]` : value
      )

      const params = '(' + paramsValues.join(',') + ')'
      return code.concat('\n' + functionName + params + ';')
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
