import {
  AvaliadorSintatico,
  Lexador,
  TradutorJavaScript,
  TradutorReversoJavaScript,
} from '@designliquido/delegua'
import { AnalisadorSemantico } from '@designliquido/delegua/analisador-semantico'
import { AvaliadorSintaticoJavaScript } from '@designliquido/delegua/avaliador-sintatico/traducao/avaliador-sintatico-javascript'
import { LexadorJavaScript } from '@designliquido/delegua/lexador/traducao/lexador-javascript'

import { CodeRunnerResponse } from '@stardust/core/global/responses'
import { CodeRunnerError } from '@stardust/core/global/errors'
import type { CodeInput } from '@stardust/core/global/types'
import type { CodeRunnerProvider } from '@stardust/core/global/interfaces'

import { DELEGUA_REGEX } from './constants'
import type { DeleguaErro } from '../types/DeleguaErro'
import { InterpretadorDelegua } from './InterpretadorDelegua'

export class ExecutorDeCodigoDelegua implements CodeRunnerProvider {
  private readonly lexador: Lexador = new Lexador()
  private readonly avaliadorSintatico: AvaliadorSintatico = new AvaliadorSintatico()
  private readonly analisadorSemantico: AnalisadorSemantico = new AnalisadorSemantico()

  async run(code: string) {
    const outputs: string[] = []

    function funcaoDeSaida(saida: string) {
      outputs.push(saida)
    }

    const interpretador = new InterpretadorDelegua(
      '',
      false,
      funcaoDeSaida,
      funcaoDeSaida,
    )
    const resultadoLexador = this.lexador.mapear(code.split('\n'), -1)
    if (resultadoLexador.erros.length) {
      return this.trateErro(resultadoLexador.erros[0])
    }
    const resultadoAvaliacaoSintatica = this.avaliadorSintatico.analisar(
      resultadoLexador,
      0,
    )
    if (resultadoAvaliacaoSintatica.erros.length) {
      return this.trateErro(resultadoAvaliacaoSintatica.erros[0])
    }
    const resultadoInterpretador = await interpretador.interpretar(
      resultadoAvaliacaoSintatica.declaracoes,
      false,
    )
    if (resultadoInterpretador.erros.length) {
      return this.trateErro(resultadoInterpretador.erros[0])
    }

    console.log(resultadoInterpretador.resultado)

    let resultado = null

    if (resultadoInterpretador?.resultado?.at(-1)) {
      resultado = resultadoInterpretador?.resultado.at(-1)?.valorRetornado.valor

      if (typeof resultado === 'object' && resultado !== null && 'valor' in resultado) {
        resultado = resultado.valor
      }
    }

    console.log(resultado)

    return new CodeRunnerResponse({ result: resultado, outputs })
  }

  getInput(code: string) {
    const regex = DELEGUA_REGEX.conteudoDeFuncaoLeia
    const entrada = code.match(regex)

    return entrada ? entrada[0] : null
  }

  addInputs(codeInputs: CodeInput[], codeValue: string) {
    let codigo = codeValue

    for (const input of codeInputs) {
      const entrada = this.translateToCodeRunner(input)
      codigo = codigo.replace(DELEGUA_REGEX.conteudoDeFuncaoLeia, entrada)
    }

    return codigo
  }

  addFunctionCall(functionParams: unknown[], code: string) {
    const paramsValues = functionParams.map((param) => {
      return Array.isArray(param)
        ? `[${param.map((value) => this.translateToCodeRunner(value)).join(',')}]`
        : this.translateToCodeRunner(param)
    })
    const params = `(${paramsValues.join(',')})`
    const functionName = this.getFunctionName(code)
    return code.concat(`\n${functionName}${params};`)
  }

  buildFunction(functionName: string, functionParamsNames: string[]) {
    return `funcao ${functionName}(${functionParamsNames.join(', ')}) {

}`
  }

