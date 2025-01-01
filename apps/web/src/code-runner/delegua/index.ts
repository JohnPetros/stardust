import { AvaliadorSintatico, InterpretadorBase, Lexador } from '@designliquido/delegua'

import { CodeRunnerResponse } from '@stardust/core/responses'
import type { ICodeRunnerProvider } from '@stardust/core/interfaces'
import type { CodeInput } from '@stardust/core/global/types'

import { DELEGUA_REGEX } from './constants'
import { obtenhaTipo, trateErro } from './utils'

export const DeleguaCodeRunnerProvider = (): ICodeRunnerProvider => {
  const lexador = new Lexador()
  const avaliadorSintatico = new AvaliadorSintatico()

  return {
    async run(code: string) {
      const outputs: string[] = []

      function funcaoDeSaida(novaSaida: string) {
        outputs.push(novaSaida)
      }

      const interpretador = new InterpretadorBase('', false, funcaoDeSaida, funcaoDeSaida)
      const resultadoLexador = lexador.mapear(code.split('\n'), -1)
      const resultadoAvaliacaoSintatica = avaliadorSintatico.analisar(resultadoLexador, 0)
      const { resultado, erros } = await interpretador.interpretar(
        resultadoAvaliacaoSintatica.declaracoes,
        false,
      )

      if (erros.length && erros[0]) {
        const erro = erros[0]
        const linhaDoErro = erro.linha ?? 0
        return trateErro(erro, linhaDoErro)
      }

      let result: string | boolean = ''

      if (resultado[1]) {
        result = resultado[1]
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
        let entrada = input
        const tipo = obtenhaTipo(entrada)

        switch (tipo) {
          case 'vetor':
            entrada = `[${input}]`
            break
          case 'numero':
            entrada = input.toString()
            break
          case 'texto':
            entrada = `"${input}"`
        }

        codigo = codigo.replace(DELEGUA_REGEX.conteudoDeFuncaoLeia, entrada)
      }

      return codigo
    },

    addFunction(functionName: string, functionParams: unknown[], code: string) {
      const paramsValues = functionParams.map((param) =>
        Array.isArray(param) ? `[${param.join(',')}]` : param,
      )
      const params = `(${paramsValues.join(',')})`
      return code.concat(`\n${functionName}${params};`)
    },

    getInputsCount(codeValue) {
      const regex = new RegExp(DELEGUA_REGEX.funcaoLeia, 'g')
      const comandosLeia = codeValue.match(regex)
      return comandosLeia?.length ?? 0
    },

    translateToCodeRunner(jsCode: unknown) {
      return ''
    },

    translateToJs(codeRunnerCode: string) {
      // codeRunnerCode.replaceAll()
      return codeRunnerCode
    },
  }
}
