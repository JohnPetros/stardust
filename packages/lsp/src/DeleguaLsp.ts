import {
  AvaliadorSintatico,
  FormatadorDelegua,
  Lexador,
  TradutorJavaScript,
  TradutorReversoJavaScript,
} from '@designliquido/delegua'
import { AnalisadorSemantico } from '@designliquido/delegua/analisador-semantico'
import { AvaliadorSintaticoJavaScript } from '@designliquido/delegua/avaliador-sintatico/traducao/avaliador-sintatico-javascript'
import type { Declaracao } from '@designliquido/delegua/declaracoes'
import { EstilizadorDelegua } from '@designliquido/delegua/estilizador/estilizador-delegua'
import { QuebradorDeLinha } from '@designliquido/delegua/estilizador/quebrador-linha'
import { RegraConvencaoNomenclatura } from '@designliquido/delegua/estilizador/regras/regra-convencao-nomenclatura'
import { RegraParadigmaConsistente } from '@designliquido/delegua/estilizador/regras/regra-paradigma-consistente'
import { LexadorJavaScript } from '@designliquido/delegua/lexador/traducao/lexador-javascript'
import type {
  DelimitadorTextoFormatacao,
  TipoParadigma,
} from '@designliquido/delegua/tipos'

import { LspError } from '@stardust/core/global/errors'
import type { LspProvider } from '@stardust/core/global/interfaces'
import { LspResponse } from '@stardust/core/global/responses'
import {
  LspFormatterConfiguration,
  LspLinterConfiguration,
  type LspParadigm,
  type TextDelimiter,
} from '@stardust/core/global/structures'
import type {
  LspFormatterConfigurationDto,
  LspLinterConfigurationDto,
} from '@stardust/core/global/structures/dtos'
import type { CodeInput } from '@stardust/core/global/types'

import { DELEGUA_REGEX } from './constants'
import type { DeleguaErro } from '../types/DeleguaErro'
import { DeleguaInterpretador } from './DeleguaInterpretador'