  getFunctionName(codeValue: string) {
    const match = codeValue.match(DELEGUA_REGEX.nomeDeFuncaoQualquer)
    if (match) {
      return match[1] ?? ''
    }

    return ''
  }

  getFunctionParamsNames(codeValue: string) {
    const match = codeValue.match(DELEGUA_REGEX.parametrosDeFuncaoQualquer)

    if (match) {
      const params = match[1]?.split(',').map((param) => param.trim())
      if (Array.isArray(params)) return params
    }

    return []
  }

  getInputsCount(codeValue: string) {
    const regex = new RegExp(DELEGUA_REGEX.funcaoLeia, 'g')
    const comandosLeia = codeValue.match(regex)
    return comandosLeia?.length ?? 0
  }

  translateToCodeRunner(jsCode: unknown) {
    const tipo = this.obtenhaTipo(jsCode)

    if (tipo === 'nulo') {
      return 'nulo'
    }

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
    } catch {
      return codigo
    }
  }

  translateToJs(codeRunnerCode: string) {
    const lexador = new Lexador()
    const avaliadorSintatico = new AvaliadorSintatico()
    const resultadoLexico = lexador.mapear(codeRunnerCode.split('\n'), -1)
    const resultadoSintatico = avaliadorSintatico.analisar(resultadoLexico, -1)
    const tradutor = new TradutorJavaScript()
    const traducao = tradutor.traduzir(resultadoSintatico.declaracoes)
    return traducao.trim()
  }

  private obtenhaTipo(valor: unknown) {
    if (Array.isArray(valor)) {
      return 'lista'
    }

    if (valor === null) {
      return 'nulo'
    }

    switch (typeof valor) {
      case 'string':
        return 'texto'
      case 'number':
        return 'numero'
      case 'boolean':
        return 'lógico'
    }

    return 'texto'
  }

  private trateErro(erro: DeleguaErro) {
    const linhaDoErro = erro.linha ?? 0 // TODO: erro.linha pode ser undefined

    console.log('erro ->', erro)

    if ('erroInterno' in erro && erro.erroInterno instanceof Error) {
      return new CodeRunnerResponse({
        error: new CodeRunnerError(erro.erroInterno.message, linhaDoErro),
      })
    }

    if (erro instanceof Error) {
      return new CodeRunnerResponse({
        error: new CodeRunnerError(erro.message, linhaDoErro),
      })
    }

    let mensagemDeErro = String(erro.mensagem)

    mensagemDeErro = mensagemDeErro.includes('null') ? 'Código inválido' : mensagemDeErro

    const error = new CodeRunnerError(mensagemDeErro, linhaDoErro)

    return new CodeRunnerResponse({ error })
  }

  performSyntaxAnalysis(code: string): CodeRunnerResponse {
    const retornoLexador = this.lexador.mapear(code.split('\n'), -1)
    const retornoAvaliadorSintatico = this.avaliadorSintatico.analisar(retornoLexador, -1)
    if (retornoAvaliadorSintatico.erros.length > 0) {
      const errors = retornoAvaliadorSintatico.erros.map(
        (erro) => new CodeRunnerError(erro.message, erro.linha ?? 0),
      )
      return new CodeRunnerResponse({ errors })
    }

    return new CodeRunnerResponse({})
  }

  performSemanticAnalysis(code: string): CodeRunnerResponse {
    const retornoLexador = this.lexador.mapear(code.split('\n'), -1)
    const retornoAvaliadorSintatico = this.avaliadorSintatico.analisar(retornoLexador, -1)
    const analisadorSemantico = this.analisadorSemantico.analisar(
      retornoAvaliadorSintatico.declaracoes,
    )
    const errosAnaliseSemantica = analisadorSemantico.diagnosticos
    if (errosAnaliseSemantica.length > 0) {
      const errors = errosAnaliseSemantica.map(
        (erro) => new CodeRunnerError(erro.mensagem, erro.linha ?? 0),
      )
      return new CodeRunnerResponse({ errors })
    }
    return new CodeRunnerResponse({})
  }
}
