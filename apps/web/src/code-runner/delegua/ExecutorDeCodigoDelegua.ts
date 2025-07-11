import {
  AvaliadorSintatico,
  Lexador,
  LexadorJavaScript,
  AvaliadorSintaticoJavaScript,
  TradutorJavaScript,
  TradutorReversoJavaScript,
} from '@designliquido/delegua/umd/delegua.js'

import { CodeRunnerResponse } from '@stardust/core/global/responses'
import type { CodeInput } from '@stardust/core/global/types'
import type { CodeRunnerProvider } from '@stardust/core/global/interfaces'

import { DELEGUA_REGEX } from './constants'
import { obtenhaTipo, trateErro } from './utils'
import { DeleguaInterpretador } from './DeleguaInterpretador'

export const ExecutorDeCodigoDelegua = (): CodeRunnerProvider => {
  const lexador = new Lexador()
  const avaliadorSintatico = new AvaliadorSintatico()

  return {
    async run(code: string) {
      const outputs: string[] = []

      function funcaoDeSaida(saida: string) {
        outputs.push(saida)
      }

      const interpretador = new DeleguaInterpretador(
        '',
        false,
        funcaoDeSaida,
        funcaoDeSaida,
      )
      const resultadoLexador = lexador.mapear(code.split('\n'), -1)
      if (resultadoLexador.erros.length) {
        return trateErro(resultadoLexador.erros[0])
      }
      const resultadoAvaliacaoSintatica = avaliadorSintatico.analisar(resultadoLexador, 0)
      if (resultadoAvaliacaoSintatica.erros.length) {
        return trateErro(resultadoAvaliacaoSintatica.erros[0])
      }
      const resultadoInterpretador = await interpretador.interpretar(
        resultadoAvaliacaoSintatica.declaracoes,
        false,
      )
      if (resultadoInterpretador.erros.length) {
        return trateErro(resultadoInterpretador.erros[0])
      }

      const resultado = resultadoInterpretador.resultado

      let result = ''
      if (resultado.length) {
        if (resultado[0] === '{"valor":null}') {
          result = 'nulo'
        }

        if (resultado[0] === '{"valor":{}}') {
          result = '{}'
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

      try {
        const lexador = new LexadorJavaScript()
        const avaliadorSintatico = new AvaliadorSintaticoJavaScript()
        const resultadoLexico = lexador.mapear(codigo.split('\n'), -1)
        const resultadoSintatico = avaliadorSintatico.analisar(resultadoLexico, -1)
        const tradutor = new TradutorReversoJavaScript()
        const traducao = tradutor.traduzir(resultadoSintatico.declaracoes)
        return traducao.trim().replace(' \n', '').replaceAll('\\"', '')
      } catch (error) {
        return codigo
      }
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
