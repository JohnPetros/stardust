import {
  AvaliadorSintatico,
  InterpretadorBase,
  Lexador,
  TradutorJavaScript,
  TradutorReversoJavaScript,
} from '@designliquido/delegua'
import { AvaliadorSintaticoJavaScript } from '@designliquido/delegua/avaliador-sintatico/traducao/avaliador-sintatico-javascript'
import { LexadorJavaScript } from '@designliquido/delegua/lexador/traducao/lexador-javascript'

import { CodeRunnerResponse } from '@stardust/core/responses'
import type { ICodeRunnerProvider } from '@stardust/core/interfaces'
import type { CodeInput } from '@stardust/core/global/types'

import { DELEGUA_REGEX } from './constants'
import { obtenhaTipo, trateErro } from './utils'

export const ExecutorDeCodigoDelegua = (): ICodeRunnerProvider => {
  const lexador = new Lexador()
  const avaliadorSintatico = new AvaliadorSintatico()

  return {
    async run(code: string) {
      const outputs: string[] = []

      function funcaoDeSaida(saida: string) {
        outputs.push(saida)
      }

      const interpretador = new InterpretadorBase('', false, funcaoDeSaida, funcaoDeSaida)
      const resultadoLexador = lexador.mapear(code.split('\n'), -1)
      const resultadoAvaliacaoSintatica = avaliadorSintatico.analisar(resultadoLexador, 0)
      const { resultado, erros } = await interpretador.interpretar(
        resultadoAvaliacaoSintatica.declaracoes,
        false,
      )

      console.log('resultado', resultado)

      if (erros.length && erros[0]) {
        const erro = erros[0]
        const linhaDoErro = erro.linha ?? 0
        return trateErro(erro, linhaDoErro)
      }

      let result = ''
      if (resultado.length) {
        if (resultado[0] === '{"valor":null}') {
          result = 'nulo'
        }

        const resultadoComValor = resultado
          .reverse()
          .find((resultado) => resultado.startsWith('{"valor":'))

        let valor: unknown
        if (resultadoComValor && !result) {
          const resultadoParseado = JSON.parse(resultadoComValor)

          if ('valor' in resultadoParseado) {
            const temValorInterno =
              typeof resultadoParseado.valor === 'object' &&
              'valor' in resultadoParseado.valor

            if (temValorInterno) {
              valor = resultadoParseado.valor.valor
            } else {
              valor = resultadoParseado.valor
            }
            result = this.translateToCodeRunner(valor)
          }
        } else if (!result) {
          result = String(resultado[0])
        }
      }

      return new CodeRunnerResponse({ result, outputs })
    },

    getInput(code: string) {
      const regex = DELEGUA_REGEX.conteudoDeFuncaoLeia
      const entrada = code.match(regex)

      return entrada ? entrada[0] : null
    },

    addInputs(codeInputs: CodeInput[], codeValue: string) {
      let codigo = codeValue

      for (const input of codeInputs) {
        const entrada = this.translateToCodeRunner(input)
        codigo = codigo.replace(DELEGUA_REGEX.conteudoDeFuncaoLeia, entrada)
      }

      return codigo
    },

    addFunctionCall(functionParams: unknown[], code: string) {
      const paramsValues = functionParams.map((param) => {
        return Array.isArray(param)
          ? `[${param.map((value) => this.translateToCodeRunner(value)).join(',')}]`
          : this.translateToCodeRunner(param)
      })
      const params = `(${paramsValues.join(',')})`
      const functionName = this.getFunctionName(code)
      return code.concat(`\n${functionName}${params};`)
    },

    buildFunction(functionName: string, functionParamsNames: string[]) {
      return `funcao ${functionName}(${functionParamsNames.join(', ')}) {

}`
    },

    getFunctionName(codeValue: string) {
      const match = codeValue.match(DELEGUA_REGEX.nomeDeFuncaoQualquer)
      if (match) {
        return match[1] ?? ''
      }

      return ''
    },

    getFunctionParamsNames(codeValue: string) {
      const match = codeValue.match(DELEGUA_REGEX.parametrosDeFuncaoQualquer)

      if (match) {
        const params = match[1]?.split(',').map((param) => param.trim())
        if (Array.isArray(params)) return params
      }

      return []
    },

    getInputsCount(codeValue) {
      const regex = new RegExp(DELEGUA_REGEX.funcaoLeia, 'g')
      const comandosLeia = codeValue.match(regex)
      return comandosLeia?.length ?? 0
    },

    translateToCodeRunner(jsCode: unknown) {
      const tipo = obtenhaTipo(jsCode)
      const codigo = ['texto', 'lista'].includes(tipo)
        ? JSON.stringify(jsCode)
        : String(jsCode)

      const lexador = new LexadorJavaScript()
      const avaliadorSintatico = new AvaliadorSintaticoJavaScript()
      const resultadoLexico = lexador.mapear(codigo.split('\n'), -1)
      const resultadoSintatico = avaliadorSintatico.analisar(resultadoLexico, -1)
      const tradutor = new TradutorReversoJavaScript()
      const traducao = tradutor.traduzir(resultadoSintatico.declaracoes)
      return traducao.trim().replace(' \n', '').replaceAll('\\"', '')
    },

    translateToJs(codeRunnerCode: string) {
      const lexador = new Lexador()
      const avaliadorSintatico = new AvaliadorSintatico()
      const resultadoLexico = lexador.mapear(codeRunnerCode.split('\n'), -1)
      const resultadoSintatico = avaliadorSintatico.analisar(resultadoLexico, -1)
      const tradutor = new TradutorJavaScript()
      const traducao = tradutor.traduzir(resultadoSintatico.declaracoes)
      return traducao.trim()
    },
  }
}