export class DeleguaLsp implements LspProvider {
  private static readonly DEFAULT_LINE_BREAK = '\n'
  private static readonly DEFAULT_INDENTATION_SIZE = 4

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
      return new LspResponse({ result: undefined, outputs })
    }

    let resultadoFinal = null
    let resultadoRetornado = resultadoInterpretadorFiltrado?.at(-1)

    if (typeof resultadoRetornado === 'string') {
      resultadoRetornado = JSON.parse(resultadoRetornado)
    }

    resultadoFinal = resultadoRetornado?.valorRetornado?.valor

    while (typeof resultadoFinal === 'object' && 'valorRetornado' in resultadoFinal) {
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

  async lintCode(code: string, linterConfigurationDto: LspLinterConfigurationDto) {
    const linterConfiguration = LspLinterConfiguration.create(linterConfigurationDto)

    if (!linterConfiguration.isEnabled.value) return code

    const rules: Array<RegraConvencaoNomenclatura | RegraParadigmaConsistente> = []

    if (linterConfiguration.namingConvention.isEnabled.value) {
      rules.push(
        new RegraConvencaoNomenclatura({
          variavel: this.mapVariableNamingConventionToDelegua(
            linterConfiguration.namingConvention.variableNaming.value,
          ),
          constante: this.mapConstantNamingConventionToDelegua(
            linterConfiguration.namingConvention.constantNaming.value,
          ),
          funcao: this.mapFunctionNamingConventionToDelegua(
            linterConfiguration.namingConvention.functionNaming.value,
          ),
        }),
      )
    }

    if (linterConfiguration.consistentParadigm.isEnabled.value) {
      rules.push(
        new RegraParadigmaConsistente({
          paradigma: this.mapParadigmToDelegua(
            linterConfiguration.consistentParadigm.paradigm.value,
          ),
        }),
      )
    }

    if (!rules.length) return code

    const declarations = await this.getDeclarations(code)
    const estilizador = new EstilizadorDelegua(rules)
    const lintedDeclarations = estilizador.estilizar(declarations)

    return this.formatDeclarations(
      lintedDeclarations,
      'preservar',
      DeleguaLsp.DEFAULT_INDENTATION_SIZE,
    )
  }

  async formatCode(
    code: string,
    formatterConfigurationDto: LspFormatterConfigurationDto,
  ) {
    const formatterConfiguration = LspFormatterConfiguration.create(
      formatterConfigurationDto,
    )
    const declarations = await this.getDeclarations(code)
    const mappedDelimiter = this.mapTextDelimiterToDelegua(
      formatterConfiguration.textDelimiter.value,
    )
    const formattedWithPreserveDelimiter = this.formatDeclarations(
      declarations,
      'preservar',
      formatterConfiguration.indentationSize.value,
    )

    const formattedCode = this.formatDeclarations(
      declarations,
      mappedDelimiter,
      formatterConfiguration.indentationSize.value,
    )
    const codeWithDelimiterFallback = this.applyTextDelimiterFallback(
      formattedCode,
      formattedWithPreserveDelimiter,
      formatterConfiguration.textDelimiter.value,
      mappedDelimiter,
    )
    const lineBreaker = new QuebradorDeLinha(
      formatterConfiguration.maxCharsPerLine.value,
      formatterConfiguration.indentationSize.value,
      DeleguaLsp.DEFAULT_LINE_BREAK,
    )

    return lineBreaker.quebrar(codeWithDelimiterFallback)
  }

  private async getDeclarations(code: string): Promise<Declaracao[]> {
    const lexingResult = this.lexador.mapear(code.split('\n'), -1)

    if (lexingResult.erros.length) {
      throw lexingResult.erros[0]
    }

    const parsingResult = await this.avaliadorSintatico.analisar(lexingResult, -1)

    if (parsingResult.erros.length) {
      throw parsingResult.erros[0]
    }

    return parsingResult.declaracoes
  }

  private formatDeclarations(
    declarations: Declaracao[],
    textDelimiter: DelimitadorTextoFormatacao,
    indentationSize: number,
  ) {
    const formatter = new FormatadorDelegua(
      DeleguaLsp.DEFAULT_LINE_BREAK,
      indentationSize,
      { delimitadorTexto: textDelimiter },
    )

    const codigoFormatado = formatter.formatar(declarations)

    return this.adicionarLinhaEmBrancoEmFuncoesVazias(codigoFormatado)
  }

  private adicionarLinhaEmBrancoEmFuncoesVazias(codigo: string) {
    return codigo.replace(DELEGUA_REGEX.funcaoVazia, '$1\n$2')
  }

  private mapTextDelimiterToDelegua(
    textDelimiter: TextDelimiter['value'],
  ): DelimitadorTextoFormatacao {
    switch (textDelimiter) {
      case 'single':
        return 'aspas-simples'
      case 'double':
        return 'aspas-duplas'
      default:
        return 'preservar'
    }
  }

  private mapParadigmToDelegua(paradigm: LspParadigm['value']): TipoParadigma {
    switch (paradigm) {
      case 'imperative':
        return 'imperativo'
      case 'infinitive':
        return 'infinitivo'
      default:
        return 'ambos'
    }
  }

  private mapVariableNamingConventionToDelegua(
    namingConvention: 'caixaCamelo' | 'caixa_cobra' | 'CaixaPascal' | 'CAIXA_ALTA',
  ): 'caixaCamelo' | 'caixa_cobra' | 'CaixaPascal' {
    if (namingConvention === 'CAIXA_ALTA') return 'caixaCamelo'

    return namingConvention
  }

  private mapConstantNamingConventionToDelegua(
    namingConvention: 'caixaCamelo' | 'caixa_cobra' | 'CaixaPascal' | 'CAIXA_ALTA',
  ): 'caixaCamelo' | 'CAIXA_ALTA' {
    if (namingConvention === 'caixa_cobra' || namingConvention === 'CaixaPascal') {
      return 'CAIXA_ALTA'
    }

    return namingConvention
  }

  private mapFunctionNamingConventionToDelegua(
    namingConvention: 'caixaCamelo' | 'caixa_cobra' | 'CaixaPascal' | 'CAIXA_ALTA',
  ): 'caixaCamelo' | 'caixa_cobra' | 'CaixaPascal' {
    if (namingConvention === 'CAIXA_ALTA') return 'caixaCamelo'

    return namingConvention
  }

  private applyTextDelimiterFallback(
    code: string,
    formattedWithPreserveDelimiter: string,
    textDelimiter: TextDelimiter['value'],
    mappedDelimiter: DelimitadorTextoFormatacao,
  ) {
    if (textDelimiter === 'preserve') return code

    if (formattedWithPreserveDelimiter !== code) return code

    if (mappedDelimiter === 'aspas-simples') {
      return code.replace(/"([^"\\]*(?:\\.[^"\\]*)*)"/g, (_, content: string) => {
        const escapedContent = content.replace(/'/g, "\\'")
        const normalizedContent = escapedContent.replace(/\\"/g, '"')
        return `'${normalizedContent}'`
      })
    }

    return code.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, (_, content: string) => {
      const escapedContent = content.replace(/"/g, '\\"')
      const normalizedContent = escapedContent.replace(/\\'/g, "'")
      return `"${normalizedContent}"`
    })
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
