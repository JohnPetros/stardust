import {
  AvaliadorSintatico,
  Lexador,
  TradutorJavaScript,
  TradutorReversoJavaScript,
} from '@designliquido/delegua'
import { AnalisadorSemantico } from '@designliquido/delegua/analisador-semantico'
import { AvaliadorSintaticoJavaScript } from '@designliquido/delegua/avaliador-sintatico/traducao/avaliador-sintatico-javascript'
import { LexadorJavaScript } from '@designliquido/delegua/lexador/traducao/lexador-javascript'

import { LspResponse } from '@stardust/core/global/responses'
import { LspError } from '@stardust/core/global/errors'
import type { CodeInput } from '@stardust/core/global/types'
import type { LspProvider } from '@stardust/core/global/interfaces'

import { DELEGUA_REGEX } from './constants'
import type { DeleguaErro } from '../types/DeleguaErro'
import { DeleguaInterpretador } from './DeleguaInterpretador'

export class DeleguaLsp implements LspProvider {
  private readonly lexador: Lexador = new Lexador()
  private readonly avaliadorSintatico: AvaliadorSintatico = new AvaliadorSintatico()
  private readonly analisadorSemantico: AnalisadorSemantico = new AnalisadorSemantico()

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
    const resultadoLexador = this.lexador.mapear(code.split('\n'), -1)
    if (resultadoLexador.erros.length) {
      return this.trateErro(resultadoLexador.erros[0])
    }
    const resultadoAvaliacaoSintatica = await this.avaliadorSintatico.analisar(
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

    const resultadoInterpretadorFiltrado =
      resultadoInterpretador.resultado.filter(Boolean)

    if (resultadoInterpretadorFiltrado.length === 0) {
      return new LspResponse({ result: undefined })
    }

    let resultadoFinal = null
    let resultadoRetornado = resultadoInterpretadorFiltrado?.at(-1)

    if (typeof resultadoRetornado === 'string') {
      resultadoRetornado = JSON.parse(resultadoRetornado)
    }

    resultadoFinal = resultadoRetornado?.valorRetornado?.valor

    while ('valorRetornado' in resultadoFinal) {
      resultadoFinal = resultadoFinal.valorRetornado.valor
    }

    resultadoFinal = Array.isArray(resultadoFinal)
      ? resultadoFinal.map(this.pegarValorDeResultadoFinal)
      : this.pegarValorDeResultadoFinal(resultadoFinal)

    return new LspResponse({ result: resultadoFinal, outputs })
  }

  private pegarValorDeResultadoFinal(resultadoFinal: unknown) {
    if (
      typeof resultadoFinal === 'object' &&
      resultadoFinal !== null &&
      'valor' in resultadoFinal
    ) {
      return resultadoFinal.valor
    }

    return resultadoFinal
  }

  getInput(code: string) {
    const regex = DELEGUA_REGEX.conteudoDeFuncaoLeia
    const entrada = code.match(regex)

    return entrada ? entrada[0] : null
  }

  async addInputs(codeInputs: CodeInput[], codeValue: string) {
    let codigo = codeValue

    for (const input of codeInputs) {
      const entrada = await this.translateToLsp(input)
      codigo = codigo.replace(DELEGUA_REGEX.conteudoDeFuncaoLeia, entrada)
    }

    return codigo
  }

  async addFunctionCall(functionParams: unknown[], code: string) {
    const paramsValues: string[] = await Promise.all(
      functionParams.map(async (param) => {
        if (Array.isArray(param)) {
          const values = await Promise.all(
            param.map((value) => this.translateToLsp(value)),
          )
          return `[${values.join(',')}]`
        }
        return this.translateToLsp(param)
      }),
    )

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

  async translateToLsp(jsCode: unknown) {
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
      const resultadoSintatico = await avaliadorSintatico.analisar(resultadoLexico, -1)
      const tradutor = new TradutorReversoJavaScript()
      const traducao = tradutor.traduzir(resultadoSintatico.declaracoes)
      return traducao.trim().replace(' \n', '').replaceAll('\\"', '')
    } catch {
      return codigo
    }
  }

  async translateToJs(codeRunnerCode: string) {
    const lexador = new Lexador()
    const avaliadorSintatico = new AvaliadorSintatico()
    const resultadoLexico = lexador.mapear(codeRunnerCode.split('\n'), -1)
    const resultadoSintatico = await avaliadorSintatico.analisar(resultadoLexico, -1)
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
      return new LspResponse({
        error: new LspError(erro.erroInterno.message, linhaDoErro),
      })
    }

    if (erro instanceof Error) {
      return new LspResponse({
        error: new LspError(erro.message, linhaDoErro),
      })
    }

    let mensagemDeErro = String(erro.mensagem)

    mensagemDeErro = mensagemDeErro.includes('null') ? 'Código inválido' : mensagemDeErro

    const error = new LspError(mensagemDeErro, linhaDoErro)

    return new LspResponse({ error })
  }

  async performSyntaxAnalysis(code: string): Promise<LspResponse> {
    const retornoLexador = await this.lexador.mapear(code.split('\n'), -1)
    const retornoAvaliadorSintatico = await this.avaliadorSintatico.analisar(
      retornoLexador,
      -1,
    )
    if (retornoAvaliadorSintatico.erros.length > 0) {
      const errors = retornoAvaliadorSintatico.erros.map(
        (erro) => new LspError(erro.message, erro.linha ?? 0),
      )
      return new LspResponse({ errors })
    }

    return new LspResponse({})
  }

  async performSemanticAnalysis(code: string): Promise<LspResponse> {
    const retornoLexador = this.lexador.mapear(code.split('\n'), -1)
    const retornoAvaliadorSintatico = await this.avaliadorSintatico.analisar(
      retornoLexador,
      -1,
    )
    const analisadorSemantico = await this.analisadorSemantico.analisar(
      retornoAvaliadorSintatico.declaracoes,
    )
    const errosAnaliseSemantica = analisadorSemantico.diagnosticos
    if (errosAnaliseSemantica.length > 0) {
      const errors = errosAnaliseSemantica.map(
        (erro) => new LspError(String(erro.mensagem), erro.linha ?? 0),
      )
      return new LspResponse({ errors })
    }
    return new LspResponse({})
  }
}
