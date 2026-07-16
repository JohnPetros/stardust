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
import type {
  CodeInput,
  LspCompletion,
  LspCompletionKind,
  LspSnippet,
} from '@stardust/core/global/types'
import type { LspProvider } from '@stardust/core/global/interfaces'

import {
  DELEGUA_IDENTIFICADOR,
  DELEGUA_REGEX,
  DELEGUA_SNIPPETS,
  LABELS_DE_CONTROLE_DE_FLUXO,
  LABELS_DE_LITERAIS,
  LABELS_DE_PALAVRAS_CHAVE,
  LABELS_DE_SNIPPETS_ESTRUTURAIS,
} from './constants'
import type { DeleguaErro } from '../types/DeleguaErro'
import { DeleguaInterpretador } from './DeleguaInterpretador'

export class DeleguaProvedorLsp implements LspProvider {
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

    resultadoFinal = resultadoRetornado?.valorRetornado

    while (
      resultadoFinal !== null &&
      typeof resultadoFinal === 'object' &&
      'valorRetornado' in resultadoFinal
    ) {
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
    const regex = DELEGUA_REGEX.conteúdoDeFuncaoLeia
    const entrada = code.match(regex)

    return entrada ? entrada[0] : null
  }

  getCompletions(code: string): LspCompletion[] {
    const labelsExistentes = new Set<string>()
    const completions: LspCompletion[] = []

    for (const snippet of DELEGUA_SNIPPETS) {
      this.adicioneCompletion(completions, labelsExistentes, {
        label: snippet.label,
        code: snippet.code,
        kind: this.classifiqueSnippet(snippet),
      })
    }

    for (const completion of this.extraiaCompletionsDinamicas(code)) {
      this.adicioneCompletion(completions, labelsExistentes, completion)
    }

    return completions
  }

  async addInputs(codeInputs: CodeInput[], codeValue: string) {
    let codigo = codeValue

    for (const input of codeInputs) {
      const entrada = await this.translateToLsp(input)
      codigo = codigo.replace(DELEGUA_REGEX.conteúdoDeFuncaoLeia, entrada)
    }

    return codigo
  }

  async addFunctionCall(functionName: string, functionParams: unknown[], code: string) {
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

    return code.concat(`\n${functionName}${params};`)
  }

  buildFunction(functionName: string, functionParamsNames: string[]) {
    return `funcao ${functionName}(${functionParamsNames.join(', ')}) {

}`
  }

  getFunctionName(codeValue: string) {
    if (!codeValue) return ''
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

  private classifiqueSnippet(snippet: LspSnippet): LspCompletionKind {
    if (LABELS_DE_LITERAIS.has(snippet.label)) {
      return 'literal'
    }

    if (LABELS_DE_PALAVRAS_CHAVE.has(snippet.label)) {
      return 'keyword'
    }

    if (LABELS_DE_CONTROLE_DE_FLUXO.has(snippet.label)) {
      return 'control-flow'
    }

    if (LABELS_DE_SNIPPETS_ESTRUTURAIS.has(snippet.label)) {
      return 'snippet'
    }

    return 'function'
  }

  private extraiaCompletionsDinamicas(code: string): LspCompletion[] {
    const completions: LspCompletion[] = []
    const labelsExistentes = new Set<string>()
    const regexDeDeclaracaoDeVariavel = new RegExp(
      `\\b(?:variavel|variável|var|const|constante|fixo)\\s+(${DELEGUA_IDENTIFICADOR})`,
      'giu',
    )
    const regexDeDeclaracaoDeFuncao = new RegExp(
      `\\b(?:funcao|função)\\s+(${DELEGUA_IDENTIFICADOR})\\s*\\(([^)]*)\\)`,
      'giu',
    )

    for (const match of code.matchAll(regexDeDeclaracaoDeVariavel)) {
      this.adicioneCompletion(completions, labelsExistentes, {
        label: match[1] ?? '',
        code: match[1] ?? '',
        kind: 'variable',
      })
    }

    for (const match of code.matchAll(regexDeDeclaracaoDeFuncao)) {
      const nomeDaFuncao = match[1] ?? ''
      this.adicioneCompletion(completions, labelsExistentes, {
        label: nomeDaFuncao,
        code: `${nomeDaFuncao}(${this.criePlaceholdersDeParametros(match[2] ?? '')})`,
        kind: 'function',
      })

      for (const parametro of this.extraiaParametros(match[2] ?? '')) {
        this.adicioneCompletion(completions, labelsExistentes, {
          label: parametro,
          code: parametro,
          kind: 'parameter',
        })
      }
    }

    return completions
  }

  private extraiaParametros(parametros: string): string[] {
    return parametros
      .split(',')
      .map((parametro) => parametro.trim().match(DELEGUA_IDENTIFICADOR)?.[0] ?? '')
      .filter(Boolean)
  }

  private criePlaceholdersDeParametros(parametros: string): string {
    return this.extraiaParametros(parametros)
      .map((parametro, indice) => `\${${indice + 1}:${parametro}}`)
      .join(', ')
  }

  private adicioneCompletion(
    completions: LspCompletion[],
    labelsExistentes: Set<string>,
    completion: LspCompletion,
  ) {
    const labelNormalizado = completion.label.trim().toLocaleLowerCase('pt-BR')

    if (!labelNormalizado || labelsExistentes.has(labelNormalizado)) {
      return
    }

    labelsExistentes.add(labelNormalizado)
    completions.push(completion)
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

  async translateToJs(lspCode: string) {
    const lexador = new Lexador()
    const avaliadorSintatico = new AvaliadorSintatico()
    const resultadoLexico = lexador.mapear(lspCode.split('\n'), -1)
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
