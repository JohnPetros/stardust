import { AvaliadorSintatico, InterpretadorBase, Lexador } from '@designliquido/delegua'

import type { ICodeRunnerProvider } from '@/@core/interfaces/providers/ICodeRunnerProvider'
import { CodeRunnerResponse } from '@/@core/responses'
import type { CodeInput } from '@/@core/domain/types'
import { DELEGUA_REGEX } from './constants'
import { obtenhaTipo, trateErro } from './utils'

export function DeleguaCodeRunnerProvider(): ICodeRunnerProvider {
  const lexador = new Lexador()
  const avaliadorSintatico = new AvaliadorSintatico()

  return {
    async run(code: string, shouldReturnResult = false) {
      const outputs: string[] = []

      function funcaoDeSaida(novaSaida: string) {
        outputs.push(novaSaida)
      }

      const interpretador = new InterpretadorBase('', false, funcaoDeSaida, funcaoDeSaida)

      console.log({ code })

      const resultadoLexador = lexador.mapear(code.split('\n'), -1)
      const resultadoAvaliacaoSintatica = avaliadorSintatico.analisar(resultadoLexador, 0)

      const { resultado, erros } = await interpretador.interpretar(
        resultadoAvaliacaoSintatica.declaracoes,
        false,
      )

      console.log({ resultado })

      if (erros.length) {
        const erro = erros[0]
        const linhaDoErro = erro.linha ?? 0
        return trateErro(erro, linhaDoErro)
      }

      console.log('saida', outputs)

      let result: string | boolean = ''

      if (resultado.length && shouldReturnResult) {
        for (const valor of resultado) {
          if (valor.includes('valor')) {
            result = (JSON.parse(resultado[0]) as { valor: string | boolean }).valor
            if (result === true) result = 'verdadeiro'
            if (result === false) result = 'falso'
            break
          }
        }
      }

      console.log('result', result)

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

        codigo = codeValue.replace(DELEGUA_REGEX.funcaoLeia, entrada)
      }

      return codigo
    },
  }
}
